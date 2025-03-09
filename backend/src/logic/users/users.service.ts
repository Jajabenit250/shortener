import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, ILike } from "typeorm";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { User } from "src/database/entities/user.entity";
import { UserRole, CommonUserStatus } from "src/common/constants/enum.constant";
import { _400, _404 } from "src/common/constants/error.constant";
import { CreateUserDto, UserFiltersDto, UserProfileResponseDto, UserSearchResponseDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password } = createUserDto;

      // Check if user with email already exists
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new BadRequestException(_400.EMAIL_ALREADY_EXISTS);
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create new user
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || UserRole.USER,
        status: createUserDto.status || CommonUserStatus.ACTIVE,
      });

      // Save and return user
      const savedUser = await this.userRepository.save(user);

      // Remove sensitive data before returning
      delete savedUser.password;
      delete savedUser.refreshToken;

      return savedUser;
    } catch (error) {
      this.logger.error(
        `User creation failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Find a user by ID
   */
  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(_404.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Finding user by ID failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Find a user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find a user by email with password
   */
  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'userName',
        'role',
        'status',
        'password',
      ],
    });
  }

  /**
   * Update a user
   */
  async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
    try {
      const user = await this.findUserById(id);

      // Check email uniqueness if changing email
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.findUserByEmail(updateUserDto.email);
        if (existingUser) {
          throw new BadRequestException(_400.EMAIL_ALREADY_EXISTS);
        }
      }

      // Update user
      Object.assign(user, updateUserDto);

      // Save and return updated user
      return this.userRepository.save(user);
    } catch (error) {
      this.logger.error(
        `User update failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Search for users
   */
  async searchUsers(
    filters: UserFiltersDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<UserSearchResponseDto> {
    try {
      const skip = (page - 1) * limit;

      // Build where conditions
      const where: FindOptionsWhere<User> = {};

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      // For text search
      if (filters.search) {
        return await this.searchUsersByText(filters.search, where, page, limit);
      }

      // Execute query
      const [users, total] = await this.userRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        users,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `User search failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Search users by text
   */
  private async searchUsersByText(
    search: string,
    existingWhere: FindOptionsWhere<User>,
    page: number,
    limit: number,
  ): Promise<UserSearchResponseDto> {
    try {
      const skip = (page - 1) * limit;

      // Build where conditions with text search
      const where = [
        { ...existingWhere, email: ILike(`%${search}%`) },
        { ...existingWhere, userName: ILike(`%${search}%`) },
      ];

      // Execute query
      const [users, total] = await this.userRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        users,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `User text search failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Get user profile with stats
   */
  async getUserProfile(userId: string): Promise<UserProfileResponseDto> {
    try {
      const user = await this.findUserById(userId);

      const stats = {
        totalUrls: 0,
        totalClicks: 0,
        activeUrls: 0,
      };

      return {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        stats,
      };
    } catch (error) {
      this.logger.error(
        `Get user profile failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Update refresh token
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  /**
   * Find a user by any condition
   */
  async findBy(condition: any): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: condition });
    } catch (error) {
      this.logger.error(
        `Find by condition failed: ${error.message}`,
        error.stack,
        UsersService.name,
      );
      throw error;
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>(
      'PASSWORD_HASH_ROUNDS',
      10,
    );
    return bcrypt.hash(password, saltRounds);
  }
}
