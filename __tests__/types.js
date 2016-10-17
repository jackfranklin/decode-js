import { getType } from '../src/types/utils';

import { arrayOf } from '../src/types/array';
import { maybe, maybeWithDefault } from '../src/types/maybe';
import { string } from '../src/types/primitives';

describe('getType', () => {
  test('it figures when something is an array', () => {
    expect(getType([])).toBe('array');
  });

  test('it knows when something is an object', () => {
    expect(getType({})).toBe('object');
  });

  test('it defaults to typeof for primitives', () => {
    ['string', 1234, true, false].forEach(t => expect(getType(t)).toBe(typeof t));
  });
});

describe('arrayOf', () => {
  const arrayOfStr = arrayOf(string);

  test('it returns true when the array conforms', () => {
    expect(arrayOfStr.check(['foo'])).toBe(true);
  });

  test('it fails when an item in the array does not match', () => {
    expect(arrayOfStr.check(['foo', 1])).toBe(false);
  });

  test('has the correct name', () => {
    expect(arrayOfStr.name).toBe('arrayOf(string)');
  });
});

describe('maybe', () => {
  const maybeStr = maybe(string);

  test('it allows a value to not be present', () => {
    expect(maybeStr.check(undefined)).toBe(true);
  });

  test('it allows a value to be present and the right type', () => {
    expect(maybeStr.check('foo')).toBe(true);
  });

  test('it errors on an invalid type', () => {
    expect(maybeStr.check(123)).toBe(false);
  });

  test('it sets the name of the type correctly', () => {
    expect(maybeStr.name).toBe('maybe(string)');
  });

  describe('default value', () => {
    const maybeStrDef = maybeWithDefault(string, 'foo');

    test('returns true if the default value matches the type', () => {
      expect(maybeStrDef.check()).toBe(true);
    });

    test('errors if the type given is incorrect', () => {
      expect(maybeStrDef.check(1234)).toBe(false);
    });
  })
});
