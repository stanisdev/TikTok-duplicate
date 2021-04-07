import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { User, UserStatus } from '../../entities/user.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class IsUserRegistered implements PipeTransform {
  constructor () {}

  async transform(userId: string, metadata: ArgumentMetadata) {
    const user = await getConnection().getRepository(User).findOne(userId);
    if (user?.status != UserStatus.REGISTRATION_COMPLETE) {
      throw new BadRequestException();
    }
    return user.id;
  }
}
