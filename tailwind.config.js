/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'elfag-green': '#173300',
        'elfag-light': '#C8FC3C',
      },
    },
  },
  plugins: [],
} 