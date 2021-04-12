import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Video, VideoAvailableFor } from '../../entities/video.entity';
import { User } from '../../entities/user.entity';
import { VideoLike } from '../../entities/videoLike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoServiceRepository {
  constructor(
    @InjectRepository(Video)
    public readonly videoRepository: Repository<Video>,

    @InjectRepository(VideoLike)
    public readonly videoLikeRepository: Repository<VideoLike>
  ) {}

  createVideo(
    id: number,
    user: User,
    caption: string,
    availableFor: VideoAvailableFor,
    allowUser: number[],
  ): Promise<Video> {
    const video = new Video()
    video.id = id;
    video.user = user;
    video.caption = caption;
    video.availableFor = availableFor;
    video.allowUser = allowUser;

    return this.videoRepository.save(video);
  }

  async createLike(user: User, video: Video): Promise<void> {
    const like = new VideoLike();
    like.user = user;
    like.video = video;

    await this.videoLikeRepository.save(like);
  }

  findLike(user: User, video: Video): Promise<Video> {
    return this.videoLikeRepository.createQueryBuilder()
      .where('"userId" = :userId', { userId: user.id })
      .select(['"userId"', '"videoId"'])
      .andWhere('"videoId" = :videoId', { videoId: video.id })
      .getRawOne<Video>();
  }

  async removeLike(user: User, video: Video): Promise<void> {
    await this.videoLikeRepository.delete({
      user,
      video,
    });
  }
}
