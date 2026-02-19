import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database';
import type { DrizzleDB } from '../database/database';
import { users } from '../database/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db.select().from(users);
  }

  findOne(id: number) {
    return this.db.select().from(users).where(eq(users.id, id));
  }

  async findOrCreateByAuth0Id(auth0Id: string, email: string, name?: string) {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(eq(users.auth0Id, auth0Id));

    if (existing) {
      return existing;
    }

    const [created] = await this.db
      .insert(users)
      .values({ auth0Id, email, name })
      .returning();

    return created;
  }
}
