import { getType } from './types';

const prettyPrintVal = val => {
  // TODO: we could nicely print the contents of these
  // to show how many there are
  if (getType(val) === 'array') {
    return '[]';
  } else if (getType(val) === 'object') {
    return '{}';
  } else {
    return val;
  }
}
export const wrongTypeError = ({
  field,
  expected,
  value
}) => {
  const actual = getType(value);
  if (actual === 'array' && expected.indexOf('arrayOf') > -1) {
    return `Expected field ${field} to be ${expected}, got array of mixed types`;
  } else if (expected.indexOf('maybe') > -1) {
    return `Expected field ${field} to be ${expected}, got maybe(${actual})`;
  } else {
    const val = prettyPrintVal(value);
    return `Expected field ${field} to be ${expected}, got ${val} (${actual})`
  }
};

const stripMaybe = type => {
  const maybeRegex = /maybe\((.+)\)/i;
  const res = maybeRegex.exec(type);
  return res ? res[1] : null;
}
export const wrongMaybeDefaultError = ({
  field,
  expected,
  value
}) => {
  const stripped = stripMaybe(expected);
  const actualType = getType(value);
  return `Expected default value for field ${field} to be ${stripped}, got ${value} (${actualType})`
};

export const missingFieldError = ({
  field,
  type
}) => (
  `Expected field ${field} (${type}) in response body`
);

export const invalidJsonError = ({
  message
}) => (
  `Invalid JSON${message ? `: ${message}` : ''}`
);
