/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf4',
          100: '#d8f7e1',
          200: '#b0efc4',
          300: '#7fe0a0',
          400: '#4ccf78',
          500: '#26b35d',
          600: '#1d8f4b',
          700: '#1a723f',
          800: '#185a35',
          900: '#154a2d'
        }
      },
      boxShadow: {
        glow: '0 20px 80px rgba(38, 179, 93, 0.18)'
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
