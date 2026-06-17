/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0e9488', // Teal
          hover: '#0b7a70',
          soft: '#e3f4f2',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f1f6f5',
        },
        danger: {
          DEFAULT: '#cf4636',
          soft: '#fbe7e4',
        },
        success: {
          DEFAULT: '#2f9e6b',
          soft: '#e4f4ec',
        },
        warning: {
          DEFAULT: '#c9852b',
          soft: '#f8eedd',
        }
      }
    },
  },
  plugins: [],
}
