export const getType = input => {
  if (Array.isArray(input)) return 'array';

  return typeof input;
}

export const string = input => {
  return getType(input) === 'string';
};

export const number = input => {
  return getType(input) === 'number';
};

export const arrayOf = type => {
  let fn = input => {
    if (getType(input) !== 'array') {
      return false;
    }

    return input.map(i => getType(i) === type.name).every(x => x === true);
  }
  Object.defineProperty(fn, 'name', {
    value: `arrayOf(${type.name})`,
  });

  return fn;
}
