import { Body, Controller, Get, Post } from "@nestjs/common";
import { RegisterPhoneDto, ConfirmPhoneDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register_phone')
  async registerPhone(
    @Body() { phone }: RegisterPhoneDto
  ) {
    return this.authService.registerPhoneNumber(phone);
  }

  @Post('confirm_phone')
  confirmPhone(
    @Body() { code }: ConfirmPhoneDto
  ) {
    this.authService.confirmPhone(code);
    return {};
  }
}