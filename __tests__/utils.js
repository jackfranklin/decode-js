import { decode } from '../src/index';

export const expectNoErrorsAndData = (decoder, input, data) => {
  const res = decode(input, decoder);
  expect(res.errors).toEqual([]);
  expect(res.data).toEqual(data);
};
