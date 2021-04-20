import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoLike, Video, VideoAvailableFor, User } from '../../entities';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class VideoServiceRepository {
  constructor(
    @InjectRepository(Video)
    public readonly videoRepository: Repository<Video>,

    @InjectRepository(VideoLike)
    public readonly videoLikeRepository: Repository<VideoLike>,
  ) {}

  createVideo(
    id: number,
    user: User,
    caption: string,
    availableFor: VideoAvailableFor,
    allowUser: number[],
  ): Promise<Video> {
    const video = new Video();
    video.id = id;
    video.user = user;
    video.caption = caption;
    video.availableFor = availableFor;
    video.allowUser = allowUser;

    return this.videoRepository.save(video);
  }

  async createLike(user: User, video: Video): Promise<void> {
    await getConnection().transaction(async transactionalEntityManager => {
      const like = new VideoLike();
      like.user = user;
      like.video = video;

      await transactionalEntityManager.save(like);
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Video)
        .set({
          likesCount: () => '"likesCount" + 1'
        })
        .where('id = :id', { id: video.id })
        .execute();
    });
  }

  async doesLikeExist(userId: string, videoId: number): Promise<boolean> {
    const record = await this.videoLikeRepository
      .createQueryBuilder()
      .where('"userId" = :userId', { userId })
      .select(['"userId"', '"videoId"'])
      .andWhere('"videoId" = :videoId', { videoId })
      .getRawOne();
    
    return record instanceof Object;
  }

  async removeLike(userId: string, videoId: number): Promise<void> {
    await getConnection().transaction(async transactionalEntityManager => {
      
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(VideoLike)
        .where('userId = :userId', { userId })
        .andWhere('videoId = :videoId', { videoId })
        .execute();
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Video)
        .set({
          likesCount: () => '"likesCount" - 1'
        })
        .where('id = :id', { id: videoId })
        .execute();
    });
  }
}
