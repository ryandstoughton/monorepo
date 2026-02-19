import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';

interface Auth0JwtPayload {
  sub: string;
  'https://unboxed.com/email'?: string;
  'https://unboxed.com/name'?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const payload = req.user as Auth0JwtPayload;
    const auth0Id = payload.sub;
    const email = payload['https://unboxed.com/email'] ?? '';
    const name = payload['https://unboxed.com/name'];

    return this.usersService.findOrCreateByAuth0Id(auth0Id, email, name);
  }
}
