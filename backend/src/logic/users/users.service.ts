import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/database/entities/user.entity";
import { CreateUserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    return this.usersRepository.save({ ...createUserDto, password });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findBy(condition: any): Promise<User | null> {
    return this.usersRepository.findOne({ where: condition });
  }

  async findByWithPassword(userName: string) {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect(["user.password"])
      .where("user.userName = :userName", { userName })
      .getOne();
    return user;
  }
}
