import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLikesCountToVideo1618297991175 implements MigrationInterface {
  name = 'addLikesCountToVideo1618297991175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE videos
      ADD COLUMN "likesCount" integer DEFAULT 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE videos
      DROP COLUMN "likesCount";
    `);
  }
}
