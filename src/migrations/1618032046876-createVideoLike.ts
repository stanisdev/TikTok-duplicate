import { MigrationInterface, QueryRunner } from 'typeorm';

export class createVideoLike1618032046876 implements MigrationInterface {
  name = 'createVideoLike1618032046876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE video_likes (
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "videoId" bigint NOT NULL REFERENCES videos("publicId") ON DELETE CASCADE,
        PRIMARY KEY("userId", "videoId")
      );

      CREATE UNIQUE INDEX idx_video_like
        ON video_likes("userId", "videoId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "video_likes";
    `);
  }
}
