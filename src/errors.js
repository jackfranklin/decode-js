export const wrongTypeError = ({
  field,
  expected,
  actual
}) => {
  if (actual === 'array' && expected.indexOf('arrayOf') > -1) {
    return `Expected field ${field} to be ${expected}, got array of mixed types`;
  } else if (expected.indexOf('maybe') > -1) {
    return `Expected field ${field} to be ${expected}, got maybe(${actual})`;
  } else {
    return `Expected field ${field} to be ${expected}, got ${actual}`
  }
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
