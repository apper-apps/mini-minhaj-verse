/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3f7',
          100: '#b3dde6',
          200: '#80c7d5',
          300: '#4db1c4',
          400: '#4A90A4',
          500: '#3a6f82',
          600: '#2a4e61',
          700: '#1a2d40',
          800: '#0a0c1e',
          900: '#000000'
        },
        secondary: {
          50: '#e8f5ea',
          100: '#bde5c1',
          200: '#92d598',
          300: '#67B26F',
          400: '#51a159',
          500: '#3b9043',
          600: '#2a7f2d',
          700: '#196e17',
          800: '#085d01',
          900: '#004c00'
        },
        accent: {
          50: '#fef6ec',
          100: '#fce4c4',
          200: '#f9d29c',
          300: '#F4A261',
          400: '#f19339',
          500: '#ee8411',
          600: '#d6750d',
          700: '#be6609',
          800: '#a65705',
          900: '#8e4801'
        },
        surface: '#FEFEFE',
        background: '#F0F4F8'
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px'
      }
    },
  },
  plugins: [],
}