import { Module, OnModuleInit } from '@nestjs/common';
import { CardsModule } from 'src/cards/cards.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.getOrThrow('DATABASE_HOST'),
        dbName: configService.getOrThrow('DATABASE_NAME'),
        user: configService.getOrThrow('DATABASE_USER'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        port: configService.getOrThrow('DATABASE_PORT'),
        autoLoadEntities: true,
        driver: PostgreSqlDriver,
      }),
      // MikroORM DI requires knowledge of the driver being used for types.
      // https://github.com/mikro-orm/nestjs/pull/204
      driver: PostgreSqlDriver,
    }),
    ScheduleModule.forRoot(),
    CardsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.getMigrator().up();
  }
}
