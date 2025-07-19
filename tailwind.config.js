/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx}',
    './src/renderer/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color system for the app
        'te-bg': '#1a1a1a',
        'te-surface': '#2a2a2a',
        'te-text': '#ffffff',
        'te-muted': '#888888',
        'te-border': '#404040',
        'te-hover': '#333333',
        'te-input': '#2a2a2a',
        'te-orange': '#ff6b35',
        'te-orange-dark': '#e55a2b',
        'te-green': '#4caf50',
        'te-blue': '#2196f3',
        'te-purple': '#9c27b0',
        'te-red': '#f44336',
        'te-yellow': '#ffeb3b',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'neon-flicker': 'neon-flicker 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(0, 255, 255, 0.4)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'neon-flicker': {
          '0%, 100%': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { textShadow: '0 0 2px currentColor, 0 0 5px currentColor' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    }
  },
  darkMode: 'class',
} 