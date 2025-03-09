import { 
  BadRequestException,
  HttpException, 
  HttpStatus, 
  Injectable, 
  Logger,
  UnauthorizedException 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import AppConfigs from '../../config/app-config/app.configs';
import { _400, _401 } from 'src/common/constants/error.constant';
import { LoginRequestDto, GoogleAuthDto, GithubAuthDto } from './dto/signin-user.dto';
import { GoogleService } from 'src/integration/google/google.service';
import { GithubService } from 'src/integration/github/github.service';
import { AuthProvider, CommonUserStatus, UserRole } from 'src/common/constants/enum.constant';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private googleService: GoogleService,
    private githubService: GithubService
  ) {}

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain password with a hashed password
   */
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(user: any): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: AppConfigs.JWT_SECRET,
      expiresIn: '15m'
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: AppConfigs.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }

  /**
   * Log in a user with email and password
   */
  async login(data: LoginRequestDto): Promise<any> {
    try {
      const { email, password } = data;

      if (!email || !password) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }

      // Find user with password
      const user = await this.usersService.findUserByEmailWithPassword(email);
      if (!user) {
        throw new UnauthorizedException(_401.INVALID_CREDENTIALS);
      }

      // Verify password
      const passwordValid = await this.comparePasswords(
        password,
        user.password,
      );
      if (!passwordValid) {
        throw new UnauthorizedException(_401.INVALID_CREDENTIALS);
      }

      // Update last login timestamp
      await this.usersService.updateLastLogin(user.id);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Store refresh token in user record
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      // Remove sensitive data
      delete user.password;
      delete user.refreshToken;

      // Return response
      return {
        ...tokens,
        user,
      };
    } catch (error) {
      this.logger.error(
        `Login failed: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  /**
   * Authenticate with Google
   */
  async googleAuth(data: GoogleAuthDto): Promise<any> {
    try {
      const { idToken } = data;

      if (!idToken) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }

      // Verify Google token and get user info
      const googleUser = await this.googleService.verifyIdToken(idToken);

      if (!googleUser.email) {
        throw new UnauthorizedException(_401.INVALID_CREDENTIALS);
      }

      // Find or create user
      let user = await this.usersService.findUserByEmail(googleUser.email);

      if (user) {
        // User exists - update if needed
        if (user.authProvider !== AuthProvider.GOOGLE) {
          // Link accounts
          user = await this.usersService.updateUser(user.id, {
            authProvider: AuthProvider.GOOGLE,
            authProviderId: googleUser.id,
          });
        }
      } else {
        // Create new user
        user = await this.usersService.create({
          email: googleUser.email,
          userName: googleUser.name || googleUser.email.split('@')[0],
          password: await this.hashPassword(randomBytes(16).toString('hex')),
          role: UserRole.USER,
          status: CommonUserStatus.ACTIVE,
          authProvider: AuthProvider.GOOGLE,
          authProviderId: googleUser.id,
          refreshToken: '',
          lastLogin: undefined,
          deletedAt: undefined,
          urls: [],
          isEmailVerified: false,
          displayName: '',
          urlLimit: 0,
          apiKey: '',
          preferences: undefined
        });
      }

      // Update last login
      await this.usersService.updateLastLogin(user.id);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Store refresh token
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      // Return response
      return {
        ...tokens,
        user,
      };
    } catch (error) {
      this.logger.error(
        `Google auth failed: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  /**
   * Authenticate with GitHub
   */
  async githubAuth(data: GithubAuthDto): Promise<any> {
    try {
      const { code } = data;

      if (!code) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }

      // Exchange code for access token and get user info
      const { accessToken, userInfo } =
        await this.githubService.getAccessTokenFromCode(code);

      if (!userInfo.email) {
        throw new UnauthorizedException(_401.INVALID_CREDENTIALS);
      }

      // Find or create user
      let user = await this.usersService.findUserByEmail(userInfo.email);

      if (user) {
        // User exists - update if needed
        if (user.authProvider !== AuthProvider.GITHUB) {
          // Link accounts
          user = await this.usersService.updateUser(user.id, {
            authProvider: AuthProvider.GITHUB,
            authProviderId: userInfo.id.toString(),
          });
        }
      } else {
        // Create new user
        user = await this.usersService.create({
          email: userInfo.email,
          userName: userInfo.name || userInfo.login,
          password: await this.hashPassword(randomBytes(16).toString('hex')),
          role: UserRole.USER,
          status: CommonUserStatus.ACTIVE,
          authProvider: AuthProvider.GITHUB,
          authProviderId: userInfo.id.toString(),
          refreshToken: '',
          lastLogin: undefined,
          deletedAt: undefined,
          isEmailVerified: false,
          urls: [],
          displayName: '',
          urlLimit: 0,
          apiKey: '',
          preferences: undefined
        });
      }
      // Update last login
      await this.usersService.updateLastLogin(user.id);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Store refresh token
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      // Return response
      return {
        ...tokens,
        user,
      };
    } catch (error) {
      this.logger.error(
        `GitHub auth failed: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      if (!refreshToken) {
        throw new BadRequestException(_400.MISSING_REQUIRED_FIELD);
      }

      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: AppConfigs.JWT_REFRESH_SECRET,
      });

      // Find user by ID from token
      const user = await this.usersService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(_401.INVALID_TOKEN);
      }

      // Check if the refresh token matches the stored one
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException(_401.INVALID_TOKEN);
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update refresh token in database
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      this.logger.error(
        `Refresh token failed: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException(_401.INVALID_TOKEN);
    }
  }
}
