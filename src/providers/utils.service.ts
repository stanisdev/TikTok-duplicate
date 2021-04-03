import * as bcrypt from 'bcrypt';

export class UtilsService {
  private static hashSaltRounds = 10;

  static generateHash(input: string): Promise<string> {
    return bcrypt.hash(input, this.hashSaltRounds);
  }

  static isHashValid(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash);
  }
}
