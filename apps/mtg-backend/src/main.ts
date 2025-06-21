import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  setInterval(() => {
    const mem = process.memoryUsage();
    console.log(
      `Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB | Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB | RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
    );
  }, 5000);

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
