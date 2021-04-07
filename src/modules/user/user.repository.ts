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
    public readonly userRelationshipRepository: Repository<UserRelationship>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
