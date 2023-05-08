'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { globSync } = require('glob');

function urlForPrember() {
  const index = '/index';
  const files = globSync('./docs/**/*.md');
  const normalizedFiles = files.map((file) => {
    const f = `/${file.replace('.md', '')}`;
    return f.endsWith(index) ? f.substring(0, f.length - index.length) : f;
  });

  return ['/', ...normalizedFiles];
}

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
    prember: {
      urls: urlForPrember(),
    },
    svgJar: {
      sourceDirs: ['public/images/icons', 'public/images/assets'],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
