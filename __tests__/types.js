import * as types from '../src/types';

describe('getType', () => {
  test('it figures when something is an array', () => {
    expect(types.getType([])).toBe('array');
  });

  test('it knows when something is an object', () => {
    expect(types.getType({})).toBe('object');
  });

  test('it defaults to typeof for primitives', () => {
    ['string', 1234, true, false].forEach(t => expect(types.getType(t)).toBe(typeof t));
  });
});

describe('arrayOf', () => {
  const arrayOfStr = types.arrayOf(types.string);

  test('it returns true when the array conforms', () => {
    expect(arrayOfStr(['foo'])).toBe(true);
  });

  test('it fails when an item in the array does not match', () => {
    expect(arrayOfStr(['foo', 1])).toBe(false);
  });

  test('it sets the name of the newly constructed fn', () => {
    expect(arrayOfStr.name).toBe('arrayOf(string)');
  });
});

describe('maybe', () => {
  const maybeStr = types.maybe(types.string);

  test('it allows a value to not be present', () => {
    expect(maybeStr(undefined)).toBe(true);
  });

  test('it allows a value to be present and the right type', () => {
    expect(maybeStr('foo')).toBe(true);
  });

  test('it errors on an invalid type', () => {
    expect(maybeStr(123)).toBe(false);
  });

  test('it sets the name of the type correctly', () => {
    expect(maybeStr.name).toBe('maybe(string)');
  });

  describe('default value', () => {
    test('returns true if the default value matches the type', () => {
      const maybeStrDef = types.maybe(types.string).withDefault('foo');
      expect(maybeStrDef()).toBe(true);
    });

    test('errors if the type given is incorrect', () => {
      const maybeStrDef = types.maybe(types.string).withDefault('foo');
      expect(maybeStrDef(1234)).toBe(false);
    });
  })
});
