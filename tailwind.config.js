/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        gold: {
          50: '#fdfaf2',
          100: '#f9f1db',
          200: '#f2e2b5',
          300: '#e9cc8a',
          400: '#dfb05c',
          500: '#d5963b',
          600: '#c17e2f',
          700: '#a16328',
          800: '#834f26',
          900: '#6c4122',
          950: '#3e2210',
        },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
