import Decoder from './decoder';
import * as primitives from './types/primitives';
import * as maybes from './types/maybe';
import * as arrays from './types/array';
import * as renames from './types/rename';
import * as objects from './types/object';

import Result from './result';
import { invalidJsonError } from './errors';

export const decodeString = str => {
  try {
    const parsed = JSON.parse(str);
    return new Result({
      parsed,
      errors: [],
    });
  } catch (e) {
    return new Result({
      parsed: '',
      errors: [invalidJsonError({ message: e.message })],
    });
  };

};

export const createDecoder = obj => new Decoder(obj);

export const decode = (input, decoder) => {
  return decoder.parse(input);
};

export const string = primitives.string;
export const number = primitives.number;
export const boolean = primitives.boolean;
export const any = primitives.any;

export const maybe = maybes.maybe;
export const maybeWithDefault = maybes.maybeWithDefault;

export const arrayOf = arrays.arrayOf;

export const rename = renames.rename;

export const object = objects.object;
