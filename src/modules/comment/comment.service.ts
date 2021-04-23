import { Injectable } from '@nestjs/common';
import { UtilsService } from '../../shared/providers/utils.service';
import { CommentServiceRepository } from './comment.repository';
import { CommentResponse, CreateCommentOptions } from './comment.interface';
import { Pagination } from 'src/shared/interfaces/general.interface';
import { User } from 'src/entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentServiceRepository,
    private readonly configService: ConfigService,
  ) {}

  async add(options: CreateCommentOptions) {
    const id = +(await UtilsService.generateRandomString({
      length: 15,
      onlyDigits: true,
    }));
    await this.repository.createComment({
      id,
      user: options.user,
      video: options.video,
      content: options.content,
      parentCommentId: options.parentCommentId,
    });
  }

  async getComments(
    videoId: number,
    parentCommentId: string | undefined,
    viewer: User,
    pagination: Pagination,
  ): Promise<CommentResponse[]> {
    const limitConfig = {
      default: +this.configService.get<string>(
        'pagination.comments.limit.default',
      ),
      max: +this.configService.get<string>('pagination.comments.limit.max'),
    };
    const { limit, offset } = UtilsService
      .buildLimitOffset(limitConfig, pagination);
    /**
     * Get replies of a comment
     */
    if (typeof parentCommentId == 'string') {
      return this.repository.getComments(
        videoId,
        viewer.id,
        limit,
        offset,
        +parentCommentId,
      );
    }
    /**
     * Get comments of a video
     */
    else {
      return this.repository.getComments(
        videoId,
        viewer.id,
        limit,
        offset,
      );
    }
  }
}
