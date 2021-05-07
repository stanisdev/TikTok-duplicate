import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UploadVideoDto } from './video.dto';
import { VideoService } from './video.service';
import { UploadedVideoResponse } from './video.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VideoAvailabilityGuard } from 'src/common/guards/videoAvailability.guard';

@ApiTags('video')
@ApiBearerAuth()
@Controller('video')
@UseGuards(AuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a video' })
  async upload(
    @Body() dto: UploadVideoDto,
    @Request() { user },
  ): Promise<UploadedVideoResponse> {
    return this.videoService.upload(dto, user);
  }

  @Get(':videoId/like')
  @UseGuards(VideoAvailabilityGuard)
  @ApiOperation({ summary: 'Like video' })
  async like(
    @Request() { user, video },
    @Param('videoId', ParseIntPipe) videoId: number,
  ): Promise<void> {
    await this.videoService.like(user, videoId, video.userId);
  }

  @Get(':videoId/remove_like')
  @UseGuards(VideoAvailabilityGuard)
  @ApiOperation({
    summary: 'Сhange mind and remove "like" at the previously liked video',
  })
  async removeLike(
    @Request() { user },
    @Param('videoId') videoId: string,
  ): Promise<void> {
    await this.videoService.removeLike(user, +videoId);
  }
}
