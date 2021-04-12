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
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadVideoDto } from './video.dto';
import { VideoService } from './video.service';
import { UploadedVideoResponse } from './video.interface';

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
    @Param('videoId', new ParseIntPipe()) videoId: number,
  ): Promise<void> {
    await this.videoService.like(user, videoId);
  }
}
