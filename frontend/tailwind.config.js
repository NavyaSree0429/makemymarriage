/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
        roseGold: {
          light: '#f7e7e6',
          DEFAULT: '#b76e79',
          dark: '#8e4a54',
        }
      }
    },
  },
  plugins: [],
}
