import { omit, invert, flatten } from './utils';

import {
  wrongTypeError,
  missingFieldError,
  wrongMaybeDefaultError,
} from './errors';

import {
  getType,
  isMaybe,
  isMaybeWithDefault,
} from './types/utils';

import Result from './result';


const nestError = (field, e) => `${field}: ${e}`;

export default class Decoder {
  constructor(opts = {}) {
    this.keys = {};
    this.check = this.check.bind(this);
    Object.keys(opts).forEach(k => this.parseKey(opts, k));
  }

  // when the decoder is nested as a type
  // it needs to expose its validation method
  get props() {
    return {
      validate: this.validate.bind(this),
    }
  }

  get name() {
    return 'object';
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
      return this.keys[k].type.props.hasOwnProperty('renameFrom');
    }).map(k => {
      return {
        to: k,
        from: this.keys[k].type.props.renameFrom
      };
    }).forEach(({from, to}) => res[from] = to);

    return res;
  }

  check(parsed) {
    return this.validate(parsed).errors.length === 0;
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
        const value = parsedData[parsedKey];
        const typeName = this.keys[parsedKey].type.name;
        if (typeName.indexOf('object') > -1 && typeName.indexOf('array') === -1) {
          const decoder = this.keys[parsedKey].type;
          const res = decoder.props.validate(value);
          errors = errors.concat(res.errors.map(e => nestError(parsedKey, e)));
          parsedData[parsedKey] = res.data;
        } else if (typeName.indexOf('arrayOf(object)') > -1) {
          // need to run the nested decoder
          // and then pull any errors up
          // and map each item to be the result of running the nested obj decoder
          const decodedData = value.map(obj => {
            const decoder = this.keys[parsedKey].type;
            return decoder.props.validate(obj);
          });
          const nestedArrayErrors = flatten(decodedData.map(d => {
            return d.errors.map(e => nestError(`${parsedKey} ${typeName}`, e));
          }));
          errors = errors.concat(nestedArrayErrors);
          parsedData[parsedKey] = flatten(decodedData.map(d => d.parsed));
        } else {
          if (this.keys[parsedKey].type.check(value) === true) {
            // the type check passed

            // if it passed for a nullOr, we actually want to change the value
            if (this.keys[parsedKey].type.name.indexOf('nullOr') > -1 && value === null) {
              parsedData[parsedKey] = this.keys[parsedKey].type.props.defaultValue;
            }
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
        if (this.keys[k].type.props.hasOwnProperty('defaultValue')) {
          parsedData[k] = this.keys[k].type.props.defaultValue;
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
      const defVal = type.props.defaultValue;
      if (!type.check(defVal)) {
        throw new Error(wrongMaybeDefaultError({
          field: name,
          expected: type.name,
          value: defVal,
        }));
      }
    }

    this.keys[key] = { name, type };
  }
}
