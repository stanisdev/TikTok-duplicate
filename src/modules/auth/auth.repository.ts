import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeLifetime } from './auth.interface';
import { User, UserStatus, Code } from '../../entities';
import { nanoid } from 'nanoid/async';
import * as moment from 'moment';

@Injectable()
export class AuthServiceRepository {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,

    @InjectRepository(Code)
    public readonly codeRepository: Repository<Code>,
  ) {}

  async createInitialUser(phone: string): Promise<User> {
    const user = new User();
    user.phone = phone;
    user.username = await nanoid(40);
    user.password = '';
    user.salt = '';
    user.status = UserStatus.INITIAL;

    await this.userRepository.save(user);
    return user;
  }

  async createCode(
    user: User,
    code: string,
    lifetime: CodeLifetime,
    type: number,
    parentCodeId?: number,
  ): Promise<Code> {
    const expireAt = moment()
      .add(lifetime.amount, lifetime.unit as 'hours' | 'days')
      .toDate();
    const record = new Code();
    record.code = code;
    record.user = user;
    record.type = type;
    record.expireAt = expireAt;
    record.parentCodeId = parentCodeId;

    return this.codeRepository.save(record);
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

  findUserByCode(code: string): Promise<Code> {
    return this.codeRepository
      .createQueryBuilder('codeTable')
      .innerJoinAndSelect('codeTable.user', 'user')
      .where('codeTable.code = :code', { code })
      .getOne();
  }

  async doesUsernameExist(username: string): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('id')
      .where('user.username = :username', { username })
      .getRawOne<User>();

    return user instanceof Object;
  }

  async removeAllAuthTokens(userId: string): Promise<void> {
    const types = [1, 2];

    await this.codeRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere('type IN (:...types)', { types })
      .execute();
  }
}
