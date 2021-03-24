import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Get('register_phone')
  registerPhone() {
    this.authService.registerPhone();
    return { ok: true };
  }

  @Get('confirm_phone')
  confirmPhone() {
    this.authService.confirmPhone();
    return { ok: true };
  }
}