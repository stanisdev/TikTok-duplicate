import { Module } from '@nestjs/common';
import { TapeService } from './tape.service';
import { TapeController } from './tape.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Code, Video, Comment } from '../../entities';
import { TapeServiceRepository } from './tape.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Code, Video, Comment]),
  ],
  controllers: [TapeController],
  providers: [TapeService, TapeServiceRepository],
})
export class TapeModule {}
