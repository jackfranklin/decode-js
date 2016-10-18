import { createType, propsAndProxy } from './utils';

export const nullType = createType({
  name: 'null',
  check: i => i === null,
});

export const nullOr = defaultValue => {
  return createType({
    name: `nullOr`,
    check: nullType.check,
    props: {
      defaultValue,
    },
  })
};
