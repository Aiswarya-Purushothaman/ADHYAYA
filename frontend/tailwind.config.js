/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dropIn: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        dropIn: 'dropIn 0.9s ease-out forwards',
      },
      fontFamily: {
        custom: ['Aclonica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

