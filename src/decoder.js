import omit from 'lodash/omit';

import {
  wrongTypeError,
  missingFieldError,
} from './errors';

import { getType } from './types';

import Result from './result';


export default class Decoder {
  constructor(opts = {}) {
    this.keys = {};
    Object.keys(opts).forEach(k => this.parseKey(opts, k));
  }

  parse(input) {
    let parsed;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return new Result({
        parsed: null,
        errors: [
          `Invalid JSON: ${e.message}`
        ]
      });
    }
    return this.validate(parsed);
  }

  validate(parsed) {
    let foundKeys = [];
    let errors = [];
    let parsedData = parsed;

    Object.keys(parsed).forEach(parsedKey => {
      if (this.keys[parsedKey] == undefined) {
        parsedData = omit(parsedData, parsedKey);
      } else {
        foundKeys.push(parsedKey);
        const value = parsed[parsedKey];
        if (this.keys[parsedKey].type(value) === true) {
          // do nothing
        } else {
          errors.push(wrongTypeError({
            field: parsedKey,
            expected: this.keys[parsedKey].type.name,
            actual: getType(value)
          }));
        }
      }
    });

    Object.keys(this.keys).forEach(k => {
      if (foundKeys.indexOf(k) === -1) {
        errors.push(missingFieldError({
          field: k,
          type: this.keys[k].type.name
        }));
      }
    });

    return new Result({
      parsed: parsedData,
      errors,
    });
  }

  parseKey(opts, key) {
    this.keys[key] = {
      name: key,
      type: opts[key]
    }
  }
}
