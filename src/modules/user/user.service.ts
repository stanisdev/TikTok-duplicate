import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServiceRepository } from './user.repository';
import { I18nRequestScopeService } from 'nestjs-i18n';
import {
  UserRelationshipType,
  UserRelationship
} from '../../entities/userRelationship.entity';
import { User } from 'src/entities/user.entity';
import { ProfileViwerType, UserInfoResponse } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserServiceRepository,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  /**
   * Follow to a user
   */
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

  /**
   * Unfollow to a user
   */
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

  /**
   * Get breif information about a user
   */
  async getUserInfo(
    viewer: User,
    username: string
  ): Promise<UserInfoResponse> {
    const { repository } = this;

    const user = await repository.findUserByUsername(username);
    if (!(user instanceof Object)) {
      throw new BadRequestException(
        await this.i18n.t('auth.user_not_found')
      )
    }
    /**
     * Define type of the viewer
     */
    let viewerType;
    if (viewer.id == user.id) {
      viewerType = ProfileViwerType.OWNER;
    } else if (await repository.doesFriendshipExist(user.id, viewer.id)) {
      viewerType = ProfileViwerType.FRIEND;
    } else {
      viewerType = ProfileViwerType.GUEST;
    }

    /**
     * Determine amount of likes, followings and
     * followers
     */
    const [following, followers, likes] = await Promise.all([
      repository.countFollowings(user.id),
      repository.countFollowers(user.id),
      repository.countLikesOfAllUserVideos(user, viewerType),
    ]);
    return {
      following,
      followers,
      likes,
    };
  }
}
