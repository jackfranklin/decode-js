import {
  createDecoder,
  decode,
  string
} from '../src/index';

describe('decoding an object of strings', () => {
  describe('given valid input', () => {
    it('decodes successfully', () => {
      const input = JSON.stringify({
        name: 'Jack',
        city: 'London'
      });
      const decoder = createDecoder({
        name: string,
        city: string,
      });

      expect(decode(input, decoder)).toEqual({
        name: 'Jack',
        city: 'London'
      });
    });
  });

  describe('given a missing field', () => {
    it('returns an error', () => {
      const input = JSON.stringify({
        name: 'Jack',
      });
      const decoder = createDecoder({
        name: string,
        city: string,
      });

      expect(decode(input, decoder)).toEqual({
        error: 'Expected field city (string) in response body'
      });
    });
  });
});
