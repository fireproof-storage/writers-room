/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [typography],
}

