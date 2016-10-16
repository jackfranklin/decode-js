import Decoder from './decoder';
import * as types from './types';
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

export const string = types.string;
export const number = types.number;
export const arrayOf = types.arrayOf;
export const any = types.any;
export const maybe = types.maybe;

// the object type is just creating a nested decoder
export const object = createDecoder;

