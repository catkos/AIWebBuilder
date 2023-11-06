/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        '20': '20px 20px',
      },
      backgroundImage: {
        'gridBg': 'linear-gradient(to right, rgba(201, 201, 201, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 201, 201, 0.5) 1px, transparent 1px);',
      }
    },
  },
  plugins: [],
}