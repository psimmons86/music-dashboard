/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#6c0957',
          700: '#4a0442'
        }
      }
    },
  },
  plugins: [],
}