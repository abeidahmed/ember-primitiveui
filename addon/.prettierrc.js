'use strict';

module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: '*.{js,ts}',
      options: {
        singleQuote: true,
        semi: true,
        arrowParens: 'always',
        trailingComma: 'es5',
      },
    },
  ],
};
