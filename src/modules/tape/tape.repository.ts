import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, VideoAvailableFor, Comment } from '../../entities';
import { VideoCommentsCount } from './tape.interface';

@Injectable()
export class TapeServiceRepository {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepostitory: Repository<Video>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  getVideos(from: Date, limit: number) {
    return this.videoRepostitory
      .createQueryBuilder('v')
      .select([
        'v.id',
        'v.caption',
        'v.viewsCount',
        'v.likesCount',
        'u.id',
        'u.username',
      ])
      .where('v.availableFor = :availableFor', {
        availableFor: VideoAvailableFor.PUBLIC,
      })
      .andWhere('v.createdAt <= :from', { from })
      .leftJoinAndSelect('v.user', 'u')
      .orderBy('v.likesCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  async countComments(videoIds: number[]): Promise<VideoCommentsCount[]> {
    const records = await this.commentRepository
      .createQueryBuilder('cm')
      .select(['COUNT("id") AS total', '"videoId"'])
      .where('cm.videoId IN (:...videoIds)', { videoIds })
      .groupBy('cm."videoId"')
      .getRawMany();

    return records.map(record => ({
      total: +record.total,
      videoId: +record.videoId,
    }));
  }
}
