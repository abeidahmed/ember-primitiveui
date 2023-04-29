'use strict';

module.exports = {
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
