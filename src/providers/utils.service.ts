import * as bcrypt from 'bcrypt';
import { customAlphabet, nanoid } from 'nanoid/async';

export class UtilsService {
  private static hashSaltRounds = 10;

  static generateHash(input: string): Promise<string> {
    return bcrypt.hash(input, this.hashSaltRounds);
  }

  static isHashValid(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash);
  }

  static async generateRandomString(options: {
    length: number,
    onlyDigits?: boolean
  }): Promise<string> {
    if (options.onlyDigits) {
      return await customAlphabet('1234567890', options.length)();
    }
    return nanoid(options.length);
  }
}
