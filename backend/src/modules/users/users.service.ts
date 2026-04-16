import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(payload: CreateUserDto) {
    const entity = this.usersRepository.create(payload);
    return this.usersRepository.save(entity);
  }

  findAll() {
    return this.usersRepository.find({ order: { name: 'ASC' } });
  }
}
