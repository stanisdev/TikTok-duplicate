import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SmsCodeLifetime } from './auth.interface';
import { User } from "src/entities/user.entity";
import { Code } from 'src/entities/code.entity';
import { nanoid } from 'nanoid/async'
import * as moment from 'moment';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

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

  async createSmsCode(
    user: User,
    code: string,
    lifetime: SmsCodeLifetime
  ): Promise<void> {
    const expireAt = moment()
      .add(
        lifetime.amount,
        lifetime.unit as 'hours' | 'days'
      )
      .toDate();
    const record = new Code();
    record.code = code;
    record.user = user;
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
}
