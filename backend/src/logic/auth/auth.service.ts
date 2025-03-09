import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   *
   * @param userName
   * @param password
   * @returns boolean whether user credentials are correct
   */
  async signIn(userName: string, password: string): Promise<boolean> {
    const userExists = await this.usersService.findByWithPassword(userName);
    if (!userExists) {
      throw new HttpException(
        `User (${userName}) Does Not Exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bcrypt.compare(password, userExists.password);
  }
}
