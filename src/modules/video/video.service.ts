import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Video } from 'src/entities/video.entity';
import { UploadVideoDto } from './video.dto';
import { VideoServiceRepository } from './video.repository';
import { UtilsService } from '../../../src/providers/utils.service';
import { UploadedVideoResponse } from './video.interface';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class VideoService {
  constructor(
    private readonly repository: VideoServiceRepository,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async upload(
    dto: UploadVideoDto,
    user: User
  ): Promise<UploadedVideoResponse> {
    const id = + await UtilsService.generateRandomString({
      length: 15,
      onlyDigits: true,
    });
    await this.repository.createVideo(
      id,
      user,
      dto.caption,
      dto.availableFor,
      dto.allowUser,
    );
    return {
      id,
      userId: user.id,
      caption: dto.caption,
    }
  }

  async like(user: User, videoId: number): Promise<void> {
    const video = await this.getVideoById(videoId);
    const record = await this.repository.findLike(user, video);
    if (record instanceof Object) {
      throw new BadRequestException(
        await this.i18n.t('video.already_liked'),
      );
    }
    await this.repository.createLike(user, video);
  }

  async removeLike(user: User, videoId: number): Promise<void> {
    const video = await this.getVideoById(videoId);
    const record = await this.repository.findLike(user, video);
    if (!(record instanceof Object)) {
      throw new BadRequestException(
        await this.i18n.t('video.not_liked_before'),
      );
    }
    await this.repository.removeLike(user, video);
  }

  private async getVideoById(videoId: number): Promise<Video> {
    const video = await this.repository.videoRepository.findOne({
      id: videoId
    });
    if (!(video instanceof Object)) {
      throw new BadRequestException('video.not_exists');
    }
    return video;
  }
}
