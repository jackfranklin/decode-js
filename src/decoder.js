import omit from 'lodash/omit';

import {
  wrongTypeError,
  missingFieldError,
  wrongMaybeDefaultError,
} from './errors';

import {
  getType,
  isMaybe,
  isMaybeWithDefault,
} from './types';

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
          // TODO: need to deal with maybes in here?
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

    Object.keys(this.keys).filter(k => {
      return foundKeys.indexOf(k) === -1;
    }).forEach(k => {
      // if the missing key was a maybe with a default value
      // then we need to set the default value
      // if the missing key is a maybe without a default
      // then that's fine, just don't error
      if (isMaybe(this.keys[k].type)) {
        if (this.keys[k].type.hasOwnProperty('defaultValue')) {
          const typeFn = this.keys[k].type;
          if (typeFn(typeFn.defaultValue)) {
            parsedData[k] = typeFn.defaultValue;
          }
        }
      } else {
        // if it wasn't found and it wasn't a maybe
        // add the missing field error
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
    const type = opts[key];
    const name = key;

    if (isMaybeWithDefault(type)) {
      const defVal = type.defaultValue;
      if (!type(type.defaultValue)) {
        throw new Error(wrongMaybeDefaultError({
          field: name,
          expected: type.name,
          value: type.defaultValue,
        }));
      }
    }

    this.keys[key] = { name, type };
  }
}
