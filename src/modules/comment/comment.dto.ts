import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty()
  content: string;

  @ApiProperty()
  parentCommentId: number;
}
