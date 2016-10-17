import {
  createDecoder,
  string,
  boolean,
  renameFrom,
  decode,
  maybe
} from '../src/index';

test('a value can be renamed', () => {
  const input = JSON.stringify({
    name: 'Jack',
    likes_js: true,
  });
  const decoder = createDecoder({
    name: string,
    likesJs: renameFrom('likes_js', boolean),
  });

  expect(decode(input, decoder).data).toEqual({
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
    likesJs: renameFrom('likes_js', string),
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
    likesJs: renameFrom('likes_js', string),
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
    likesJs: renameFrom('likes_js', maybe(boolean)),
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
    likesJs: renameFrom(
      'likes_js',
      maybe(boolean).withDefault(true)
    ),
  });
  const result = decode(input, decoder);

  expect(result.errors).toEqual([]);

  expect(result.data).toEqual({
    name: 'Jack',
    likesJs: true,
  });
});
