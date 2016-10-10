import Decoder from './decoder';
import * as types from './types';

export const decodeString = str => JSON.parse(str);

export const createDecoder = obj => new Decoder(obj);

export const decode = (input, decoder) => {
  return decoder.parse(input);
};

export const string = types.string;

