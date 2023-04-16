import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'yaml';

export function parseSwaggerDoc() {
  const swaggerYml = readFileSync(
    path.join(process.cwd(), 'swagger.yml'),
    'utf8',
  );
  return yaml.parse(swaggerYml);
}
