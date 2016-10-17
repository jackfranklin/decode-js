import { createType, getType } from './utils';

export const arrayOf = type => {
  return createType({
    name: `arrayOf(${type.name})`,
    check: input => {
      if (getType(input) !== 'array') {
        return false;
      }

      return input.map(type.check).every(x => x === true);
    },
  });
};
