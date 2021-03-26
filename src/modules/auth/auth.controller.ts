import { Body, Controller, Get, Post } from "@nestjs/common";
import { RegisterPhoneDto } from "./auth.dto";
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

  @Get('confirm_phone')
  confirmPhone() {
    this.authService.confirmPhone();
    return {};
  }
}