import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import uglify from 'rollup-plugin-uglify';

let plugins = [
  babel(babelrc()),
  process.env.NODE_ENV === 'production' ? uglify() : undefined,
].filter(x => x);

let targets = {
  'production': [
    {
      dest: 'lib/decode-js.umd.min.js',
      format: 'umd',
      moduleName: 'DecodeJS'
    },
  ],
  'development': [
    {
      dest: 'lib/decode-js.umd.js',
      format: 'umd',
      moduleName: 'DecodeJS'
    },
    {
      dest: 'lib/index.js',
      format: 'cjs'
    }
  ]
};

const config = {
  entry: 'src/index.js',
  plugins,
  targets: targets[process.env.NODE_ENV || 'development'],
};

export default config;
