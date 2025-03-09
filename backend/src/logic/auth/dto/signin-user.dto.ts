import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { User } from 'src/database/entities/user.entity';

export class signInUserDto extends PickType(User, [
  'userName',
  'password',
] as const) {}

export class LoginRequestDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Google ID token from authentication',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY4NWY1MWI0ZTI0ZjU1ZjE...',
  })
  @IsNotEmpty({ message: 'Google ID token is required' })
  @IsString({ message: 'Google ID token must be a string' })
  idToken: string;
}

export class GithubAuthDto {
  @ApiProperty({
    description: 'GitHub authorization code',
    example: '30c2a95a193cac91829b',
  })
  @IsNotEmpty({ message: 'GitHub authorization code is required' })
  @IsString({ message: 'GitHub authorization code must be a string' })
  code: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token',
    example: '30c2a95a193cac91829b',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}
