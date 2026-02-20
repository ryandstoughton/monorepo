import { Controller, Get, Patch, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

interface Auth0JwtPayload {
  sub: string;
  'https://chessbro.com/email'?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: Request) {
    const payload = req.user as Auth0JwtPayload;
    const auth0Id = payload.sub;
    const email = payload['https://chessbro.com/email'] ?? '';

    return this.usersService.findOrCreateByAuth0Id(auth0Id, email);
  }

  @Patch('me')
  async linkAnon(@Req() req: Request, @Body() body: { anonId: string }) {
    const payload = req.user as Auth0JwtPayload;
    await this.usersService.linkAnonId(payload.sub, body.anonId);
  }
}
