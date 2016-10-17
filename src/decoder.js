import omit from 'lodash/omit';
import invert from 'lodash/invert';

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


const nestError = (field, e) => `${field}: ${e}`;

export default class Decoder {
  constructor(opts = {}) {
    this.keys = {};
    Object.keys(opts).forEach(k => this.parseKey(opts, k));
  }

  get name() {
    return 'decoder';
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

  renames() {
    let res = {};

    const fromToMap = Object.keys(this.keys).filter(k => {
      return this.keys[k].type.hasOwnProperty('renameFrom');
    }).map(k => {
      return {
        to: k,
        from: this.keys[k].type.renameFrom
      };
    }).forEach(({from, to}) => res[from] = to);

    return res;
  }

  validate(parsed) {
    let foundKeys = [];
    let errors = [];
    let parsedData = parsed;
    let renamedKeys = this.renames();

    Object.keys(parsed).forEach(parsedKey => {
      let skip = false;

      if (this.keys[parsedKey] == undefined) {
        // if it's a key to be renamed, we'll do the renaming now before
        // type checking and so on
        if (renamedKeys[parsedKey]) {
          const oldKey = parsedKey;
          const newKey = renamedKeys[oldKey];

          const data = parsedData[oldKey];

          parsedData[newKey] = data;
          parsedKey = newKey;
          parsedData = omit(parsedData, oldKey);
        } else {
          // just omit the key if we don't know about it
          // and we're not renaming it
          parsedData = omit(parsedData, parsedKey);
          skip = true;
        }
      }

      if (skip === false) {
        foundKeys.push(parsedKey);
        const value = parsed[parsedKey];
        if (this.keys[parsedKey].type.name === 'decoder') {
          const decoder = this.keys[parsedKey].type;
          const res = decoder.validate(value);
          errors = errors.concat(res.errors.map(e => nestError(parsedKey, e)));
          parsedData[parsedKey] = res.data;
        } else {
          if (this.keys[parsedKey].type(value) === true) {
            // do nothing, all is good in the world
          } else {
            const invertedRenames = invert(renamedKeys);

            // if it was renamed, show the non-renamed key as the error
            const field = invertedRenames[parsedKey] ?
              `${invertedRenames[parsedKey]} (${parsedKey})` :
              parsedKey;

            errors.push(wrongTypeError({
              field,
              expected: this.keys[parsedKey].type.name,
              value,
            }));
          }
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
          parsedData[k] = this.keys[k].type.defaultValue;
        }
      } else {
        // if it wasn't found and it wasn't a maybe
        // add the missing field error

        const invertedRenames = invert(renamedKeys);

        // if it was renamed, show the non-renamed key as the error
        const field = invertedRenames[k] ?  invertedRenames[k] : k

        errors.push(missingFieldError({
          field,
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
