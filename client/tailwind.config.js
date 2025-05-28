/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFBD35',     // Yellow
        secondary: '#3FA796',   // Teal
        accent: '#8267BE',      // Purple
        dark: '#502064'         // Deep Purple
      }
    },
  },
  plugins: [],
}