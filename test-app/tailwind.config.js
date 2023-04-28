/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/index.html',
    './app/templates/**/*.hbs',
    './app/components/**/*.{hbs,js}',
    './app/styles/**/*.css',
    './app/helpers/**/*.js',
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      fontFamily: {
        sans: [
          'Segoe UI',
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
    },
  },
  // eslint-disable-next-line node/no-unpublished-require
  plugins: [require('@tailwindcss/forms')],
};
