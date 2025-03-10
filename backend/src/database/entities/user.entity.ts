import { Column, Entity, Index, OneToMany } from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { CommonEntity } from './common.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserRole, CommonUserStatus, AuthProvider } from 'src/common/constants/enum.constant';
import { Exclude } from 'class-transformer';
import { Url } from './url.entity';

@Entity()
export class User extends CommonEntity {
  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  @IsEmail()
  @Index()
  email: string;
  
  @ApiProperty({ description: 'Username for login' })
  @Column({ unique: true, name: 'username' })
  @IsString()
  @IsNotEmpty()
  @Index()
  userName: string;

  @ApiProperty({ description: 'Display name' })
  @Column({ length: 100, nullable: true })
  @IsString()
  @IsOptional()
  displayName: string;

  @Column({ select: false, name: 'password_hash' })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;

  @ApiProperty({ description: 'Whether email is verified' })
  @Column({ default: false })
  @IsBoolean()
  isEmailVerified: boolean;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'User account status', enum: CommonUserStatus })
  @Column({
    type: 'enum',
    enum: CommonUserStatus,
    default: CommonUserStatus.ACTIVE,
  })
  @IsEnum(CommonUserStatus)
  status: CommonUserStatus;

  @ApiProperty({ description: 'Authentication provider', enum: AuthProvider })
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
    nullable: true,
  })
  @IsEnum(AuthProvider)
  @IsOptional()
  authProvider: AuthProvider;

  @ApiProperty({ description: 'ID from OAuth provider' })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  authProviderId: string;

  @ApiHideProperty()
  @Column({ select: false, nullable: true })
  @Exclude()
  refreshToken: string;

  @ApiProperty({ description: 'Last login timestamp' })
  @Column({ nullable: true })
  lastLogin: Date;

  @ApiProperty({ description: 'Maximum URLs allowed' })
  @Column({ default: 100 })
  urlLimit: number;

  @ApiProperty({ description: 'API key for programmatic access' })
  @Column({ nullable: true, select: false })
  @Exclude()
  apiKey: string;

  @ApiProperty({ description: 'User preferences (JSON)' })
  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  @ApiHideProperty()
  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];
}
