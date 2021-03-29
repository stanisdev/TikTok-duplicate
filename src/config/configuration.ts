import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  const env = process.env.NODE_ENV;
  const filePath = join(__dirname, `${env}.yml`);
  const content = readFileSync(filePath, 'utf8');
  return yaml.load(content) as Record<string, any>;
};
