import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {
  IsDate,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsInt
} from 'class-validator';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity('comments')
export class Comment {
  @PrimaryColumn()
  @Min(100000000000000)
  @Max(999999999999999)
  id: number;

  @Column()
  @MaxLength(40)
  content: string;

  @ManyToOne(() => User, (user) => user.videoLikes)
  user: User;

  @ManyToOne(() => Video, (video) => video.likes)
  video: Video;

  @Column()
  parentCommentId: number;

  @Column()
  @IsNumber()
  @Min(0)
  likesCount: number

  @Column()
  @IsNumber()
  @Min(0)
  repliesCount: number;

  @Column()
  @IsDate()
  createdAt: Date;
}
