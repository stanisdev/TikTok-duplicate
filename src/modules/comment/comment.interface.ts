import { User } from '../../entities/user.entity';
import { Video } from '../../entities/video.entity';

export interface CreateCommentOptions {
  id?: number;
  user: User;
  video: Video;
  content: string;
  parentCommentId: number;
}
