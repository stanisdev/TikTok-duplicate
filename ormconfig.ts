module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'y4cb',
  password: 'sKJt9KGxCSqRAWeC',
  database: 'tiktok',
  autoLoadEntities: true,
  synchronize: false,
  logger: 'simple-console',
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    'migrationsDir': 'src/migrations'
  }
};