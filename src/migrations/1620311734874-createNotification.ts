import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNotification1620311734874 implements MigrationInterface {
  name = 'createNotification1620311734874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE notifications (
        id bigint UNIQUE NOT NULL PRIMARY KEY,
        "type" smallint NOT NULL,
        "receiverId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "videoLikeId" bigint REFERENCES video_likes(id) ON DELETE CASCADE,
        "commentId" bigint REFERENCES comments(id) ON DELETE CASCADE,
        "followerId" integer REFERENCES user_relationships(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
