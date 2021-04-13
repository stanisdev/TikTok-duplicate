import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserRelationship,
  UserRelationshipType
} from '../../entities/userRelationship.entity';
import { User } from '../../entities/user.entity';
import { Video } from '../../entities/video.entity';
import { Repository } from 'typeorm';
import { Brackets } from 'typeorm';
import { ProfileViwerType } from "./user.interface";

@Injectable()
export class UserServiceRepository {
  constructor(
    @InjectRepository(UserRelationship)
    public readonly userRelationshipRepository: 
      Repository<UserRelationship>,

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
      }
    });
  }

  findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      }
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
      .where('video.availableFor <= :availableFor', { availableFor: viewerType })
      .andWhere('video.userId = :userId', { userId: user.id })
      .getRawOne();
    return +sum;
  }

  async doesFriendshipExist(
    userId: string,
    viewerId: string
  ): Promise<boolean> {
    const records = await this.userRelationshipRepository
      .createQueryBuilder('ur')
      .where(new Brackets(qb => {
        qb.where('ur.activeUserId = :u1', { u1: userId })
          .andWhere('ur.exposedUserId = :u2', { u2: viewerId })
          .andWhere('ur.type = :type', {
            type: UserRelationshipType.FOLLOWING,
          })
      }))
      .orWhere(new Brackets(qb => {
        qb.where('ur.exposedUserId = :u3', { u3: userId })
          .andWhere('ur.activeUserId = :u4', { u4: viewerId })
          .andWhere('ur.type = :type', { 
            type: UserRelationshipType.FOLLOWING,
          })
      }))
      .getMany();
    return records?.length == 2;
  }
}
