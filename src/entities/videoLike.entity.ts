import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity('video_likes')
export class VideoLike {
  @ManyToOne(() => User, (user) => user.videoLikes, { primary: true })
  user: User;

  @ManyToOne(() => Video, (video) => video.likes, { primary: true })
  video: Video;
}
