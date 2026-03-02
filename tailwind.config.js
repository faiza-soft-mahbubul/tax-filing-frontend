/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Raleway', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#00BABA',
          light: '#00D8D8',
          50: '#f0fafa',
          100: '#e8f9f9',
          200: '#d1f0f0',
        },
      },
    },
  },
  plugins: [],
}
