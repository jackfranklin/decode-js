
import { decodeString } from '../src/index';

describe('decoding a string', () => {
  describe('given valid input', () => {
    it('decodes successfully', () => {
      const input = JSON.stringify('foo');
      expect(decodeString(input)).toEqual('foo');
    });
  });

  describe('given invalid input', () => {
    it('throws an error', () => {
      const input = 'notvalid';
      expect(() => decodeString(input)).toThrowError();
    });
  });
});
