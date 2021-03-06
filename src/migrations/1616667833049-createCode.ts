import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCode1616667833049 implements MigrationInterface {
  name = 'createCode1616667833049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS codes_id_seq;

      CREATE TABLE codes (
        id integer PRIMARY KEY DEFAULT nextval('codes_id_seq'),
        code varchar(40) NOT NULL,
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "expireAt" timestamp NOT NULL
      );

      CREATE UNIQUE INDEX idx_code_user
        ON codes("userId", code);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "codes";
      DROP SEQUENCE codes_id_seq;
    `);
  }
}
