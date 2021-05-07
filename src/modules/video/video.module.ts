import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Code, Video, VideoLike, Notification } from '../../entities';
import { AuthServiceRepository } from '../auth/auth.repository';
import { VideoServiceRepository } from './video.repository';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Code, Video, VideoLike, Notification]),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoServiceRepository, AuthServiceRepository],
})
export class VideoModule {}
