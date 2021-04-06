import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { customAlphabet, nanoid } from 'nanoid/async';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { AuthTokens, AvailableUserFields, CodeLifetime } from './auth.interface';
import { CompleteRegistrationDto, SignInDto } from './auth.dto';
import { UtilsService } from '../../../src/providers/utils.service';
import { CodeType } from '../../entities/code.entity';
import { User, UserStatus } from '../../entities/user.entity';
import { Code } from '../../entities/code.entity';
import { JwtService } from '@nestjs/jwt';
import { I18nRequestScopeService } from 'nestjs-i18n';
import * as lodash from 'lodash';

@Injectable()
export class AuthService {
  private smsCodeLifetime: CodeLifetime;

  constructor(
    private configService: ConfigService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private i18n: I18nRequestScopeService,
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
        message: await this.i18n.t('auth.new_confirm_code_sended'),
      };
    }
    await this.createInitialUser(phone);
    return {
      message: await this.i18n.t('auth.confirm_code_sended')
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
      throw new BadRequestException(
        await this.i18n.t('auth.phone_number_exists')
      );
    }
  }

  /**
   * Confirm a user's phone number by
   * the code from sms
   */
  async confirmPhone(code: string): Promise<string> {
    const record = await this.authRepository.findUserByCode(code);
    if (
      record?.user?.status != UserStatus.INITIAL ||
      Date.now() > new Date(record.expireAt).getTime()
    ) {
      throw new BadRequestException(
        await this.i18n.t('auth.wrong_confirmation_code')
      );
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
      throw new BadRequestException(
        await this.i18n.t('auth.user_not_found')
      );
    }
    if (await this.authRepository.doesUsernameExist(username)) {
      throw new BadRequestException(
        await this.i18n.t('auth.username_registered')
      );
    }
    user.username = username;
    user.salt = await nanoid(5);
    user.status = UserStatus.REGISTRATION_COMPLETE;

    const hash = await UtilsService.generateHash(password + user.salt);
    user.password = hash;
    await this.authRepository.userRepository.save(user);
  }

  /**
   * Using the given user, generate and return appropriate
   * access and refresh tokens
   */
  async signIn(dto: SignInDto): Promise<AuthTokens> {
    const user = await this.findUsernameAndCheckPassword(dto);
    if (!(user instanceof User)) {
      throw new UnauthorizedException();
    }

    const [accessToken, codeRecord] = await this.createJwtToken(
      user,
      CodeType.JWT_ACCESS,
      'auth.jwt.tokenLifetime.access',
    );
    const [refreshToken] = await this.createJwtToken(
      user,
      CodeType.JWT_REFRESH,
      'auth.jwt.tokenLifetime.refresh',
      codeRecord.id,
    )
    return { accessToken, refreshToken };
  }

    /**
   * Find user by username and if one was found
   * check his password
   */
     private async findUsernameAndCheckPassword({
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
   * Generate a jwt token
   */
  private async createJwtToken(
    user: User,
    type: CodeType,
    config: string,
    parentCodeId?: number,
  ): Promise<[string, Code]> {
    const expiresIn = this.configService.get<string>(config);
    const [amount, unit] = expiresIn.split(' ');

    const code = await nanoid(40);
    const codeRecord = await this.authRepository.createCode(
      user,
      code,
      { amount: Number.parseInt(amount), unit },
      type,
      parentCodeId,
    );
    const payload = {
      code,
      sub: user.id,
    };
    const secret = this.configService.get<string>('auth.jwt.secret');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    })
    return [token, codeRecord];
  }

  getUserInfo(user: User): AvailableUserFields {
    return lodash.pick(
      user, ['id', 'phone', 'username', 'status', 'createdAt']
    );
  }

  async logout(code: Code, everywhere: boolean): Promise<void> {
    if (everywhere) {
      await this.authRepository.removeAllAuthTokens(code.user.id);
    } else {
      await this.authRepository.codeRepository.delete(code.id);
    }
  }

  private generateCode(): Promise<string> {
    // @todo: 5 - move to config
    return customAlphabet('1234567890', 5)();
  }

  private sendCodeViaSms(code: string) {
    // @hint: dummy method
  }
}
