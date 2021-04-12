import { Entity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity('comment_likes')
export class CommentLike {
  @ManyToOne(() => User, (user) => user.commentLikes, { primary: true })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.likes, { primary: true })
  comment: Comment;
}
