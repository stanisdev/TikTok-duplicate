import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Code } from '../../entities/code.entity';
import { Video } from 'src/entities/video.entity';
import { AuthServiceRepository } from '../auth/auth.repository';
import { VideoServiceRepository } from './video.repository';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Code, Video]),
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    VideoServiceRepository,
    AuthServiceRepository,
  ]
})
export class VideoModule {}
