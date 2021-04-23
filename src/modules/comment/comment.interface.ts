import { User } from '../../entities/user.entity';
import { Video } from '../../entities/video.entity';

export interface CreateCommentOptions {
  id?: number;
  user: User;
  video: Video;
  content: string;
  parentCommentId?: number;
}

export interface CommentResponse {
  user: {
    id: string,
    username: string,
  },
  id: number,
  content: string,
  likesCount: number,
  liked: boolean,
  repliesCount: number,
  createdAt: Date,
}
