import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServiceRepository } from './user.repository';
import { I18nRequestScopeService } from 'nestjs-i18n';
import {
  UserRelationshipType,
  UserRelationship
} from '../../entities/userRelationship.entity';

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
    const record = await this.repository.findRelationship(
      followerId,
      followingId,
      UserRelationshipType.FOLLOWING,
    );
    if (record instanceof UserRelationship) {
      return;
    }
    await this.repository.createRelationship(
      followerId,
      followingId,
      UserRelationshipType.FOLLOWING,
    );
  }

  async unfollow(followerId: string, unfollowingId: string): Promise<void> {
    const record = await this.repository.findRelationship(
      followerId,
      unfollowingId,
      UserRelationshipType.FOLLOWING,
    );
    if (!(record instanceof UserRelationship)) {
      throw new BadRequestException(
        await this.i18n.t('user.cannot_unfollow')
      );
    }
    await this.repository.userRelationshipRepository.delete(record);
  }
}
