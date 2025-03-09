import { Module } from '@nestjs/common';
import { UsersModule } from './logic/users/users.module';
import { AuthModule } from './logic/auth/auth.module';
import { AppConfigModule } from './config/app-config/app-config.module';
import { LoggerModule } from 'nestjs-pino';
import { UrlsModule } from './logic/urls/urls.module';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { JWTAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    UsersModule,
    AuthModule,
    UrlsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_GUARD, useClass: JWTAuthGuard },
  ],
})
export class AppModule {}
