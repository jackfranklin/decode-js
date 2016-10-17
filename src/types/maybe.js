import { createType, propsAndProxy } from './utils';

export const maybe = type => {
  return createType({
    name: `maybe(${type.name})`,
    check: input => {
      if (input === undefined) return true;
      return type.check(input);
    },
    props: propsAndProxy({}, type),
  });
};

export const maybeWithDefault = (type, defaultValue) => {
  return createType({
    name: `maybe(${type.name})`,
    check: input => {
      if (input === undefined) return true;
      return type.check(input);
    },
    props: propsAndProxy({
      defaultValue,
    }, type)
  });
}
