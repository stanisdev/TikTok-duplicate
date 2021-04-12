import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCommentLike1618222657104 implements MigrationInterface {
  name = 'createCommentLike1618222657104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE comment_likes (
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "commentId" bigint REFERENCES comments(id) ON DELETE CASCADE,
        PRIMARY KEY("userId", "commentId")
      );

      CREATE UNIQUE INDEX idx_comment_like
        ON comment_likes("userId", "commentId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "comment_likes";
    `);
  }
}
