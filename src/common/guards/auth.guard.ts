import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { AuthServiceRepository } from '../../modules/auth/auth.repository';
import { UserStatus } from '../../entities/user.entity';
import { CodeType } from '../../entities/code.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private repository: AuthServiceRepository,
  ) {
    this.jwtSecret = this.configService.get<string>('auth.jwt.secret')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token;
    try {
      token = request.headers.authorization.split('Bearer ')[1];
    } catch {
      return false;
    }
    let decrypted;
    try {
      decrypted = await this.jwtService
        .verifyAsync(token, { secret: this.jwtSecret});
    } catch {
      return false;
    }
    /**
     * Find user by code and validate him
     */
    const record = await this.repository.findUserByCode(decrypted.code);
    if (
      record?.type !== CodeType.JWT_ACCESS ||
      new Date(record.expireAt).getTime() <= Date.now() ||
      record.user.id !== decrypted.sub ||
      record.user.status !== UserStatus.REGISTRATION_COMPLETE
    ) {
      throw new ForbiddenException();
    }
    request.code = record;
    request.user = record.user;
    return true;
  }
}
