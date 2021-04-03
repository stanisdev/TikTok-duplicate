import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterPhoneDto {
  @IsMobilePhone()
  @IsNotEmpty()
  phone: string;
}

export class ConfirmPhoneDto {
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}

export class CompleteRegistrationDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  username: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
}

export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
