import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, CommonUserStatus } from 'src/common/constants/enum.constant';
import { User } from 'src/database/entities/user.entity';

export class CreateUserDto extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}

/**
 * Data transfer object for user search response.
 */
export class UserSearchResponseDto {
  @ApiProperty({
    description: 'List of users matching the search criteria',
    type: [User],
  })
  users: User[];

  @ApiProperty({
    description: 'Total number of users matching the search criteria',
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of users per page',
    example: 20,
  })
  limit: number;
}

/**
 * Data transfer object for user profile response.
 */
export class UserProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  userName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User status',
    enum: CommonUserStatus,
  })
  status: CommonUserStatus;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  lastLogin: Date;

  @ApiProperty({
    description: 'URL statistics',
    example: {
      totalUrls: 42,
      totalClicks: 1250,
      activeUrls: 35,
    },
  })
  stats?: {
    totalUrls: number;
    totalClicks: number;
    activeUrls: number;
  };
}

/**
 * Data transfer object for user search filters.
 */
export class UserFiltersDto {
  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User status',
    enum: CommonUserStatus,
  })
  @IsEnum(CommonUserStatus)
  @IsOptional()
  status?: CommonUserStatus;

  @ApiPropertyOptional({
    description: 'Search query for email, name, or phone',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
