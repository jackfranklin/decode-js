import { createType } from './utils';

export const maybe = type => {
  return createType({
    name: `maybe(${type.name})`,
    check: input => {
      if (input === undefined) return true;
      return type.check(input);
    },
  });
};

export const maybeWithDefault = (type, defaultValue) => {
  return createType({
    name: `maybe(${type.name})`,
    check: input => {
      if (input === undefined) return true;
      return type.check(input);
    },
    props: {
      defaultValue,
    }
  });
}
