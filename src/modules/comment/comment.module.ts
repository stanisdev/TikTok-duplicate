import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entities/video.entity';
import { User } from 'src/entities/user.entity';
import { Code } from 'src/entities/code.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceRepository } from '../auth/auth.repository';
import { CommentServiceRepository } from './comment.repository';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User,
      Code,
      Video,
      Comment,
    ]),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    AuthServiceRepository,
    CommentServiceRepository,
  ],
})
export class CommentModule {}
