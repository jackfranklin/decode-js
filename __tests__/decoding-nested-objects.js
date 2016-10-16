import {
  createDecoder,
  decode,
  string,
  number,
  object,
} from '../src/index';

test('you can nest decoders to decode nested objects', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: { colour: 'red' },
  });

  const decoder = createDecoder({
    name: string,
    info: object({
      colour: string,
    }),
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    info: { colour: 'red' },
  });
});

test('errors in a nested decoder are pulled up to the top level and prefixed', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: { colour: 123 },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      colour: string,
    }),
  });

  expect(decode(input, decoder).errors).toEqual([
    'info: Expected field colour to be string, got 123 (number)'
  ]);
});

test('it can deeply nest things', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {
      height: { about: '6ft' },
    },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: createDecoder({
        about: string
      }),
    }),
  });

  expect(decode(input, decoder).data).toEqual({
    name: 'Jack',
    info: {
      height: { about: '6ft' },
    },
  });
});

test('it can deal with errors in deeply nested things', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {
      height: { about: 6 },
    },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: createDecoder({
        about: string
      }),
    }),
  });

  expect(decode(input, decoder).errors).toEqual([
    'info: height: Expected field about to be string, got 6 (number)'
  ]);
});
