export const createType = ({
  name,
  check,
  props
}) => ({
  name,
  check,
  props: props || {},
});

export const createPrimitiveType = name => {
  return createType({
    name,
    check: x => getType(x) === name
  });
};

export const propsAndProxy = (props, proxyType) => {
  return Object.assign({}, props, proxyType.props);
}

export const getType = input => {
  if (Array.isArray(input)) return 'array';

  return typeof input;
}

export const isMaybe = type => type.name.indexOf('maybe') > -1;

export const isMaybeWithDefault = type => (
  isMaybe(type) && type.props.hasOwnProperty('defaultValue')
);

