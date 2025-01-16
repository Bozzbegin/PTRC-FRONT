/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      transitionDuration: {
        600: '600ms'
      },
      fontFamily: {
        kanit: ['"Kanit"', 'sans-serif'], // ฟอนต์ Kanit
        bai: ['"Bai Jamjuree"', 'sans-serif'], // ฟอนต์ Bai Jamjuree
        sarabun: ['"Sarabun"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}