export const fromMapToObject = (mapInstance: Map<string, any>): object => {
  const obj = {};
  for (const [key, value] of mapInstance) {
    obj[key] = value;
  }
  return obj;
};
