import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Video } from 'src/entities';
import { getConnection, Connection } from 'typeorm';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UniversalService } from '../../shared/providers/universal.service';

@Injectable()
export class VideoAvailabilityGuard implements CanActivate {
  private db: Connection;

  constructor(
    private readonly i18n: I18nRequestScopeService,
  ) {
    this.db = getConnection();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    /**
     * Determine the existence of a video
     */
    const video = await this.db
      .getRepository(Video)
      .createQueryBuilder('v')
      .select(['v.id AS id', 'v.userId', 'v.availableFor AS "availability"'])
      .where('v.id = :id', { id: request.params.videoId })
      .getRawOne();
    if (!(video instanceof Object)) {
      throw new BadRequestException(
        await this.i18n.t('video.not_exists'),
      );
    }
    /**
     * Get the type of the viewer and compare it
     * with the availability of a video
     */
    const viewerType = await UniversalService.getViewerType(request.user.id, video.userId);
    request.video = video;
    return viewerType >= video.availability;
  }
}
