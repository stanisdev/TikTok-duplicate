import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Video } from '../../entities/video.entity';
import { getConnection } from 'typeorm';

export const GetVideo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const video = await getConnection()
      .getRepository(Video)
      .findOne(request.params.videoId);
    if (!(video instanceof Object)) {
      throw new BadRequestException(
        await request.i18nService.t('video.not_exists'),
      );
    }
    return video;
  },
);
