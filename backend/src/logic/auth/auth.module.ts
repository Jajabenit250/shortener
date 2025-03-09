import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, JwtService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtService, AuthGuard],
})
export class AuthModule {}
