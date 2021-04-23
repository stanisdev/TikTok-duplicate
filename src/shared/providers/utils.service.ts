import * as bcrypt from 'bcrypt';
import { customAlphabet, nanoid } from 'nanoid/async';
import { LimitConfig, Pagination } from '../interfaces/general.interface';

export class UtilsService {
  private static hashSaltRounds = 10;

  static generateHash(input: string): Promise<string> {
    return bcrypt.hash(input, this.hashSaltRounds);
  }

  static isHashValid(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash);
  }

  static async generateRandomString(options: {
    length: number;
    onlyDigits?: boolean;
  }): Promise<string> {
    if (options.onlyDigits) {
      return await customAlphabet('1234567890', options.length)();
    }
    return nanoid(options.length);
  }

  static parsePagination(
    limit: string | undefined,
    page: string | undefined,
  ): Pagination {
    let l = Number.parseInt(limit);
    let p = Number.parseInt(page);
    if (Number.isNaN(l)) {
      l = 0;
    }
    if (Number.isNaN(p)) {
      p = -1;
    }
    return {
      limit: l,
      page: p,
    };
  }

  static buildLimitOffset(
    config: LimitConfig,
    pagination: Pagination,
  ): { limit: number, offset: number } {
    let page = pagination.page;
    let limit = pagination.limit;

    if (pagination.page < 0) {
      page = 0;
    }
    if (pagination.limit < 1) {
      limit = config.default;
    }
    if (pagination.limit > config.max) {
      limit = config.max;
    }
    const offset = limit * page;
    return { limit, offset };
  }
}
