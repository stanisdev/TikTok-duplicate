import { IsMobilePhone, IsNotEmpty } from 'class-validator';

export class RegisterPhoneDto {

  @IsMobilePhone()
  @IsNotEmpty()
  phone: string;
}
