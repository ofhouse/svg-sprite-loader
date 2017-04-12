/* eslint-disable no-unused-expressions */
const { strictEqual } = require('assert');
const configure = require('../lib/configurator');

describe('configurator', () => {
  let context;

  beforeEach(() => {
    context = {
      version: 2,

      options: {
        target: 'web'
      },

      _module: {
        issuer: {
          resource: '/foo/index.js'
        }
      },

      _compiler: {
        name: undefined
      }
    };
  });

  it('should properly autodetect runtime', () => {
    const options = context.options;

    options.target = 'web';
    strictEqual(configure({ context }).runtime, 'browser');

    options.target = 'node';
    strictEqual(configure({ context }).runtime, 'default');
  });

  it('should properly autodetect extract mode', () => {
    const issuer = context._module.issuer;

    ['css', 'scss', 'sass', 'styl', 'less', 'html'].forEach((ext) => {
      issuer.resource = `styles.${ext}`;
      strictEqual(configure({ context }).extract, true);
    });

    ['js', 'jsx', 'ts'].forEach((ext) => {
      issuer.resource = `index.${ext}`;
      strictEqual(configure({ context }).extract, false);
    });
  });

  it('should properly autodetect if export should be transpilers friendly', () => {
    context.version = 2;
    strictEqual(configure({ context }).esModule, true);

    context.version = 1;
    strictEqual(configure({ context }).esModule, false);

    // Should always be falsy if compiled in extract-text-webpack-plugin child compiler
    context.version = 2;
    context._compiler.name = 'extract-text-webpack-plugin';
    strictEqual(configure({ context }).esModule, false);
  });
});