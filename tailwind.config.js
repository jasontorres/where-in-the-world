/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Orbitron"', 'sans-serif'],
        'retro': ['"Press Start 2P"', 'cursive'],
        'vt323': ['"VT323"', 'monospace'],
        'orbitron': ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
