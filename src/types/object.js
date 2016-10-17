import { createType, propsAndProxy } from './utils';
import { createDecoder } from '../index';

// the object is just a new decoder
export const object = input => createDecoder(input);
