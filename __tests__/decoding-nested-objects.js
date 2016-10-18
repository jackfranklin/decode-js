import { expectNoErrorsAndData } from './utils';

import {
  createDecoder,
  decode,
  string,
  number,
  object,
  maybe,
  maybeWithDefault,
  nullOr,
  arrayOf,
  rename,
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
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

  expectNoErrorsAndData(decoder, input, {
    name: 'Jack',
    info: {
      height: { about: '7ft' },
    },
  });
});

test('nested objects in arrays', () => {
  const input = JSON.stringify({
    repos: [{
      stargazers_count: 1,
      id: 1,
      full_name: 'foo',
      description: null,
      owner: {
        login: 'jack'
      }
    }, {
      stargazers_count: 1,
      id: 1,
      full_name: 'foo',
      description: 'blah',
      owner: {
        login: 'jack'
      }
    }]
  });

  const decoder = createDecoder({
    repos: arrayOf(object({
      id: number,
      repoName: rename('full_name', string),
      stars: rename('stargazers_count', number),
      description: nullOr(string, 'desc'),
      owner: object({
        user: rename('login', string)
      })
    }))
  });

  expectNoErrorsAndData(decoder, input, {
    repos: [{
      id: 1,
      stars: 1,
      repoName: 'foo',
      description: 'desc',
      owner: {
        user: 'jack'
      }
    }, {
      id: 1,
      stars: 1,
      repoName: 'foo',
      description: 'blah',
      owner: {
        user: 'jack'
      }
    }]
  });
});
