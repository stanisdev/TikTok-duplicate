import {
  Body,
  Query,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  RegisterPhoneDto,
  ConfirmPhoneDto,
  CompleteRegistrationDto,
  SignInDto,
  UpdateJwtTokensDto,
  AuthTokensDto,
  ConfirmPhoneResponseDto,
} from './auth.dto';
import {
  AuthTokens,
  AvailableUserFields,
  ConfirmPhoneResponse,
} from './auth.interface';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register_phone')
  @ApiOperation({ summary: 'Register a phone number' })
  @ApiCreatedResponse()
  async registerPhone(@Body() { phone }: RegisterPhoneDto) {
    return this.authService.registerPhoneNumber(phone);
  }

  @Post('confirm_phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm a phone number through having received code from SMS',
  })
  @ApiOkResponse({
    description:
      'The being returned "userId" is used to complete the registration process',
    type: ConfirmPhoneResponseDto,
  })
  async confirmPhone(
    @Body() { code }: ConfirmPhoneDto,
  ): Promise<ConfirmPhoneResponse> {
    const userId = await this.authService.confirmPhone(code);
    return { userId };
  }

  @Post('complete_registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete the registration process' })
  @ApiOkResponse()
  async completeRegistration(
    @Body() dto: CompleteRegistrationDto,
  ): Promise<void> {
    await this.authService.completeRegistration(dto);
  }

  @Post('sign_in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthTokensDto })
  async signIn(@Body() dto: SignInDto): Promise<AuthTokens> {
    return this.authService.signIn(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get information about an authorized user' })
  @ApiOkResponse({ description: 'The found user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async me(@Request() { user }): Promise<AvailableUserFields> {
    return this.authService.getUserInfo(user);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Destroy "access" and "refresh" tokens' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async logout(
    @Request() { code },
    @Query('allDevices') allDevices: string,
  ): Promise<void> {
    await this.authService.logout(code, Boolean(allDevices));
  }

  @Post('update_tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue a new pair of the tokens' })
  @ApiOkResponse({ type: AuthTokensDto })
  async updateTokens(@Body() dto: UpdateJwtTokensDto): Promise<AuthTokens> {
    return this.authService.updateJwtTokens(dto);
  }
}
