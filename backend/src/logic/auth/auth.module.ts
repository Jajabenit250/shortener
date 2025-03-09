import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GithubService } from 'src/integration/github/github.service';
import { GoogleService } from 'src/integration/google/google.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleService,
    GithubService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
