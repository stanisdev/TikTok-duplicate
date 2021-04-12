import { Injectable } from '@nestjs/common';
import { UtilsService } from '../../../src/providers/utils.service';
import { CommentServiceRepository } from './comment.repository';
import { CreateCommentOptions } from './comment.interface';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentServiceRepository,
  ) {}

  async add(options: CreateCommentOptions) {
    const id = + await UtilsService.generateRandomString({
      length: 15,
      onlyDigits: true,
    });
    await this.repository.createComment({
      id,
      user: options.user,
      video: options.video,
      content: options.content,
      parentCommentId: options.parentCommentId,
    });
  }
}
