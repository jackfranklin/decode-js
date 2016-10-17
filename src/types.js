import Decoder from './decoder';

export const getType = input => {
  if (Array.isArray(input)) return 'array';

  return typeof input;
}

export const string = input => getType(input) === 'string';

export const number = input => getType(input) === 'number';

export const boolean = input => getType(input) === 'boolean';

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
    if (input === undefined) return true;
    return type(input);
  }

  Object.defineProperty(fn, 'name', {
    value: `maybe(${type.name})`
  });

  Object.defineProperty(fn, 'withDefault', {
    value: defaultValue => {
      let nestedFn = x => maybe(type)(x);

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

export const isMaybeWithDefault = type => (
  isMaybe(type) && type.hasOwnProperty('defaultValue')
);

export const renameFrom = (fieldName, type) => {
  let nestedFn = x => type(x);
  Object.defineProperty(nestedFn, 'name', {
    value: type.name
  });

  Object.defineProperty(nestedFn, 'renameFrom', {
    value: fieldName
  });

  // depending on what the type is to rename
  // we need to proxy some methods of the type onto this renameFrom type
  // so that the decoder sees them as it expects
  if (type.constructor === Decoder) {
    Object.defineProperty(nestedFn, 'validate', {
      value: type.validate.bind(type)
    });
  }

  if (isMaybe(type)) {
    Object.defineProperty(nestedFn, 'defaultValue', {
      value: type.hasOwnProperty('defaultValue') && type.defaultValue,
    });
  }

  return nestedFn;
}
