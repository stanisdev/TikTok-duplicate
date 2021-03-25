import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUser1616661129074 implements MigrationInterface {
  name = 'createUser1616661129074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        phone varchar(30) NOT NULL UNIQUE,
        username varchar(40) NOT NULL UNIQUE,
        password char(60) NOT NULL,
        salt char(5) NOT NULL,
        status smallint DEFAULT 0,
        created_at timestamp DEFAULT current_timestamp
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
