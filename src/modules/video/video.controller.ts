import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadVideoDto } from './video.dto';
import { VideoService } from './video.service';
import { UploadedVideoResponse } from './video.interface';
import { GetVideo } from 'src/common/decorators/getVideo.decorator';
import { Video } from 'src/entities/video.entity';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  async upload(
    @Body() dto: UploadVideoDto,
    @Request() { user }
  ): Promise<UploadedVideoResponse> {
    return this.videoService.upload(dto, user);
  }

  @Get(':videoId/like')
  @UseGuards(AuthGuard)
  async like(
    @Request() { user },
    @GetVideo() video: Video,
  ): Promise<void> {
    await this.videoService.like(user, video);
  }

  @Get(':videoId/remove_like')
  @UseGuards(AuthGuard)
  async removeLike(
    @Request() { user },
    @GetVideo() video: Video,
  ): Promise<void> {
    await this.videoService.removeLike(user, video);
  }
}
