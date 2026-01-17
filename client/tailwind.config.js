// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // The Void (Backgrounds)
          background: '#050505', // True Black
          surface: '#0A0A0A',    // Off-Black
          'surface-highlight': '#121212',
  
          // The Neons (Accents)
          primary: '#6366f1',    // Indigo (Unfinished)
          secondary: '#ec4899',  // Pink (Echo)
          accent: '#f59e0b',     // Amber (Conflict)
          
          // Text
          'text-main': '#EDEDED',
          'text-muted': '#A1A1AA',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          display: ['Space Grotesk', 'Inter', 'sans-serif'],
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a2a2a 0deg, #050505 180deg, #2a2a2a 360deg)',
        },
        boxShadow: {
          'neon': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
          'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        },
keyframes: {
    'fade-in-down': {
      '0%': { opacity: '0', transform: 'translateY(-10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
  },
  animation: {
    'fade-in-down': 'fade-in-down 0.2s ease-out',
  }
      },
    },
    plugins: [],
  }