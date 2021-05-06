import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity('video_likes')
export class VideoLike {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.videoLikes, { primary: true })
  user: User;

  @ManyToOne(() => Video, (video) => video.likes, { primary: true })
  video: Video;
}
