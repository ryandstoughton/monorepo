import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chess } from 'chess.js';
import { GameService } from './game.service';
import { Public } from '../auth/public.decorator';

@Public()
@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // gameId -> Set of socketIds currently in the room
  private rooms = new Map<string, Set<string>>();

  // socketId -> { gameId, playerToken }
  private socketMeta = new Map<
    string,
    { gameId: string; playerToken: string }
  >();

  // gameId -> Set of playerTokens that have requested a rematch
  private rematchRequests = new Map<string, Set<string>>();

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: Socket) {
    const { gameId, playerToken } = client.handshake.auth as {
      gameId?: string;
      playerToken?: string;
    };

    if (!gameId || !playerToken) {
      client.emit('error', { message: 'Missing gameId or playerToken' });
      client.disconnect();
      return;
    }

    const game = await this.gameService.getGame(gameId);
    if (!game) {
      client.emit('error', { message: 'Game not found' });
      client.disconnect();
      return;
    }

    let role: 'white' | 'black' | 'spectator';

    if (game.whitePlayerToken === playerToken) {
      role = 'white';
    } else if (game.blackPlayerToken === playerToken) {
      role = 'black';
    } else if (!game.blackPlayerToken && game.status === 'waiting') {
      // Join as black
      const updated = await this.gameService.joinGame(gameId, playerToken);
      role = 'black';
      // Broadcast to room that black joined
      this.server.to(gameId).emit('player-joined', { color: 'black' });
      // Use updated game state
      void client.join(gameId);
      this.track(client.id, gameId, playerToken);
      const chess = new Chess(updated.fen);
      client.emit('game-joined', {
        role,
        fen: updated.fen,
        status: updated.status,
        turn: chess.turn(),
      });
      return;
    } else {
      role = 'spectator';
    }

    void client.join(gameId);
    this.track(client.id, gameId, playerToken);
    const chess = new Chess(game.fen);
    client.emit('game-joined', {
      role,
      fen: game.fen,
      status: game.status,
      turn: chess.turn(),
    });
  }

  handleDisconnect(client: Socket) {
    const meta = this.socketMeta.get(client.id);
    if (meta) {
      const room = this.rooms.get(meta.gameId);
      if (room) {
        room.delete(client.id);
        if (room.size === 0) this.rooms.delete(meta.gameId);
      }
      // Cancel any pending rematch request for this player
      this.rematchRequests.get(meta.gameId)?.delete(meta.playerToken);
      this.socketMeta.delete(client.id);
    }
  }

  @SubscribeMessage('move')
  async onMove(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { gameId: string; from: string; to: string; promotion?: string },
  ) {
    const { gameId, from, to, promotion } = payload;
    const meta = this.socketMeta.get(client.id);
    if (!meta || meta.gameId !== gameId) {
      client.emit('error', { message: 'Not in this game' });
      return;
    }

    const game = await this.gameService.getGame(gameId);
    if (!game || game.status !== 'active') {
      client.emit('error', { message: 'Game not active' });
      return;
    }

    const chess = new Chess(game.fen);
    const currentTurn = chess.turn(); // 'w' or 'b'

    const expectedToken =
      currentTurn === 'w' ? game.whitePlayerToken : game.blackPlayerToken;

    if (meta.playerToken !== expectedToken) {
      client.emit('error', { message: 'Not your turn' });
      return;
    }

    let moveResult;
    try {
      moveResult = chess.move({ from, to, promotion: promotion ?? 'q' });
    } catch {
      client.emit('error', { message: 'Invalid move' });
      return;
    }

    if (!moveResult) {
      client.emit('error', { message: 'Invalid move' });
      return;
    }

    let status = 'active';
    let winner: string | null = null;

    if (chess.isGameOver()) {
      status = 'finished';
      if (chess.isCheckmate()) {
        winner = currentTurn === 'w' ? 'white' : 'black';
      } else {
        winner = 'draw';
      }
    }

    const updated = await this.gameService.applyMove(
      gameId,
      chess.fen(),
      winner,
      status,
    );

    this.server.to(gameId).emit('move-made', {
      from,
      to,
      fen: updated.fen,
      turn: chess.turn(),
      status: updated.status,
      winner: updated.winner ?? undefined,
    });
  }

  @SubscribeMessage('rematch')
  async onRematch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string },
  ) {
    const { gameId } = payload;
    const meta = this.socketMeta.get(client.id);
    if (!meta || meta.gameId !== gameId) return;

    const game = await this.gameService.getGame(gameId);
    if (!game || game.status !== 'finished') return;

    const isPlayer =
      game.whitePlayerToken === meta.playerToken ||
      game.blackPlayerToken === meta.playerToken;
    if (!isPlayer) return;

    if (!this.rematchRequests.has(gameId)) {
      this.rematchRequests.set(gameId, new Set());
    }
    this.rematchRequests.get(gameId)!.add(meta.playerToken);

    // Notify the other player that this player wants a rematch
    client.to(gameId).emit('rematch-requested');

    // If both players have requested, start the rematch
    const requests = this.rematchRequests.get(gameId)!;
    const bothReady =
      game.blackPlayerToken !== null &&
      requests.has(game.whitePlayerToken) &&
      requests.has(game.blackPlayerToken);

    if (bothReady) {
      this.rematchRequests.delete(gameId);
      const updated = await this.gameService.resetGame(gameId);
      const chess = new Chess(updated.fen);

      // Emit individually so each client gets their new role
      for (const socketId of this.rooms.get(gameId) ?? []) {
        const sm = this.socketMeta.get(socketId);
        if (!sm) continue;
        const role =
          updated.whitePlayerToken === sm.playerToken
            ? 'white'
            : updated.blackPlayerToken === sm.playerToken
              ? 'black'
              : 'spectator';
        this.server.to(socketId).emit('rematch-started', {
          role,
          fen: updated.fen,
          turn: chess.turn(),
          status: updated.status,
        });
      }
    }
  }

  private track(socketId: string, gameId: string, playerToken: string) {
    this.socketMeta.set(socketId, { gameId, playerToken });
    if (!this.rooms.has(gameId)) this.rooms.set(gameId, new Set());
    this.rooms.get(gameId)!.add(socketId);
  }
}
