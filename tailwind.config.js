/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          800: '#1e2435',
          900: '#141927',
          950: '#0d1117',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)',
        'gradient-dark':  'linear-gradient(180deg, #141927 0%, #0d1117 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(124,58,237,0.04) 100%)',
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-green': '0 0 16px rgba(34, 197, 94, 0.25)',
        'card':       '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-dot':   'pulseDot 2s ease-in-out infinite',
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.35s ease-out',
        'spin-slow':   'spin 3s linear infinite',
        'count-up':    'fadeIn 0.5s ease-out',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}