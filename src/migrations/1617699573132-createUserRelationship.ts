import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserRelationship1617699573132 implements MigrationInterface {
  name = 'createUserRelationship1617699573132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS user_relationships_id_seq;

      CREATE TABLE user_relationships (
        id integer PRIMARY KEY DEFAULT nextval('user_relationships_id_seq'),
        "activeUserId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "exposedUserId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type smallint NOT NULL
      );

      CREATE UNIQUE INDEX idx_relationship_user
        ON user_relationships("activeUserId", "exposedUserId", type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE user_relationships;
      DROP SEQUENCE user_relationships_id_seq;
    `);
  }
}
