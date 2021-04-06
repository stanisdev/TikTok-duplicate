import { MigrationInterface, QueryRunner } from 'typeorm';

export class addParentCodeIdToCode1617686473032 implements MigrationInterface {
  name = 'addParentCodeIdToCode1617686473032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE codes
      ADD COLUMN "parentCodeId" integer
      REFERENCES codes(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE codes
      DROP COLUMN "parentCodeId";
    `);
  }
}
