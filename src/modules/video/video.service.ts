import { BadRequestException, Injectable } from '@nestjs/common';
import { User, Video } from '../../entities';
import { UploadVideoDto } from './video.dto';
import { VideoServiceRepository } from './video.repository';
import { UtilsService } from '../../shared/providers/utils.service';
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
    user: User,
  ): Promise<UploadedVideoResponse> {
    const id = +(await UtilsService.generateRandomString({
      length: 15,
      onlyDigits: true,
    }));
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
    };
  }

  async like(user: User, videoId: number): Promise<void> {
    if (await this.repository.doesLikeExist(user.id, videoId)) {
      throw new BadRequestException(await this.i18n.t('video.already_liked'));
    }
    const video = new Video();
    video.id = videoId;
    await this.repository.createLike(user, video);
  }

  async removeLike(user: User, video: Video): Promise<void> {
    const exists = await this.repository.doesLikeExist(user.id, video.id);
    if (!exists) {
      throw new BadRequestException(
        await this.i18n.t('video.not_liked_before'),
      );
    }
    await this.repository.removeLike(user, video);
  }
}
