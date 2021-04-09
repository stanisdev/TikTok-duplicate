import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join, dirname } from 'path';

export default () => {
  const env = process.env.NODE_ENV;
  const filePath = join(__dirname, `${env}.yml`);
  const content = readFileSync(filePath, 'utf8');
  const config = yaml.load(content) as Record<string, any>;
  config.dirs.src = dirname(__dirname);
  return config;
};
