import { Controller, Post, UseGuards, Request, Body, Get, Query, Param } from '@nestjs/common';
import { GetVideo } from '../../common/decorators/getVideo.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { VideoAvailabilityGuard } from '../../common/guards/videoAvailability.guard';
import { Video } from '../../entities/video.entity';
import { AddCommentDto } from './comment.dto';
import { CommentService } from './comment.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { CommentResponse } from './comment.interface';
import { UtilsService } from 'src/shared/providers/utils.service';

@ApiTags('comment')
@ApiBearerAuth()
@Controller('comment')
@UseGuards(AuthGuard, VideoAvailabilityGuard)
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

  @Get(':videoId')
  @ApiOperation({ summary: 'Get list of comments of a video' })
  async getComments(
    @Param('videoId') videoId: string,
    @Query('parentCommentId') parentCommentId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Request() { user },
  ): Promise<CommentResponse[]> {
    const pagination = UtilsService.parsePagination(limit, page);
    return this.commentService.getComments(
      +videoId,
      parentCommentId,
      user,
      pagination
    );
  }
}
