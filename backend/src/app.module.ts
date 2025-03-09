import { Module } from '@nestjs/common';
import { UsersModule } from './logic/users/users.module';
import { AuthModule } from './logic/auth/auth.module';
import { AppConfigModule } from './config/app-config/app-config.module';
import { LoggerModule } from 'nestjs-pino';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
