/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors with better contrast
        primary: {
          DEFAULT: '#2563eb',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          DEFAULT: '#1e293b',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          DEFAULT: '#f59e0b',
          50: '#fef9c3',
          100: '#fef08a',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Text colors with better contrast
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          muted: '#94a3b8',
          white: '#ffffff',
          black: '#000000',
        },
        // Background colors with better contrast
        bg: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          muted: '#f1f5f9',
          dark: '#1e293b',
          darker: '#0f172a',
        },
        // Button colors
        button: {
          primary: {
            bg: '#2563eb',
            text: '#ffffff',
            hover: '#1d4ed8',
            focus: '#1d4ed8',
            active: '#1e4080',
          },
          secondary: {
            bg: '#1e293b',
            text: '#ffffff',
            hover: '#334155',
            focus: '#334155',
            active: '#0f172a',
          },
          outline: {
            border: '#2563eb',
            text: '#2563eb',
            hover: '#1d4ed8',
            focus: '#1d4ed8',
            active: '#1e4080',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}