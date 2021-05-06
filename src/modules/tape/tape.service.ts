import { Injectable } from '@nestjs/common';
import { VideoFullInfo } from './tape.interface';
import { TapeServiceRepository } from './tape.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TapeService {
  constructor(
    private readonly repository: TapeServiceRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get the list of the most recent popular videos
   */
  async getCommonVideos(from: Date): Promise<VideoFullInfo[]> {
    const limit = +this.configService.get<string>('pagination.tape.limit');

    const videos = await this.getVideos(from, limit);
    const commentsCount = await this.repository.countComments(
      videos.map(video => video.id)
    );
    commentsCount.forEach(info => {
      const video = videos.find(video => video.id == info.videoId)
      if (video instanceof Object) {
        video.commentsCount = info.total;
      }
    });
    return videos;
  }

  /**
   * Send query and return a prepared array of videos
   */
  private async getVideos(from: Date, limit: number): Promise<VideoFullInfo[]> {
    const videos = await this.repository.getVideos(from, limit);

    return videos.map(video => ({
      id: +video.id,
      caption: video.caption,
      viewsCount: +video.viewsCount,
      likesCount: +video.likesCount,
      commentsCount: 0,
      user: {
        id: video.user.id,
        username: video.user.username,
      },
    }));
  }
}
