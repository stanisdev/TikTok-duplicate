import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  VideoLike,
  Video,
  VideoAvailableFor,
  User,
  Notification,
  NotificationType,
} from '../../entities';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class VideoServiceRepository {
  constructor(
    @InjectRepository(Video)
    public readonly videoRepository: Repository<Video>,

    @InjectRepository(VideoLike)
    public readonly videoLikeRepository: Repository<VideoLike>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
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

  createLike(user: User, video: Video): Promise<VideoLike> {
    return getConnection().transaction(async transactionalEntityManager => {
      const like = new VideoLike();
      like.user = user;
      like.video = video;

      await transactionalEntityManager
        .createQueryBuilder()
        .update(Video)
        .set({
          likesCount: () => '"likesCount" + 1'
        })
        .where('id = :id', { id: video.id })
        .execute();
      return transactionalEntityManager.save(like);
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

  async createNotification(
    id: number,
    receiverId: string,
    videoLike: VideoLike,
  ) {
    const notification = new Notification();
    notification.receiverId = receiverId;
    notification.videoLike = videoLike;
    notification.id = id;
    notification.type = NotificationType.VIDEO_LIKE;

    return this.notificationRepository.save(notification);
  }
}
