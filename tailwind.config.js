/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          50: '#FFF4E6',
          100: '#FFE4BF',
          200: '#FFC97A',
          300: '#FFAD35',
          400: '#FF9500',
          500: '#FF6B00',
          600: '#E55A00',
          700: '#CC4A00',
          800: '#993800',
          900: '#662500',
        },
      },
    },
  },
  plugins: [],
}
