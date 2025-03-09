import { OmitType } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';

export class CreateUserDto extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
