import { Pagination } from '../../shared/interfaces/general.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServiceRepository } from './user.repository';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import {
  UserRelationshipType,
  UserRelationship,
  User,
} from '../../entities';
import {
  ProfileViwerType,
  UserInfoResponse,
  UserVideosResponse,
} from './user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserServiceRepository,
    private readonly i18n: I18nRequestScopeService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Follow to a user
   */
  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId == followingId) {
      throw new BadRequestException(
        await this.i18n.t('user.do_not_follow_by_yourself'),
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
      throw new BadRequestException(await this.i18n.t('user.cannot_unfollow'));
    }
    await this.repository.userRelationshipRepository.delete(record);
  }

  /**
   * Get breif information about a user
   */
  async getUserInfo(viewer: User, username: string): Promise<UserInfoResponse> {
    const { repository } = this;

    const user = await repository.findUserByUsername(username);
    if (!(user instanceof Object)) {
      throw new BadRequestException(await this.i18n.t('auth.user_not_found'));
    }
    const viewerType = await this.getViewerType(viewer.id, user.id);
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

  /**
   * Get list of user's videos
   */
  async getUserVideos(
    userId: string,
    viewer: User,
    pagination: Pagination,
  ): Promise<UserVideosResponse[]> {
    const limitConfig = {
      default: +this.configService.get<string>(
        'pagination.videos.limit.default',
      ),
      max: +this.configService.get<string>('pagination.videos.limit.max'),
    };
    let page = pagination.page;
    let limit = pagination.limit;

    if (pagination.page < 0) {
      page = 0;
    }
    if (pagination.limit < 1) {
      limit = limitConfig.default;
    }
    if (pagination.limit > limitConfig.max) {
      limit = limitConfig.max;
    }
    const offset = limit * page;
    const viewerType = await this.getViewerType(viewer.id, userId);
    const videos = await this.repository.getUserVideos(
      userId,
      viewerType,
      limit,
      offset,
    );
    return videos.map((v) => ({
      id: +v.id,
      viewsCount: v.viewsCount,
    }));
  }

  /**
   * Determine the relationship between a viewer and
   * the owner of being viewed profile
   */
  async getViewerType(
    viewerId: string,
    userId: string,
  ): Promise<ProfileViwerType> {
    if (viewerId == userId) {
      return ProfileViwerType.OWNER;
    } else if (await this.repository.doesFriendshipExist(userId, viewerId)) {
      return ProfileViwerType.FRIEND;
    } else {
      return ProfileViwerType.GUEST;
    }
  }
}
