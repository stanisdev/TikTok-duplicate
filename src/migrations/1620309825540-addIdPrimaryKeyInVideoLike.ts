import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIdPrimaryKeyInVideoLike1620309825540 implements MigrationInterface {
  name = 'addIdPrimaryKeyInVideoLike1620309825540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_likes
        DROP CONSTRAINT video_likes_pkey;
      
      ALTER TABLE video_likes
        ADD COLUMN "id" serial NOT NULL;

      ALTER TABLE video_likes
        ADD CONSTRAINT video_likes_pkey PRIMARY KEY (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_likes
        DROP COLUMN "id";

      ALTER TABLE video_likes
        ADD CONSTRAINT video_likes_pkey PRIMARY KEY ("userId", "videoId");
    `);
  }
}
