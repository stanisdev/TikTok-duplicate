import { User } from "src/entities/user.entity";
import { Video } from "src/entities/video.entity";

export interface CreateCommentOptions {
  id?: number,
  user: User,
  video: Video,
  content: string,
  parentCommentId: number,
}
