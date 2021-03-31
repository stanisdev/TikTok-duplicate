import { BadRequestException, Injectable } from "@nestjs/common";
import { customAlphabet, nanoid } from 'nanoid/async'
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "./auth.repository";
import { SmsCodeLifetime } from './auth.interface';
import { CompleteRegistrationDto } from "./auth.dto";
import { UtilsService } from "src/providers/utils.service";

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

    // @todo: define type of codes in db schema
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

  /**
   * Confirm a user's phone number by 
   * the code from sms
   */
  async confirmPhone(code: string): Promise<string> {
    const record = await this.authRepository.findUserBySmsCode(code);
    if (
      record?.user?.status != 0 ||
      Date.now() > new Date(record.expireAt).getTime()
    ) {
      throw new BadRequestException(
        'The confirmation code is incorrect'
      );
    }
    /**
     * If checking passed successfully
     */
    await Promise.all([
      this.authRepository.removeAllSmsCodes(record.user),
      // @todo: "1" define and get from an interface
      this.authRepository.updateUserStatus(record.user, 1),
    ]);
    return record.user.id;
  }

  /**
   * Complete the started process of registration
   * by setting username, password to a user who
   * confirmed his phone before
   */
  async completeRegistration(
    { username, password, userId }: CompleteRegistrationDto
  ): Promise<void> {
    const user = await this.authRepository.userRepository.findOne(userId);
    if (user?.status != 1) { // @todo: "1" get from an interface
      throw new BadRequestException(
        'User is not found'
      );
    }
    if (await this.authRepository.doesUsernameExist(username)) {
      throw new BadRequestException(
        'Please, specify another username'
      );
    }
    user.username = username;
    user.salt = await nanoid(5);
    user.status = 2; // @todo: "2" get from an interface
    
    const hash = await UtilsService.generateHash(password + user.salt);
    user.password = hash;
    await this.authRepository.userRepository.save(user);
  }

  private generateCode(): Promise<string> {
    // @todo: 5 - move to config
    return customAlphabet('1234567890', 5)();
  }

  private sendCodeViaSms(code: string) {
    // @hint: dummy method
  }
}
