import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {
  IsDate,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  Max
} from 'class-validator';
import { User } from './user.entity';
import { VideoLike } from './videoLike.entity';

export enum VideoAvailableFor {
  PUBLIC = 0,
  FRIENDS = 1,
  PRIVATE = 2,
}

@Entity('videos')
export class Video {
  @PrimaryColumn()
  @Min(100000000000000)
  @Max(999999999999999)
  id: number;

  @ManyToOne(() => User, (user) => user.videos)
  user: User;

  @Column()
  @MaxLength(150)
  caption: string;

  @Column()
  @IsNumber()
  @IsPositive()
  availableFor: VideoAvailableFor;

  @Column('int', { array: true })
  allowUser: number[];

  @Column()
  @IsNumber()
  viewsCount: number;

  @OneToMany(() => VideoLike, like => like.video)
  likes: VideoLike[];

  @Column()
  @IsDate()
  createdAt: Date;
}
