/** @type {import('tailwindcss').Config} */ 
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'Base': '#141a22',
        'BaseDark': '#10151c',
        'BaseLight': '#2d3544'
      },
      fontFamily: {
        'AzeretMono': 'Azeret Mono'
      }
    },
  },
  plugins: [],
}

