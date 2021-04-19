import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { GetVideo } from '../../common/decorators/getVideo.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Video } from '../../entities/video.entity';
import { AddCommentDto } from './comment.dto';
import { CommentService } from './comment.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('comment')
@ApiBearerAuth()
@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':videoId')
  @ApiOperation({ summary: 'Add comment to a video' })
  async addComment(
    @Body() dto: AddCommentDto,
    @Request() { user },
    @GetVideo() video: Video,
  ) {
    await this.commentService.add({
      user,
      video,
      content: dto.content,
      parentCommentId: dto.parentCommentId,
    });
  }
}
