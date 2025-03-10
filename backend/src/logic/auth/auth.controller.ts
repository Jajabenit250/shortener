import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { GithubAuthDto, GoogleAuthDto, LoginRequestDto, RefreshTokenRequestDto, signInUserDto } from './dto/signin-user.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { _400, _401 } from 'src/common/constants/error.constant';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from '../users/dto/user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthenticatedUser } from 'src/common/decorators/user.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Open Registration' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.createUser(createUserDto);
  }

  /**
   * Signs in user and returns JWT tokens
   * @param loginUserDto
   * @returns Access token, refresh token and user data
   */
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully signed in' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async signIn(@Body() loginUserDto: LoginRequestDto): Promise<any> {
    try {
      if (!loginUserDto.email || !loginUserDto.password) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }
      
      const result = await this.authService.login({
        email: loginUserDto.email,
        password: loginUserDto.password
      });
      return result;
    } catch (error) {
      this.logger.error(`Sign in failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Logs out a user by invalidating their refresh token
   * @returns Success message
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully signed out' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async logout(@AuthenticatedUser() user: User): Promise<{ message: string }> {
    try {
      await this.authService.logout(user.id);
      return { message: 'Successfully logged out' };
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Authenticates with Google
   * @param googleAuthDto
   * @returns Access token, refresh token and user data
   */
  @Post('google')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with Google' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully authenticated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid token' })
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto): Promise<any> {
    try {
      if (!googleAuthDto.idToken) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }
      
      return await this.authService.googleAuth(googleAuthDto);
    } catch (error) {
      this.logger.error(`Google auth failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Authenticates with GitHub
   * @param githubAuthDto
   * @returns Access token, refresh token and user data
   */
  @Post('github')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with GitHub' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully authenticated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid token' })
  async githubAuth(@Body() githubAuthDto: GithubAuthDto): Promise<any> {
    try {
      if (!githubAuthDto.code) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }
      
      return await this.authService.githubAuth(githubAuthDto);
    } catch (error) {
      this.logger.error(`GitHub auth failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Refreshes access token using refresh token
   * @param refreshTokenDto
   * @returns New access token and refresh token
   */
  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully refreshed token' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<any> {
    try {
      if (!refreshTokenDto.refreshToken) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }
      
      return await this.authService.refreshToken(refreshTokenDto.refreshToken);
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
