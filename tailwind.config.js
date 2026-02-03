/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        accent: {
          pink: 'var(--accent-pink)',
          purple: 'var(--accent-purple)',
          yellow: 'var(--accent-yellow)',
          green: 'var(--accent-green)',
          red: 'var(--accent-red)',
          blue: 'var(--accent-blue)',
          cyan: 'var(--accent-cyan)',
          gray: 'var(--text-muted)',
        },
        cyber: {
          bg: 'var(--bg-color)',
          card: 'var(--card-bg)',
          pink: 'var(--accent-pink)',
          purple: 'var(--accent-purple)',
          yellow: 'var(--accent-yellow)',
          green: 'var(--accent-green)',
          red: 'var(--accent-red)',
          cyan: 'var(--accent-cyan)',
          gray: 'var(--text-muted)',
          dark: '#0d0d10',
          panel: '#16161c',
        },
        rpg: {
          dark: '#0f0f13',
          panel: '#151520',
          border: '#2a2a35',
          pink: '#ff007f',
          purple: '#bd00ff',
          gold: '#ffd700',
          text: '#e0e0e0',
          muted: '#8a8a9b'
        },
        neon: {
          pink: '#d633ff',
          yellow: '#f2ff00',
          green: '#66fcf1',
          purple: '#9d4edd',
        }
      },
      boxShadow: {
        'neon-pink': '0 0 5px #ff0099, 0 0 10px #ff0099',
        'neon-purple': '0 0 5px #bd00ff, 0 0 10px #bd00ff',
        'neon-yellow': '0 0 5px #ffd700, 0 0 10px #ffd700',
        'neon-green': '0 0 5px #39ff14, 0 0 10px #39ff14',
        'neon-red': '0 0 5px #ff3131, 0 0 10px #ff3131',
        'neon-cyan': '0 0 5px #00f3ff, 0 0 10px #00f3ff',
        'glow-pink': '0 0 5px #d633ff, 0 0 10px #d633ff, inset 0 0 2px #d633ff',
        'glow-yellow': '0 0 5px #f2ff00, 0 0 10px #f2ff00, inset 0 0 2px #f2ff00',
      },
      backgroundImage: {
        'scanline': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        'radial-cyber': 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0b0b0f 90%)',
      }
    },
  },
  plugins: [],
}
