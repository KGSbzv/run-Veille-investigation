/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#0D3A61',
        'brand-lightblue': '#1D5A8C',
        'brand-accent': '#6AC4F8',
        'dark-bg': '#0a192f',
        'dark-card': '#112240',
        'dark-text': '#ccd6f6',
        'dark-text-secondary': '#8892b0',
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
        },
      },
      animation: {
          'fade-in': 'fade-in 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}