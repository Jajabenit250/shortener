import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UrlStatus } from 'src/common/constants/enum.constant';

/**
 * Data transfer object for URL creation
 */
export class CreateUrlDto {
  @ApiProperty({
    description: 'Original long URL to be shortened',
    example: 'https://example.com/very/long/path',
  })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsNotEmpty()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the shortened URL',
    example: 'my-custom-link',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  alias?: string;

  @ApiPropertyOptional({
    description: 'URL expiration date',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Password protect the URL',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPasswordProtected?: boolean;

  @ApiPropertyOptional({
    description: 'Password for protected URL',
    example: 'securePassword123',
  })
  @IsString()
  @IsOptional()
  password?: string;
}

/**
 * Data transfer object for URL update
 */
export class UpdateUrlDto {
  @ApiPropertyOptional({
    description: 'Original long URL',
    example: 'https://example.com/updated/path',
  })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsOptional()
  originalUrl?: string;

  @ApiPropertyOptional({
    description: 'URL expiration date',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Password protect the URL',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPasswordProtected?: boolean;

  @ApiPropertyOptional({
    description: 'Password for protected URL',
    example: 'newSecurePassword123',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'URL status',
    enum: UrlStatus,
    example: UrlStatus.ACTIVE,
  })
  @IsEnum(UrlStatus)
  @IsOptional()
  status?: UrlStatus;
}

/**
 * Data transfer object for accessing a password-protected URL
 */
export class AccessUrlDto {
  @ApiProperty({
    description: 'Password for the protected URL',
    example: 'securePassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * Data transfer object for URL search filters
 */
export class UrlFiltersDto {
  @ApiPropertyOptional({
    description: 'Search term for original URL or alias',
    example: 'example.com',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by URL status',
    enum: UrlStatus,
    example: UrlStatus.ACTIVE,
  })
  @IsEnum(UrlStatus)
  @IsOptional()
  status?: UrlStatus;
}

/**
 * Data transfer object for URL search response
 */
export class UrlSearchResponseDto {
  @ApiProperty({
    description: 'List of URLs',
    type: 'array',
    isArray: true,
  })
  urls: UrlResponseDto[];

  @ApiProperty({
    description: 'Total number of matching URLs',
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of URLs per page',
    example: 20,
  })
  limit: number;
}

/**
 * Data transfer object for URL response
 */
export class UrlResponseDto {
  @ApiProperty({
    description: 'URL ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Original URL',
    example: 'https://example.com/very/long/path',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'URL alias/short code',
    example: 'my-link',
  })
  alias: string;

  @ApiProperty({
    description: 'Full shortened URL',
    example: 'https://short.url/my-link',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'URL creation date',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'URL expiration date',
    example: '2023-12-31T23:59:59.999Z',
  })
  expiresAt?: Date;

  @ApiProperty({
    description: 'Number of clicks',
    example: 42,
  })
  clicks: number;

  @ApiProperty({
    description: 'User ID who created this URL',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'URL status',
    enum: UrlStatus,
    example: UrlStatus.ACTIVE,
  })
  status: UrlStatus;

  @ApiProperty({
    description: 'Whether the URL is password protected',
    example: false,
  })
  isPasswordProtected: boolean;
}

/**
 * Data transfer object for URL analytics
 */
export class UrlAnalyticsDto {
  @ApiProperty({
    description: 'Total clicks',
    example: 1245,
  })
  totalClicks: number;

  @ApiProperty({
    description: 'Unique visitors count',
    example: 876,
  })
  uniqueVisitors: number;

  @ApiProperty({
    description: 'Referrer statistics',
    example: {
      'google.com': 35,
      'facebook.com': 25,
      'twitter.com': 15,
      direct: 25,
    },
  })
  referrers: Record<string, number>;

  @ApiProperty({
    description: 'Browser statistics',
    example: {
      Chrome: 60,
      Firefox: 20,
      Safari: 15,
      Other: 5,
    },
  })
  browsers: Record<string, number>;

  @ApiProperty({
    description: 'Device statistics',
    example: {
      Desktop: 70,
      Mobile: 25,
      Tablet: 5,
    },
  })
  devices: Record<string, number>;

  @ApiProperty({
    description: 'Click timeline',
    example: [
      { date: '2023-10-01', clicks: 45 },
      { date: '2023-10-02', clicks: 63 },
      { date: '2023-10-03', clicks: 52 },
    ],
  })
  timeline: { date: string; clicks: number }[];
}
