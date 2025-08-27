/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'sprout-grow': 'sproutGrow 1.5s ease-out',
        'leaf-wiggle': 'leafWiggle 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'button-pulse': 'buttonPulse 2s infinite',
        'float-up': 'floatUp 15s linear infinite',
        'button-bounce': 'buttonBounce 0.6s ease-in-out',
        'celebration': 'celebration 0.6s ease-in-out',
        'plant-breathe': 'plantBreathe 10s ease-in-out infinite',
      },
      backgroundSize: {
        '400%': '400% 400%',
      }
    },
  },
  plugins: [],
}
