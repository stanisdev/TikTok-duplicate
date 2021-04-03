import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCode1616667833049 implements MigrationInterface {
  name = 'addTypeToCode1617280916022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE codes
      ADD COLUMN "type" smallint DEFAULT 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE codes
      DROP COLUMN "type";
    `);
  }
}
