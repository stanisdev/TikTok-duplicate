import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID } from 'class-validator';

export enum UserRelationshipType {
  FOLLOWING = 0,
  FOLLOWER = 1,
  BLOCKED = 2,
}

@Entity('user_relationships')
export class UserRelationship {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsUUID(4)
  activeUserId: string;

  @Column()
  @IsUUID(4)
  exposedUserId: string;

  @Column()
  type: UserRelationshipType;
}
