export const wrongTypeError = ({
  field,
  expected,
  actual
}) => (
  `Expected field ${field} to be ${expected}, got ${actual}`
);

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
