import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

interface Auth0JwtPayload {
  sub: string;
  'https://unboxed.com/email'?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: Request) {
    const payload = req.user as Auth0JwtPayload;
    const auth0Id = payload.sub;
    const email = payload['https://unboxed.com/email'] ?? '';

    return this.usersService.findOrCreateByAuth0Id(auth0Id, email);
  }
}
