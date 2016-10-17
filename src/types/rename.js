import { createType, propsAndProxy } from './utils';

export const rename = (renameFrom, type) => {
  return createType({
    name: type.name,
    check: type.check,
    props: propsAndProxy({
      renameFrom,
    }, type),
  });
};
