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
