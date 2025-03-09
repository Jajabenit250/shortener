import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { User } from 'src/database/entities/user.entity';
import { _400, _401 } from 'src/common/constants/error.constant';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
