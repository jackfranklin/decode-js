import { createPrimitiveType, createType } from './utils';

export const boolean = createPrimitiveType('boolean');
export const string = createPrimitiveType('string');
export const number = createPrimitiveType('number');

export const any = createType({
  name: 'any',
  check: () => true
});
