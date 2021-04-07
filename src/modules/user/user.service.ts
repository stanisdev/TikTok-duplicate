import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServiceRepository } from './user.repository';
import { UserRelationshipType } from '../../entities/userRelationship.entity';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UserStatus } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserServiceRepository,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId == followingId) {
      throw new BadRequestException(
        await this.i18n.t('user.do_not_follow_by_yourself')
      );
    }
    const doesExist = await this.repository.doesRelationshipExist(
      followerId,
      followingId,
      UserRelationshipType.FOLLOWING,
    );
    if (doesExist) {
      return;
    }
    await this.repository.createRelationship(
      followerId,
      followingId,
      UserRelationshipType.FOLLOWING,
    );
  }
}
