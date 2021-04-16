import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video, Code, User, Comment, CommentLike } from '../../entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceRepository } from '../auth/auth.repository';
import { CommentServiceRepository } from './comment.repository';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Code, Video, Comment, CommentLike]),
  ],
  controllers: [CommentController],
  providers: [CommentService, AuthServiceRepository, CommentServiceRepository],
})
export class CommentModule {}
