import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'yaml';

export function parseIntProps(obj: Record<string, any>) {
  return Object.entries(obj).reduce((prev, curr) => {
    const [k, v] = curr;
    if (!isNaN(+v)) {
      prev[k] = +v;
    } else {
      prev[k] = v;
    }
    return prev;
  }, {});
}

export function parseSwaggerDoc() {
  const swaggerYml = readFileSync(
    path.join(process.cwd(), 'swagger.yml'),
    'utf8',
  );
  return yaml.parse(swaggerYml);
}

export function snakeToCamel(obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = key.replace(/_\w/g, (m) => m[1].toUpperCase());
    acc[camelKey] = snakeToCamel(value);
    return acc;
  }, {});
}
