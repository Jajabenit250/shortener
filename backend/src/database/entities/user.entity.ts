import { Column, Entity, Index } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

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
}
