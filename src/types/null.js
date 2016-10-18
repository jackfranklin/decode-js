import { createType, propsAndProxy } from './utils';

export const nullType = createType({
  name: 'null',
  check: i => i === null,
});

export const nullOr = (type, defaultValue) => {
  return createType({
    name: `nullOr(${type.name})`,
    check: input => {
      return input === null || type.check(input);
    },
    props: {
      defaultValue,
    },
  })
};
