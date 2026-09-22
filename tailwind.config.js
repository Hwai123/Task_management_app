/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, .05), 0 8px 24px rgba(15, 23, 42, .06)',
        dialog: '0 28px 80px rgba(15, 23, 42, .3)',
      },
    },
  },
  plugins: [],
}

