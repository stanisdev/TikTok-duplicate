import { IsInt, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { VideoLike } from './videoLike.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { UserRelationship } from './userRelationship.entity';

export enum NotificationType {
  VIDEO_LIKE = 0,
  COMMENT = 1,
  MENTION = 2,
  FOLLOWER = 3,
}

@Entity('notifications')
export class Notification {
  @PrimaryColumn()
  id: number;

  @Column()
  @IsInt()
  type: NotificationType;

  @ManyToOne(() => User, (user) => user.notifications)
  receiver: User;

  @Column()
  @IsUUID(4)
  receiverId: string;

  @OneToOne(() => VideoLike)
  @JoinColumn()
  videoLike: VideoLike;

  @OneToOne(() => Comment)
  @JoinColumn()
  comment: Comment;

  @OneToOne(() => UserRelationship)
  @JoinColumn()
  follower: UserRelationship;
}
