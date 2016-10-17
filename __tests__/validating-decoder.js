import {
  createDecoder,
  maybeWithDefault,
  string,
} from '../src/index';

test('a valid decoder does not error', () => {
  expect(() => {
    createDecoder({
      name: string,
    });
  }).not.toThrow();
});

test('decoder with invalid maybe defaults throws', () => {
  expect(() => {
    createDecoder({
      name: maybeWithDefault(string, 123),
    });
  }).toThrow('Expected default value for field name to be string, got 123 (number)');
});
