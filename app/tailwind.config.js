/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e8edff',
          200: '#cfd9ff',
          300: '#a9baff',
          400: '#7f96ff',
          500: '#5b74ff',
          600: '#3f56f5',
          700: '#2f40d2',
          800: '#2836a6',
          900: '#222e83',
        },
      },
    },
  },
  plugins: [],
}
