import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) { }
  public async create(createUserDto: CreateUserDto): Promise<string> {
    return this.cache.set(`user.${createUserDto.id}`, JSON.stringify(createUserDto));
  }

  public async findAll(): Promise<unknown> {
    return this.cache.get('user');
  }

  public async findOne(id: number): Promise<CreateUserDto> {
    const user = await this.cache.get(`user.${id}`) as string
    return JSON.parse(user) as CreateUserDto;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<string> {
    const user = await this.cache.get(`user.${id}`);
    if (user) {
      return this.cache.set(`user.${id}`, JSON.stringify(updateUserDto));
    }
    return this.create({
      ...updateUserDto as CreateUserDto,
    });
  }

  public async remove(id: number): Promise<void> {
    return this.cache.del(`user.${id}`);
  }
}
