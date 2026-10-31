/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#FDFBF7',
          100: '#FBF7ED',
          200: '#F6EED8',
          300: '#EFE1BF',
          400: '#E5D1A0',
          500: '#D4B876', // Primary luxury champagne-gold
          600: '#BA9950',
          700: '#947535',
          800: '#6E5523',
          900: '#4A3715',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8D0D8',
          300: '#F1A9B7',
          400: '#E4758D',
          500: '#9B1D34',
          600: '#801428', // Deep royal burgundy
          700: '#6B1021',
          800: '#530C19',
          900: '#3D0711',
          950: '#26040A',
        },
        ivory: {
          DEFAULT: '#FCFBF7',
          50: '#FFFFFF',
          100: '#FAF8F2',
          200: '#F4EFE3',
          300: '#EBE2CD',
          400: '#DFD2B2',
          500: '#D0BF96',
        },
        royal: {
          900: '#0F0E26',
          950: '#090818',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

