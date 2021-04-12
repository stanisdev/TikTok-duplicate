import { MigrationInterface, QueryRunner } from 'typeorm';

export class createVideo1617808441715 implements MigrationInterface {
  name = 'createVideo1617808441715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE videos (
        "id" bigint UNIQUE NOT NULL PRIMARY KEY,
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        caption varchar(150) NOT NULL,
        "availableFor" smallint DEFAULT 0,
        "allowUser" smallint[],
        "viewsCount" integer DEFAULT 0,
        "createdAt" timestamp DEFAULT current_timestamp
      );

      COMMENT ON COLUMN videos."allowUser" IS 'List of allowable actions for a user';
      COMMENT ON COLUMN videos."availableFor" IS 'Public = 0, Friends = 1, Private = 2';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "videos";
    `);
  }
}
