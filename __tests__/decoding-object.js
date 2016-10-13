import {
  createDecoder,
  decode,
  string
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
    'Expected field city to be string, got number'
  ]);
});
