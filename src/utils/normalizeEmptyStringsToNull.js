export const normalizeEmptyStringsToNull = (obj) => {
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.trim() === '') {
      normalized[key] = null;
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
};
