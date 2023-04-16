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
