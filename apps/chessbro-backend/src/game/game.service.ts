import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database';
import type { DrizzleDB } from '../database/database';
import { games } from '../database/schema';

export type Game = typeof games.$inferSelect;

@Injectable()
export class GameService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDB) {}

  async createGame(whitePlayerToken: string): Promise<Game> {
    const [game] = await this.db
      .insert(games)
      .values({ whitePlayerToken })
      .returning();
    return game;
  }

  async getGame(id: string): Promise<Game | null> {
    const [game] = await this.db.select().from(games).where(eq(games.id, id));
    return game ?? null;
  }

  async joinGame(id: string, blackPlayerToken: string): Promise<Game> {
    const [game] = await this.db
      .update(games)
      .set({ blackPlayerToken, status: 'active', updatedAt: new Date() })
      .where(eq(games.id, id))
      .returning();
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async applyMove(
    id: string,
    fen: string,
    winner: string | null,
    status: string,
  ): Promise<Game> {
    const [game] = await this.db
      .update(games)
      .set({ fen, winner, status, updatedAt: new Date() })
      .where(eq(games.id, id))
      .returning();
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async resetGame(id: string): Promise<Game> {
    const current = await this.getGame(id);
    if (!current) throw new NotFoundException('Game not found');

    const [game] = await this.db
      .update(games)
      .set({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        status: 'active',
        winner: null,
        // Swap colors for the rematch
        whitePlayerToken: current.blackPlayerToken!,
        blackPlayerToken: current.whitePlayerToken,
        updatedAt: new Date(),
      })
      .where(eq(games.id, id))
      .returning();
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }
}
