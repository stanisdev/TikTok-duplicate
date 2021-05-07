import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity('video_likes')
export class VideoLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.videoLikes)
  user: User;

  @ManyToOne(() => Video, (video) => video.likes)
  video: Video;
}
