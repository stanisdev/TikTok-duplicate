import { IsMobilePhone, IsNotEmpty, IsNumberString } from 'class-validator';

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
