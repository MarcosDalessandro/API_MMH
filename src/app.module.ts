import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { EntitiesModule } from './entities/entities.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GameModule } from './game/game.module';
import { ForwardingModule } from './testAxios/forwarding.module';
import { ScalingModule } from './scaling/scaling.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'db_mmh'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        synchronize: true,
        logging: true,  // Ativa o log detalhado
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
      }),
    }),
    UsersModule,
    EntitiesModule,
    AuthModule,
    GameModule,
    ForwardingModule,
    ScalingModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }
  ],
})
export class AppModule { }
