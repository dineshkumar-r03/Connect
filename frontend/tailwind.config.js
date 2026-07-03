/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
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
        },
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        pink: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f7f8fd',
        },
        brand: {
          bg: '#f0f2f8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'brand-sm': '0 1px 3px rgba(99,102,241,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'brand-md': '0 4px 20px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'brand-lg': '0 8px 40px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        'glow':     '0 0 30px rgba(139,92,246,0.25)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        'gradient-pink':  'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
        'gradient-sky':   'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
        'gradient-amber': 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
        'gradient-green': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out both',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'float':      'float 4s ease-in-out infinite',
        'glow':       'glow 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'pulse-dot':  'pulse-dot 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'gradient':   'gradientShift 5s ease infinite',
        'orb-float':  'orbFloat 12s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(139,92,246,0.45)' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.4)', opacity: '0.7' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139,92,246,0.0), 0 0 20px rgba(139,92,246,0.15)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(139,92,246,0.06), 0 0 40px rgba(139,92,246,0.3)' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        orbFloat: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -25px) scale(1.04)' },
          '66%':  { transform: 'translate(-20px, 15px) scale(0.97)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}