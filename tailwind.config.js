/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary': '#050505',
        'bg-secondary': '#0D1117',
        'bg-elevated': '#161B22',

        // Terminal Green
        'green-primary': '#00FF88',
        'green-secondary': '#39FFB6',
        'green-dim': '#00994D',
        'green-faint': '#003320',

        // Cyan Accent
        'cyan-accent': '#00D1FF',
        'cyan-dim': '#006A82',

        // Status
        'yellow-warning': '#FFCC00',
        'yellow-dim': '#7A6100',
        'red-danger': '#FF4D4D',
        'red-dim': '#7A1F1F',

        // Borders
        'border-subtle': '#1F2937',
        'border-dim': '#0F1823',

        // Text
        'text-primary': '#00FF88',
        'text-secondary': '#FFFFFF',
        'text-muted': '#8B949E',
        'text-dim': '#3D4A5C',
      },
      fontFamily: {
        mono: ['JetBrainsMono', 'monospace'],
        display: ['SpaceMono', 'monospace'],
        code: ['IBMPlexMono', 'monospace'],
      },
      boxShadow: {
        'glow-green-sm': '0 0 6px rgba(0, 255, 136, 0.3)',
        'glow-green-md': '0 0 12px rgba(0, 255, 136, 0.4), 0 0 30px rgba(0, 255, 136, 0.15)',
        'glow-green-lg': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2)',
        'glow-cyan-md': '0 0 12px rgba(0, 209, 255, 0.4), 0 0 30px rgba(0, 209, 255, 0.15)',
        'glow-yellow-md': '0 0 10px rgba(255, 204, 0, 0.45)',
        'glow-red-md': '0 0 10px rgba(255, 77, 77, 0.45)',
      },
    },
  },
  plugins: [],
};
