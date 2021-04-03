import { BadRequestException, Injectable } from '@nestjs/common';
import { customAlphabet, nanoid } from 'nanoid/async';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { AuthTokens, CodeLifetime } from './auth.interface';
import { CompleteRegistrationDto, SignInDto } from './auth.dto';
import { UtilsService } from '../../../src/providers/utils.service';
import { CodeType } from '../../entities/code.entity';
import { User, UserStatus } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private smsCodeLifetime: CodeLifetime;

  constructor(
    private configService: ConfigService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {
    const [count, unit] = this.configService
      .get<string>('auth.smsCodeLifetime')
      .split(' ');
    this.smsCodeLifetime = {
      amount: Number.parseInt(count),
      unit,
    };
  }

  /**
   * Register the given phone number
   */
  async registerPhoneNumber(phone: string) {
    if (!(await this.shouldRegisterPhone(phone))) {
      return {
        // @todo: move to i18n
        message: 'The new confirm code has been sent to your phone number',
      };
    }
    await this.createInitialUser(phone);
    return {
      message: 'Check your phone. The confirm code has been sent via SMS',
    };
  }

  /**
   * Create a new user with initial fields
   * and exact phone
   */
  private async createInitialUser(phone: string): Promise<void> {
    const user = await this.authRepository.createInitialUser(phone);
    const code = await this.generateCode();
    await this.authRepository.createCode(
      user,
      code,
      this.smsCodeLifetime,
      CodeType.SMS,
    );
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
    if (user.status == UserStatus.INITIAL) {
      /**
       * Remove the previously created code
       */
      await this.authRepository.removeAllSmsCodes(user);
      const code = await this.generateCode();

      await this.authRepository.createCode(
        user,
        code,
        this.smsCodeLifetime,
        CodeType.SMS,
      );
      this.sendCodeViaSms(code);
      return false;
    } else {
      throw new BadRequestException('The phone number is already registered');
    }
  }

  /**
   * Confirm a user's phone number by
   * the code from sms
   */
  async confirmPhone(code: string): Promise<string> {
    const record = await this.authRepository.findUserBySmsCode(code);
    if (
      record?.user?.status != UserStatus.INITIAL ||
      Date.now() > new Date(record.expireAt).getTime()
    ) {
      throw new BadRequestException('The confirmation code is incorrect');
    }
    /**
     * If checking passed successfully
     */
    const { user } = record;
    user.status = UserStatus.PHONE_CONFIRMED;

    await this.authRepository.removeAllSmsCodes(user);
    await this.authRepository.userRepository.save(user);
    return user.id;
  }

  /**
   * Complete the started process of registration
   * by setting username, password to a user who
   * confirmed his phone before
   */
  async completeRegistration({
    username,
    password,
    userId,
  }: CompleteRegistrationDto): Promise<void> {
    const user = await this.authRepository.userRepository.findOne(userId);

    if (user?.status != UserStatus.PHONE_CONFIRMED) {
      throw new BadRequestException('User is not found');
    }
    if (await this.authRepository.doesUsernameExist(username)) {
      throw new BadRequestException('Please, specify another username');
    }
    user.username = username;
    user.salt = await nanoid(5);
    user.status = UserStatus.REGISTRATION_COMPLETE;

    const hash = await UtilsService.generateHash(password + user.salt);
    user.password = hash;
    await this.authRepository.userRepository.save(user);
  }

  /**
   * Find user by username and if one was found
   * check his password
   */
  async findUsernameAndCheckPassword({
    username,
    password,
  }: SignInDto): Promise<User | null> {
    const user = await this.authRepository.userRepository.findOne({
      username,
    });
    if (user?.status != UserStatus.REGISTRATION_COMPLETE) {
      return null;
    }
    const isPasswordValid = await UtilsService.isHashValid(
      password + user.salt,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  /**
   * Using the given user, generate and return appropriate
   * access and refresh tokens
   */
  async signIn(user: User): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.createJwtToken(
        user,
        CodeType.JWT_ACCESS,
        'auth.jwt.tokenLifetime.access',
      ),
      this.createJwtToken(
        user,
        CodeType.JWT_REFRESH,
        'auth.jwt.tokenLifetime.refresh',
      ),
    ]);
    return { accessToken, refreshToken };
  }

  /**
   * Generate a jwt token
   */
  private async createJwtToken(
    user: User,
    type: CodeType,
    config: string,
  ): Promise<string> {
    const expiresIn = this.configService.get<string>(config);
    const [amount, unit] = expiresIn.split(' ');

    const code = await nanoid(40);
    await this.authRepository.createCode(
      user,
      code,
      { amount: Number.parseInt(amount), unit },
      type,
    );
    const payload = {
      code,
      sub: user.id,
    };
    const secret = this.configService.get<string>('auth.jwt.secret');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  private generateCode(): Promise<string> {
    // @todo: 5 - move to config
    return customAlphabet('1234567890', 5)();
  }

  private sendCodeViaSms(code: string) {
    // @hint: dummy method
  }
}
