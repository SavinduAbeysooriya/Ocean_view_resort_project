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
          50: '#f7f6f2',
          100: '#efede5',
          200: '#dfdacb',
          300: '#cfc7b1',
          400: '#bfb497',
          500: '#af9f7d', // Golden Sand
          600: '#9b8864',
          700: '#7c6d50',
          800: '#5e523c',
          900: '#3f3728',
        },
        luxury: {
          gold: '#D4AF37',
          dark: '#0A0A0A',
          charcoal: '#1A1A1A',
          cream: '#F9F8F4',
        }
      },
      fontFamily: {
        serif: ['Crimson Text', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
