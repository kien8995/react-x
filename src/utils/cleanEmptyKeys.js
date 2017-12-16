function cleanEmptyKeys(obj = {}) {
  Object.keys(obj)
    .filter(key => obj[key] === undefined || obj[key] === null)
    .forEach(key => delete obj[key]);
  return obj;
}