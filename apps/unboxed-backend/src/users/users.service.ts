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
}
