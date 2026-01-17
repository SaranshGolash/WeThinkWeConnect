/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#3b82f6',
          
          // Feature Specific Colors
          'fog': '#a5b4fc',       // Unfinished (Lavender/Blue)
          'echo-a': '#2dd4bf',    // Echo User A (Teal)
          'echo-b': '#fb7185',    // Echo User B (Rose)
          'conflict': '#f59e0b',  // Middle Ground (Amber)
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          serif: ['Merriweather', 'serif'], // For the "Deep Thoughts" text
        }
      },
    },
    plugins: [],
  }