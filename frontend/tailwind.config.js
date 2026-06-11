/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F28C33',
        'brand-text': '#1A2026',
        'brand-accent': '#FFC857',
        'brand-secondary': '#2B5869',
        'brand-anchor': '#143D4D',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}