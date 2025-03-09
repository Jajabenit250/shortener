import { Column, Entity, Index } from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonEntity } from './common.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserRole, CommonUserStatus, AuthProvider } from 'src/common/constants/enum.constant';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends CommonEntity {
  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  @IsEmail()
  @Index()
  email: string;
  
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  password: string;

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

  // @ApiHideProperty()
  // @OneToMany(() => Url, (url) => url.user)
  // urls: Url[];
}
