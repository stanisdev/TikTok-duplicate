import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { GetVideo } from 'src/common/decorators/getVideo.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Video } from 'src/entities/video.entity';
import { AddCommentDto } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':videoId')
  @UseGuards(AuthGuard)
  async addComment(
    @Body() dto: AddCommentDto,
    @Request() { user },
    @GetVideo() video: Video,
  ) {
    await this.commentService.add({
      user,
      video,
      content: dto.content,
      parentCommentId: dto.parentCommentId
    });
  }
}