/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D2FD8',
        secondary: '#0F0E5E',
        white: '#F8F8F8',
      },
    },
  },
  plugins: [],
}