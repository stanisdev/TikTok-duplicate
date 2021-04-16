import { IsNotEmpty, MaxLength } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  parentCommentId: number;
}
