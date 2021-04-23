import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entities';
import { Repository } from 'typeorm';
import { CommentResponse, CreateCommentOptions } from './comment.interface';
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
            repliesCount: () => '"repliesCount" + 1'
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

  async getComments(
    videoId: number,
    viewerId: string,
    limit: number,
    offset: number,
    parentCommentId?: number,
  ): Promise<CommentResponse[]> {
    const query = this.commentRepository
      .createQueryBuilder('cm')
      .select([
        'cm.id "comment.id"',
        'cm.content "comment.content"',
        'cm.likesCount "comment.likesCount"',
        'cm.repliesCount "comment.repliesCount"',
        'cm.createdAt "comment.createdAt"',
        'CASE WHEN cl."userId" is NULL THEN 0 ELSE 1 END as "comment.liked"',
        'u.id "user.id"',
        'u.username "user.username"'
      ])
      .leftJoinAndSelect('cm.likes', 'cl', 'cl."userId" = :userId', {
        userId: viewerId
      })
      .leftJoinAndSelect('cm.user', 'u')
      .limit(limit)
      .offset(offset);

    if (Number.isInteger(parentCommentId)) {
      query.where('"parentCommentId" = :id', {
        id: parentCommentId,
      });
    } else {
      query.where('"videoId" = :videoId', { videoId });
    }
    const records = await query.getRawMany();

    return records.map(record => {
      return {
        user: {
          id: record['user.id'],
          username: record['user.username'],
        },
        id: +record['comment.id'],
        content: record['comment.content'],
        likesCount: record['comment.likesCount'],
        liked: Boolean(record['comment.liked']),
        repliesCount: record['comment.repliesCount'],
        createdAt: record['comment.createdAt'],
      };
    });
  }
}
