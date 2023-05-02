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
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
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
