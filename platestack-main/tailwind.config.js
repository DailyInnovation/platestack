/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a1f2e',
          950: '#0a0e17',
        },
        neon: {
          green: '#00ff88',
          cyan: '#00f0ff',
          greenDark: '#00cc6a',
          cyanDark: '#00c0cc',
        },
        plate: {
          red: '#e74c3c',
          blue: '#3498db',
          yellow: '#f1c40f',
          green: '#2ecc71',
          white: '#ecf0f1',
          black: '#2c3e50',
          silver: '#95a5a6',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 255, 136, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-neon': 'pulseNeon 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 136, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
