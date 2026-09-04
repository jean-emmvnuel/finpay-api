import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { WalletModule } from './wallet/wallet.module';
import * as winston from 'winston';

@Module({
  imports: [
    AuthModule,
    // Configuration des Logs (Winston)
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        // Exemple : Log dans un fichier en cas d'erreur
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),
      ],
    }),
    // Sécurité : Rate Limiting (10 requêtes max par minute par IP par défaut)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    WalletModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
