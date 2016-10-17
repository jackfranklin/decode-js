import { decodeString } from '../src/index';

test('it can decode a string with valid input', () => {

  const input = JSON.stringify('foo');
  const result = decodeString(input);
  expect(result.data).toEqual('foo');
});

test('it returns an error for invalid input', () => {
  const input = 'notvalid';
  const result = decodeString(input);
  expect(result.isFailure()).toBe(true);
  expect(result.errors).toEqual([
    'Invalid JSON: Unexpected token o in JSON at position 1'
  ]);
});
