import { expectNoErrorsAndData } from './utils';

import {
  createDecoder,
  string,
  boolean,
  rename,
  decode,
  maybe,
  maybeWithDefault,
  arrayOf,
  number
} from '../src/index';

test('a value can be renamed', () => {
  const input = JSON.stringify({
    name: 'Jack',
    likes_js: true,
  });
  const decoder = createDecoder({
    name: string,
    likesJs: rename('likes_js', boolean),
  });

  expectNoErrorsAndData(decoder, input, {
    name: 'Jack',
    likesJs: true
  });
});

test('a renamed value is still type checked', () => {
  const input = JSON.stringify({
    name: 'Jack',
    likes_js: true,
  });
  const decoder = createDecoder({
    name: string,
    likesJs: rename('likes_js', string),
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field likes_js (likesJs) to be string, got true (boolean)'
  ]);
});

test('a missing renamed field is an error', () => {
  const input = JSON.stringify({
    name: 'Jack',
  });
  const decoder = createDecoder({
    name: string,
    likesJs: rename('likes_js', string),
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field likes_js (string) in response body'
  ]);
});

test('a maybe can be renamed', () => {
  const input = JSON.stringify({
    name: 'Jack',
    likes_js: true,
  });
  const decoder = createDecoder({
    name: string,
    likesJs: rename('likes_js', maybe(boolean)),
  });
  const result = decode(input, decoder);

  expect(result.errors).toEqual([]);

  expect(result.data).toEqual({
    name: 'Jack',
    likesJs: true,
  });
});

test('a maybe with default can be renamed', () => {
  const input = JSON.stringify({
    name: 'Jack',
  });
  const decoder = createDecoder({
    name: string,
    likesJs: rename(
      'likes_js',
      maybeWithDefault(boolean, true)
    ),
  });
  const result = decode(input, decoder);

  expect(result.errors).toEqual([]);

  expect(result.data).toEqual({
    name: 'Jack',
    likesJs: true,
  });
});

test('an array can be renamed', () => {
  const input = JSON.stringify({
    name: 'Jack',
    some_numbers: [1, 2, 3],
  });

  const decoder = createDecoder({
    name: string,
    numbers: rename(
      'some_numbers',
      arrayOf(number)
    ),
  });

  const result = decode(input, decoder);

  expect(result.errors).toEqual([]);

  expect(result.data).toEqual({
    name: 'Jack',
    numbers: [1, 2, 3],
  });
});

test('a renamed array with type error errors accordingly', () => {
  const input = JSON.stringify({
    name: 'Jack',
    some_numbers: [1, 2, 'foo'],
  });

  const decoder = createDecoder({
    name: string,
    numbers: rename(
      'some_numbers',
      arrayOf(number)
    ),
  });

  const result = decode(input, decoder);

  expect(result.errors).toEqual([
    'Expected field some_numbers (numbers) to be arrayOf(number), got array of mixed types'
  ]);
});

test('a nested decoder can be renamed', () => {
  const input = JSON.stringify({
    name: 'Jack',
    some_info: { colour: 'red' },
  });

  const decoder = createDecoder({
    name: string,
    info: rename(
      'some_info',
      createDecoder({
        colour: string,
      }),
    ),
  });

  const result = decode(input, decoder);

  expect(result.errors).toEqual([]);

  expect(result.data).toEqual({
    name: 'Jack',
    info: { colour: 'red' },
  });
});

test('a nested decoder that is renamed errors accordingly', () => {
  const input = JSON.stringify({
    name: 'Jack',
    some_info: { colour: 123 },
  });

  const decoder = createDecoder({
    name: string,
    info: rename(
      'some_info',
      createDecoder({
        colour: string,
      }),
    ),
  });

  const result = decode(input, decoder);

  expect(result.errors).toEqual([
    'info: Expected field colour to be string, got 123 (number)'
  ]);
});
