import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsDate,
  IsInt,
  IsMobilePhone,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Code } from './code.entity';
import { Video } from './video.entity';
import { VideoLike } from './videoLike.entity';
import { CommentLike } from './commentLike.entity';

export enum UserStatus {
  INITIAL = 0,
  PHONE_CONFIRMED = 1,
  REGISTRATION_COMPLETE = 2,
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  id: string;

  @Column()
  @IsMobilePhone()
  phone: string;

  @Column()
  @MinLength(5)
  @MaxLength(40)
  username: string;

  @Column()
  @Length(60)
  password: string;

  @Column()
  @Length(5)
  salt: string;

  @Column()
  @IsInt()
  @Min(0)
  @Max(10)
  status: UserStatus;

  @OneToMany(() => Code, (code) => code.user)
  codes: Code[];

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToMany(() => VideoLike, (like) => like.user)
  videoLikes: VideoLike[];

  @OneToMany(() => CommentLike, (like) => like.user)
  commentLikes: CommentLike[];

  @Column()
  @IsDate()
  createdAt: Date;
}
