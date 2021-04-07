import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserRelationship,
  UserRelationshipType
} from '../../entities/userRelationship.entity';
import { User } from '../../../src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserServiceRepository {
  constructor(
    @InjectRepository(UserRelationship)
    private readonly userRelationshipRepository: Repository<UserRelationship>,

    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
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

  async doesRelationshipExist(
    activeUserId: string,
    exposedUserId: string,
    type: UserRelationshipType,
  ): Promise<boolean> {
    const record = await this.userRelationshipRepository.findOne({
      where: {
        activeUserId,
        exposedUserId,
        type,
      }
    });
    return record instanceof Object;
  }
}
