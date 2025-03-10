import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsUrl, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';
import { UrlStatus } from 'src/common/constants/enum.constant';

@Entity('urls')
export class Url extends CommonEntity {
  @ApiProperty({ description: 'Original long URL' })
  @Column({ type: 'text', name: 'long_url' })
  @IsUrl()
  longUrl: string;

  @ApiProperty({ description: 'Short URL alias/code' })
  @Column({ length: 100, name: 'short_code' })
  @Index({ unique: true })
  @IsString()
  shortCode: string;

  @ApiProperty({ description: 'URL title for organization' })
  @Column({ length: 255, nullable: true })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'URL status', enum: UrlStatus })
  @Column({ type: 'enum', enum: UrlStatus, default: UrlStatus.ACTIVE })
  @IsEnum(UrlStatus)
  status: UrlStatus;

  @ApiProperty({ description: 'URL expiration date' })
  @Column({ nullable: true })
  @IsOptional()
  expiresAt: Date;

  @ApiProperty({ description: 'Click count' })
  @Column({ default: 0 })
  clicks: number;

  @ApiProperty({ description: 'Last click timestamp' })
  @Column({ nullable: true })
  lastClickedAt: Date;

  @ApiProperty({ description: 'Whether the URL is password protected' })
  @Column({ default: false })
  @IsBoolean()
  isPasswordProtected: boolean;

  @ApiHideProperty()
  @Column({ nullable: true, select: false })
  password: string;

  @ApiProperty({ description: 'Custom domain for the short URL' })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  customDomain: string;

  @ApiProperty({ description: 'Category/tag for organization' })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ description: 'User ID who created this URL' })
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.urls)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Device info from clicks (JSON)' })
  @Column({ type: 'json', nullable: true })
  deviceInfo: Record<string, any>;

  @ApiProperty({ description: 'Referrer domains (JSON)' })
  @Column({ type: 'json', nullable: true })
  referrers: Record<string, number>;
}
