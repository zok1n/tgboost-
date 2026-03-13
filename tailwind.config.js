/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
      },
      colors: {
        telegram: '#2AABEE',
        'telegram-hover': '#229ED9',
        purple: '#8B5CF6',
        'purple-dark': '#1A0A2E',
        dark: {
          900: '#0A0A1A',
          800: '#1A0A2E',
          700: 'rgba(255,255,255,0.05)',
          600: 'rgba(255,255,255,0.1)',
          500: 'rgba(255,255,255,0.15)',
        },
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(135deg, #0A0A1A 0%, #1A0A2E 50%, #0f0a1a 100%)',
        'btn-gradient': 'linear-gradient(135deg, #2AABEE 0%, #8B5CF6 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(42, 171, 238, 0.4)',
        'glow-lg': '0 0 40px rgba(42, 171, 238, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
