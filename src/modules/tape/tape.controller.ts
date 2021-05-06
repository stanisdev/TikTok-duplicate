import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from 'src/common/pipes/parseDate.pipe';
import { VideoFullInfo } from './tape.interface';
import { TapeService } from './tape.service';

@ApiTags('tape')
@Controller('tape')
export class TapeController {
  constructor(private readonly tapeService: TapeService) {}

  @Get('/')
  @ApiOperation({ summary: 'List of videos for everyone' })
  async common(
    @Query('from', new ParseDatePipe()) from: Date,
  ): Promise<VideoFullInfo[]> {
    return this.tapeService.getCommonVideos(from);
  }
}
