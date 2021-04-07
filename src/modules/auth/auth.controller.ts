import { Body, Query, Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  RegisterPhoneDto,
  ConfirmPhoneDto,
  CompleteRegistrationDto,
  SignInDto,
} from './auth.dto';
import {
  AuthTokens,
  AvailableUserFields,
  ConfirmPhoneResponse,
} from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register_phone')
  async registerPhone(@Body() { phone }: RegisterPhoneDto) {
    return this.authService.registerPhoneNumber(phone);
  }

  @Post('confirm_phone')
  async confirmPhone(
    @Body() { code }: ConfirmPhoneDto
  ): Promise<ConfirmPhoneResponse> {
    const userId = await this.authService.confirmPhone(code);
    return { userId };
  }

  @Post('complete_registration')
  async completeRegistration(
    @Body() dto: CompleteRegistrationDto
  ): Promise<void> {
    await this.authService.completeRegistration(dto);
  }

  @Post('sign_in')
  async signIn(@Body() dto: SignInDto): Promise<AuthTokens> {
    return this.authService.signIn(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() { user }): Promise<AvailableUserFields> {
    return this.authService.getUserInfo(user);
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Request() { code },
    @Query('allDevices') allDevices: string,
  ): Promise<void> {
    await this.authService.logout(code, Boolean(allDevices));
  }

  @Get('update_tokens')
  @UseGuards(AuthGuard)
  async updateTokens() {
    // @todo: define the endpoint
  }
}
