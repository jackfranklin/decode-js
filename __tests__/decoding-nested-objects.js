import {
  createDecoder,
  decode,
  string,
  number,
  object,
  maybe,
  maybeWithDefault,
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

test('a nested decoder can be within a maybe', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {
      height: { about: '6ft' },
    },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: maybe(createDecoder({
        about: string
      })),
    }),
  });

  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual({
    name: 'Jack',
    info: {
      height: { about: '6ft' },
    },
  });
});

test('a maybe nested decoder can be missing', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {},
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: maybe(createDecoder({
        about: string
      })),
    }),
  });

  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual({
    name: 'Jack',
    info: {}
  });
});

test('a maybe nested decoder can have a default and is keyed correctly', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {},
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: maybeWithDefault(createDecoder({
        about: string
      }), { about: '5ft' }),
    }),
  });

  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual({
    name: 'Jack',
    info: {
      height: { about: '5ft' }
    }
  });
});

test('a nested decoder can decode a maybe', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {
      height: { about: '6ft' },
    },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: maybe(createDecoder({
        about: maybe(string)
      })),
    }),
  });

  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual({
    name: 'Jack',
    info: {
      height: { about: '6ft' },
    },
  });
});

test('a nested decoder can decode a maybe that is not there', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {
      height: {},
    },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: maybe(createDecoder({
        about: maybe(string)
      })),
    }),
  });

  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual({
    name: 'Jack',
    info: {
      height: {},
    },
  });
});

test('a nested decoder can decode a maybe with default that is not there', () => {
  const input = JSON.stringify({
    name: 'Jack',
    info: {
      height: {},
    },
  });

  const decoder = createDecoder({
    name: string,
    info: createDecoder({
      height: maybe(createDecoder({
        about: maybeWithDefault(string, '7ft')
      })),
    }),
  });

  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual({
    name: 'Jack',
    info: {
      height: { about: '7ft' },
    },
  });
});
