import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { _401 } from 'src/common/constants/error.constant';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates JWT payload and returns user
   * This method is called for each protected route
   */
  async validate(payload: any) {
    try {
      // Get user id from payload
      const userId = payload.sub;

      // Find user by id
      const user = await this.usersService.findUserById(userId);

      // Check if user exists
      if (!user) {
        throw new UnauthorizedException(_401.INVALID_TOKEN);
      }

      // Return user without sensitive data
      delete user.password;
      delete user.refreshToken;

      return user;
    } catch (error) {
      throw new UnauthorizedException(_401.INVALID_TOKEN);
    }
  }
}
