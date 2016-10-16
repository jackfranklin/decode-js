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

    return input.map(type).every(x => x === true);
  }
  Object.defineProperty(fn, 'name', {
    value: `arrayOf(${type.name})`,
  });

  return fn;
}

export const any = () => true;

export const maybe = type => {
  let fn = input => {
    // it's a maybe, so if it's not there it does pass the test
    if (!input) return true;
    return type(input);
  }

  Object.defineProperty(fn, 'name', {
    value: `maybe(${type.name})`
  });

  Object.defineProperty(fn, 'withDefault', {
    value: defaultValue => {
      let nestedFn = x => {
        // if we have a value from JSON, typecheck it
        // if we don't, typecheck the default value
        return x ? type(x) : type(defaultValue);
      };

      Object.defineProperty(nestedFn, 'defaultValue', {
        value: defaultValue
      });
      Object.defineProperty(nestedFn, 'name', {
        value: `maybe(${type.name})`
      });
      return nestedFn;
    }
  });

  return fn;
}

export const isMaybe = type => type.name.indexOf('maybe') > -1;
