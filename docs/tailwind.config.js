/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/index.html',
    './app/templates/**/*.hbs',
    './app/components/**/*.{hbs,js}',
    './app/styles/**/*.css',
  ],
  theme: {
    extend: {
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
  plugins: [require('@tailwindcss/typography')],
};
