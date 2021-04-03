import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import {
  RegisterPhoneDto,
  ConfirmPhoneDto,
  CompleteRegistrationDto,
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

  @UseGuards(LocalAuthGuard)
  @Post('sign_in')
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
