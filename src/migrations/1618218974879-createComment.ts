import { MigrationInterface, QueryRunner } from 'typeorm';

export class createComment1618218974879 implements MigrationInterface {
  name = 'createComment1618218974879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE comments (
        "id" bigint UNIQUE NOT NULL PRIMARY KEY,
        content varchar(200) NOT NULL,
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "videoId" bigint REFERENCES videos(id) ON DELETE CASCADE,
        "parentCommentId" bigint REFERENCES comments(id) ON DELETE CASCADE,
        "likesCount" integer DEFAULT 0,
        "repliesCount" integer DEFAULT 0,
        "createdAt" timestamp DEFAULT current_timestamp
      );

      ALTER TABLE comments
      ADD CONSTRAINT videoAndParentCommentChk
      CHECK (
        ("videoId" IS NOT NULL AND "parentCommentId" IS NULL)
        OR
        ("videoId" IS NULL AND "parentCommentId" IS NOT NULL)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "comments";
    `);
  }
}
