import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { signInUserDto } from './dto/signin-user.dto';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import AppConfigs from '../../config/app-config/app.configs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Signs in user and returns jwt
   * @param loginUserDto
   * @returns
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signs in a user' })
  async signIn(@Body() loginUserDto: signInUserDto): Promise<any> {
    const { userName, password } = loginUserDto;
    const credentialsPass = await this.authService.signIn(userName, password);
    if (!credentialsPass) {
      throw new UnauthorizedException();
    }
    const payload = { userName };
    return {
      accessToken: jwt.sign(payload, AppConfigs.JWT_SECRET),
    };
  }
}
