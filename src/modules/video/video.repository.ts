import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Video, VideoAvailableFor } from '../../entities/video.entity';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoServiceRepository {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  create(
    publicId: number,
    user: User,
    caption: string,
    availableFor: VideoAvailableFor,
    allowUser: number[],
  ): Promise<Video> {
    const video = new Video()
    video.publicId = publicId;
    video.user = user;
    video.caption = caption;
    video.availableFor = availableFor;
    video.allowUser = allowUser;

    return this.videoRepository.save(video);
  }
}
