'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        cacheInclude: [/.*\.(css|hbs)$/, /.tailwind\.config\.js$/],
        includePaths: ['app'],
        plugins: [
          { module: require('postcss-import') },
          { module: require('autoprefixer') },
          require('tailwindcss')('./tailwind.config.js'),
        ],
      },
    },
  });

  /*
    This build file specifies the options for the test app of this
    addon, located in `/tests/test-app`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
