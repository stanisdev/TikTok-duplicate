import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Code } from 'src/entities/code.entity';
import { Repository, getConnection, Connection } from "typeorm";
import { customAlphabet, nanoid } from 'nanoid/async'

@Injectable()
export class AuthService {
  private db: Connection = getConnection();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
    const queryBuilder = this.db.createQueryBuilder();

    // @todo: use transaction
    const { raw: [user] } = await queryBuilder
      .insert()
      .into(User)
      .values({
        phone,
        username: await nanoid(40),
        password: '',
        salt: '',
        status: 0,
      })
      .execute();

    const code = await this.generateCode();
    await queryBuilder
      .insert()
      .into(Code)
      .values({
        code,
        user_id: user.id,
        // @todo: get expiration period from
        // a config module
        expire_at: new Date(),
      })
      .execute();

    this.sendCodeViaSms(code);
  }

  /**
   * Check should a new user be created with the given phone
   * or should we just send a new confirm code
   */
  private async shouldRegisterPhone(phone: string): Promise<boolean> {
    const queryBuilder = this.db.createQueryBuilder();

    const user = await queryBuilder
      .select(['id', 'status'])
      .from(User, 'user')
      .where('user.phone = :phone', { phone })
      .getRawOne<User>();

    if (!(user instanceof Object)) {
      return true;
    }
    /**
     * Resend a new confirm code
     */
    if (user.status == 0) {
      const code = await this.generateCode();
      /**
       * Remove the previously created code
       */
      await queryBuilder
        .delete()
        .from(Code)
        .where('user_id = :userId', { userId: user.id })
        .execute();
      /**
       * Create a new one
       */
      await queryBuilder
        .insert()
        .into(Code)
        .values({
          user_id: user.id,
          code,
          expire_at: new Date(),
        })
        .execute();
      
      this.sendCodeViaSms(code);
      return false;
    }
    else {
      throw new BadRequestException(
        'The phone number is already registered'
      );
    }
  }

  confirmPhone() {}

  private generateCode(): Promise<string> {
    return customAlphabet('1234567890', 5)();
  }

  private sendCodeViaSms(code: string) {
    // @hint: dummy method
  }
}
