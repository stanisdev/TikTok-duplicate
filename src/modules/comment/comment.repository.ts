import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Repository } from 'typeorm';
import { CreateCommentOptions } from './comment.interface';

@Injectable()
export class CommentServiceRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  createComment(options: CreateCommentOptions): Promise<Comment> {
    const comment = new Comment();

    comment.id = options.id;
    comment.content = options.content;
    comment.user = options.user;
    comment.video = options.video;
    return this.commentRepository.save(comment);
  }
}
