export default class Decoder {
  constructor(opts = {}) {
    this.keys = {};
    Object.keys(opts).forEach(k => this.parseKey(opts, k));
  }

  parse(input) {
    const parsed = JSON.parse(input);
    return this.validate(parsed);
  }

  validate(parsed) {
    let foundKeys = [];
    let error;
    let parsedData = parsed;

    Object.keys(parsed).forEach(parsedKey => {
      if (this.keys[parsedKey] == undefined) {
        // TODO: throw
      } else {
        foundKeys.push(parsedKey);
        const value = parsed[parsedKey];
        if (this.keys[parsedKey].type(value) === true) {
          // do nothing
        } else {
          // TODO: throw invalid error
        }
      }
    });

    Object.keys(this.keys).forEach(k => {
      if (foundKeys.indexOf(k) === -1) {
        error = `Expected field ${k} (${this.keys[k].type.name}) in response body`;
      }
    });

    if (error) {
      return { error };
    } else {
      return parsedData;
    }
  }

  parseKey(opts, key) {
    this.keys[key] = {
      name: key,
      type: opts[key]
    }
  }
}
