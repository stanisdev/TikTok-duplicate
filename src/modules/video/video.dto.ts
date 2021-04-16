import {
  ArrayMaxSize,
  ArrayUnique,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UploadVideoDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  caption: string;

  @IsNotEmpty()
  @IsNumber()
  availableFor: number;

  @ArrayMaxSize(3)
  @ArrayUnique()
  allowUser: [number];
}
