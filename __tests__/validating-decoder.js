import {
  createDecoder,
  maybe,
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
      name: maybe(string).withDefault(123),
    });
  }).toThrow('Expected default value for field name to be string, got 123 (number)');
});
