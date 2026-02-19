import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.headers['x-admin-api-key'] as string | undefined;
    const expected = this.configService.getOrThrow<string>('ADMIN_API_KEY');

    if (!key || key !== expected) {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }
}
