import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import {
  RegisterPhoneDto,
  ConfirmPhoneDto,
  CompleteRegistrationDto,
  SignInDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register_phone')
  async registerPhone(@Body() { phone }: RegisterPhoneDto) {
    return this.authService.registerPhoneNumber(phone);
  }

  @Post('confirm_phone')
  async confirmPhone(@Body() { code }: ConfirmPhoneDto) {
    const userId = await this.authService.confirmPhone(code);
    return { userId };
  }

  @Post('complete_registration')
  async completeRegistration(@Body() dto: CompleteRegistrationDto) {
    await this.authService.completeRegistration(dto);
  }

  @Post('sign_in')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
