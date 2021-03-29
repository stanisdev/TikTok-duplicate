import configuration from './src/config/configuration';

/**
 * A config file for the typeorm-cli
 */
module.exports = {
  ...configuration().db,
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    'migrationsDir': 'src/migrations'
  }
};