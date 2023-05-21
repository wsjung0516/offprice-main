/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}']
  },
	content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxHeight: {
      '90vh': '90vh',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}