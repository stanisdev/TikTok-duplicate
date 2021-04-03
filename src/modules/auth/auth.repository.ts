import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeLifetime } from './auth.interface';
import { User } from '../../../src/entities/user.entity';
import { Code } from '../../../src/entities/code.entity';
import { nanoid } from 'nanoid/async';
import * as moment from 'moment';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,

    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
  ) {}

  async createInitialUser(phone: string): Promise<User> {
    const user = new User();
    user.phone = phone;
    user.username = await nanoid(40);
    user.password = '';
    user.salt = '';
    user.status = 0;

    await this.userRepository.save(user);
    return user;
  }

  async createCode(
    user: User,
    code: string,
    lifetime: CodeLifetime,
    type: number,
  ): Promise<void> {
    const expireAt = moment()
      .add(lifetime.amount, lifetime.unit as 'hours' | 'days')
      .toDate();
    const record = new Code();
    record.code = code;
    record.user = user;
    record.type = type;
    record.expireAt = expireAt;

    await this.codeRepository.save(record);
  }

  findUserByPhone(phone: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .select(['id', 'status'])
      .where('user.phone = :phone', { phone })
      .getRawOne<User>();
  }

  async removeAllSmsCodes(user: User): Promise<void> {
    await this.codeRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: user.id })
      .execute();
  }

  findUserBySmsCode(code: string): Promise<Code> {
    return this.codeRepository
      .createQueryBuilder('codeTable')
      .innerJoinAndSelect('codeTable.user', 'user')
      .select(['codeTable.id', 'codeTable.expireAt', 'user.id', 'user.status'])
      .where('codeTable.code = :code', { code })
      .getOne();
  }

  async updateUserStatus(user: User, status: number): Promise<void> {
    user.status = status;
    await this.userRepository.save(user);
  }

  async doesUsernameExist(username: string): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('id')
      .where('user.username = :username', { username })
      .getRawOne<User>();

    return user instanceof Object;
  }
}
