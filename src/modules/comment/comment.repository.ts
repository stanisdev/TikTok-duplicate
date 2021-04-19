import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entities';
import { Repository } from 'typeorm';
import { CreateCommentOptions } from './comment.interface';
import { getConnection } from 'typeorm';

@Injectable()
export class CommentServiceRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment({
    id,
    content,
    user,
    video,
    parentCommentId
  }: CreateCommentOptions): Promise<Comment> {
    const comment = new Comment();

    comment.id = id;
    comment.content = content;
    comment.user = user;

    if (parentCommentId) {
      comment.parentCommentId = parentCommentId;

      await getConnection().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(comment);
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Comment)
          .set({
            likesCount: () => '"likesCount" + 1'
          })
          .where('id = :id', { id: parentCommentId })
          .execute();
      });
    } else {
      comment.video = video;
      await this.commentRepository.save(comment);
    }
    return comment;
  }
}
