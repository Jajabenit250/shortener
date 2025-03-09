import { PickType } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';

export class signInUserDto extends PickType(User, [
  'userName',
  'password',
] as const) {}
