export const omit = (obj = {}, key) => {
  let res = {};
  Object.keys(obj).forEach(k => {
    if (k !== key) {
      res[k] = obj[k];
    }
  });
  return res;
};

export const invert = (obj = {}) => {
  const keys = Object.keys(obj);
  const vals = keys.map(k => obj[k]);
  let res = {};
  vals.forEach((val, idx) => {
    res[val] = keys[idx];
  });
  return res;
};

export const flatten = (arr = []) => {
  return Array.prototype.concat.apply([], arr);
};
