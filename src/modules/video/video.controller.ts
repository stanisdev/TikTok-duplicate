import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadVideoDto } from './video.dto';
import { VideoService } from './video.service';
import { UloadedVideoResponse } from './video.interface';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  async upload(
    @Body() dto: UploadVideoDto,
    @Request() { user }
  ): Promise<UloadedVideoResponse> {
    return this.videoService.upload(dto, user);
  }
}
