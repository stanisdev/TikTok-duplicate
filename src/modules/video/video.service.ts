import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UploadVideoDto } from './video.dto';
import { VideoServiceRepository } from './video.repository';
import { UtilsService } from '../../../src/providers/utils.service';
import { UloadedVideoResponse } from './video.interface';

@Injectable()
export class VideoService {
  constructor(
    private readonly repository: VideoServiceRepository,
  ) {}

  async upload(
    dto: UploadVideoDto,
    user: User
  ): Promise<UloadedVideoResponse> {
    const publicId = + await UtilsService.generateRandomString({
      length: 15,
      onlyDigits: true,
    });
    await this.repository.create(
      publicId,
      user,
      dto.caption,
      dto.availableFor,
      dto.allowUser,
    );
    return {
      publicId,
      userId: user.id,
      caption: dto.caption,
    }
  }
}
