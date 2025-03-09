import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { AuthenticatedUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/database/entities/user.entity';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a user's account
   * @param createUserDto
   * @returns
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    const { userName } = createUserDto;
    const userExists = await this.usersService.findBy({ userName });
    if (userExists) {
      throw new HttpException(
        `User (${userName}) Already Exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = await this.usersService.create({
      ...createUserDto,
    });

    return _.omit(createdUser, ['password']);
  }

  /**
   * Get current user
   * @param user
   * @returns
   */
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get user account profile' })
  get(@AuthenticatedUser() user) {
    return user;
  }
}
