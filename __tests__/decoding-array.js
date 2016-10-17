import { expectNoErrorsAndData } from './utils';
import {
  createDecoder,
  decode,
  string,
  number,
  arrayOf,
  any
} from '../src/index';

test('it can decode an array of things', () => {
  const input = JSON.stringify({
    name: 'Jack',
    numbers: [1, 2, 3]
  });
  const decoder = createDecoder({
    name: string,
    numbers: arrayOf(number)
  });

  expectNoErrorsAndData(decoder, input, {
    name: 'Jack',
    numbers: [1, 2, 3]
  });
});

test('it can deal with the item not being an array', () => {
  const input = JSON.stringify({
    name: 'Jack',
    numbers: 'foo',
  });
  const decoder = createDecoder({
    name: string,
    numbers: arrayOf(number)
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field numbers to be arrayOf(number), got foo (string)'
  ]);
});

test('it can deal with an invalid type in the array', () => {
  const input = JSON.stringify({
    name: 'Jack',
    numbers: [1, 2, 'foo'],
  });

  const decoder = createDecoder({
    name: string,
    numbers: arrayOf(number)
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field numbers to be arrayOf(number), got array of mixed types'
  ]);
});

test('it can accept an array of any type', () => {
  const input = JSON.stringify({
    name: 'Jack',
    numbers: [1, 2, 'foo'],
  });

  const decoder = createDecoder({
    name: string,
    numbers: arrayOf(any)
  });

  expectNoErrorsAndData(decoder, input, {
    name: 'Jack',
    numbers: [1, 2, 'foo'],
  });
});
