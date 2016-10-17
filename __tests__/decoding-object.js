import {
  createDecoder,
  decode,
  string,
  number,
  maybe,
  maybeWithDefault
} from '../src/index';

test('with valid input it can decode an object', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: 'London'
  });
  const decoder = createDecoder({
    name: string,
    city: string,
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    city: 'London'
  });
});

test('a missing field causes an error', () => {
  const input = JSON.stringify({
    name: 'Jack',
  });
  const decoder = createDecoder({
    name: string,
    city: string,
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field city (string) in response body'
  ]);
});


test('any extra fields are ignored', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: 'London',
    age: 24,
  });

  const decoder = createDecoder({
    name: string,
    city: string,
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    city: 'London'
  });
});

test('an invalid type causes an error', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: 123,
  });
  const decoder = createDecoder({
    name: string,
    city: string,
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field city to be string, got 123 (number)'
  ]);
});

test('an invalid nested object causes an error', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: {},
  });

  const decoder = createDecoder({
    name: string,
    city: string,
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field city to be string, got {} (object)'
  ]);
});

test('an unexpected array causes an error', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: [],
  });

  const decoder = createDecoder({
    name: string,
    city: string,
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field city to be string, got [] (array)'
  ]);
});

test('it can decode numbers', () => {
  const input = JSON.stringify({
    name: 'Jack',
    age: 24,
  });

  const decoder = createDecoder({
    name: string,
    age: number,
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    age: 24
  });
});

test('when there is a missing field and an extra field', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: 'foo'
  });

  const decoder = createDecoder({
    name: string,
    age: number,
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field age (number) in response body'
  ]);
});

test('it can deal with maybe values that are missing', () => {
  const input = JSON.stringify({
    name: 'Jack',
  });

  const decoder = createDecoder({
    name: string,
    city: maybe(string),
  });

  expect(decode(input, decoder).isFailure()).toBe(false);
  expect(decode(input, decoder).data).toEqual({
   name: 'Jack'
 });
});

test('it can deal with maybe values that are present', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: 'London',
  });

  const decoder = createDecoder({
    name: string,
    city: maybe(string),
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    city: 'London',
 });
});

test('errors on maybe values with mismatch of types', () => {
  const input = JSON.stringify({
    name: 'Jack',
    city: 'London',
  });

  const decoder = createDecoder({
    name: string,
    city: maybe(number),
  });

  expect(decode(input, decoder).errors).toEqual([
    'Expected field city to be maybe(number), got maybe(string)'
 ]);
});

test('it can deal with maybes that have a default value', () => {
  const input = JSON.stringify({
    name: 'Jack',
  });

  const decoder = createDecoder({
    name: string,
    city: maybeWithDefault(string, 'Truro'),
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    city: 'Truro',
  });
});
