import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPhoneDto {
  @IsMobilePhone()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}

export class ConfirmPhoneDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  code: string;
}

export class CompleteRegistrationDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty()
  userId: string;
}

export class SignInDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class UpdateJwtTokensDto {
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}

export class AuthTokensDto {
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;

  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}

export class ConfirmPhoneResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
