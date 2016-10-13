import Decoder from './decoder';
import * as types from './types';
import Result from './result';
import { invalidJsonError } from './errors';

export const decodeString = str => {
  // just create an object decoder and pull the values off it
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

