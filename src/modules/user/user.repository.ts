import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserRelationship,
  UserRelationshipType,
  User,
  Video,
} from '../../entities';
import { Repository } from 'typeorm';
import { ProfileViwerType } from '../../shared/interfaces/general.interface';

@Injectable()
export class UserServiceRepository {
  constructor(
    @InjectRepository(UserRelationship)
    public readonly userRelationshipRepository: Repository<UserRelationship>,

    @InjectRepository(User)
    public readonly userRepository: Repository<User>,

    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async createRelationship(
    activeUserId: string,
    exposedUserId: string,
    type: UserRelationshipType,
  ): Promise<void> {
    const record = new UserRelationship();
    record.activeUserId = activeUserId;
    record.exposedUserId = exposedUserId;
    record.type = type;

    await this.userRelationshipRepository.save(record);
  }

  async findRelationship(
    activeUserId: string,
    exposedUserId: string,
    type: UserRelationshipType,
  ): Promise<UserRelationship> {
    return this.userRelationshipRepository.findOne({
      where: {
        activeUserId,
        exposedUserId,
        type,
      },
    });
  }

  findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  countFollowings(userId: string): Promise<number> {
    return this.userRelationshipRepository.count({
      where: {
        activeUserId: userId,
        type: UserRelationshipType.FOLLOWING,
      },
    });
  }

  countFollowers(userId: string): Promise<number> {
    return this.userRelationshipRepository.count({
      where: {
        exposedUserId: userId,
        type: UserRelationshipType.FOLLOWING,
      },
    });
  }

  async countLikesOfAllUserVideos(
    user: User,
    viewerType: ProfileViwerType,
  ): Promise<number> {
    /**
     * ViwerType
     * GUEST = 0,
     * FRIEND = 1,
     * OWNER = 2
     */
    /**
     * AvailableFor
     * PUBLIC = 0,
     * FRIENDS = 1,
     * PRIVATE = 2
     */
    const { sum } = await this.videoRepository
      .createQueryBuilder('video')
      .select('SUM("likesCount")', 'sum')
      .where('video.availableFor <= :availableFor', {
        availableFor: viewerType,
      })
      .andWhere('video.userId = :userId', { userId: user.id })
      .getRawOne();
    return +sum;
  }

  async getUserVideos(
    userId: string,
    viewerType: ProfileViwerType,
    limit: number,
    offset: number,
  ): Promise<Video[]> {
    return this.videoRepository
      .createQueryBuilder('v')
      .select(['v.id', 'v.viewsCount'])
      .where('v.userId = :userId', { userId })
      .andWhere('v.availableFor <= :availableFor', { availableFor: viewerType })
      .limit(limit)
      .offset(offset)
      .getMany();
  }
}
