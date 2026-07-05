/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noir: '#0B0B0C',
        charcoal: '#121212',
        gold: '#D4AF37',
        'soft-gold': '#F2D27A',
        'hover-glow': '#FFD65A',
        ivory: '#F8F8F8',
        grey: '#B3B3B3',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Jost"', '"Helvetica Neue"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      backgroundImage: {
        'gold-fade': 'linear-gradient(180deg, #0B0B0C 0%, #121212 100%)',
        'gold-line': 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
      },
      boxShadow: {
        goldglow: '0 0 40px rgba(212,175,55,0.25)',
      },
    },
  },
  plugins: [],
}
