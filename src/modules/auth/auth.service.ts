import { BadRequestException, Injectable } from "@nestjs/common";
import { customAlphabet } from 'nanoid/async'
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "./auth.repository";
import { SmsCodeLifetime } from './auth.interface';

@Injectable()
export class AuthService {
  private smsCodeLifetime: SmsCodeLifetime;

  constructor(
    private configService: ConfigService,
    private authRepository: AuthRepository
  ) {
    const [count, unit] = this.configService
      .get<string>('auth.smsCodeLifetime')
      .split(' ');
    this.smsCodeLifetime = {
      amount: Number.parseInt(count),
      unit
    };
  }

  /**
   * Register the given phone number
   */
  async registerPhoneNumber(phone: string) {
    if (!await this.shouldRegisterPhone(phone)) {
      return {
        // @todo: move to i18n
        message: 'The new confirm code has been sent to your phone number'
      };
    }
    await this.createInitialUser(phone);
    return {
      message: 'Check your phone. The confirm code has been sent via SMS'
    };
  }

  /**
   * Create a new user with initial fields
   * and exact phone
   */
  private async createInitialUser(phone: string): Promise<void> {
    const user = await this.authRepository.createInitialUser(phone);
    const code = await this.generateCode();
    await this.authRepository.createSmsCode(user, code, this.smsCodeLifetime);

    this.sendCodeViaSms(code);
  }

  /**
   * Check should a new user be created with the given phone
   * or should we just send a new confirm code
   */
  private async shouldRegisterPhone(phone: string): Promise<boolean> {
    const user = await this.authRepository.findUserByPhone(phone);
    if (!(user instanceof Object)) {
      return true;
    }
    if (user.status == 0) {
      /**
       * Remove the previously created code
       */
      await this.authRepository.removeAllSmsCodes(user);
      
      const code = await this.generateCode();
      await this.authRepository.createSmsCode(user, code, this.smsCodeLifetime);
      this.sendCodeViaSms(code);
      return false;
    }
    else {
      throw new BadRequestException(
        'The phone number is already registered'
      );
    }
  }

  async confirmPhone(code: string) {}

  private generateCode(): Promise<string> {
    // @todo: 5 - move to config
    return customAlphabet('1234567890', 5)();
  }

  private sendCodeViaSms(code: string) {
    // @hint: dummy method
  }
}
