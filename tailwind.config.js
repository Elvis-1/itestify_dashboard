/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors:{
        primary : "#9966CC",
        red: "#E53935",
        "off-white" : "#F5F5F5",
        "near-white": "#bfbfbf",
        "near-black" : "#171717",
        black: "#000000",
        "off-black" : "#313131",
        lightBlack :"#1E1E1E"
      }
    },
  },
  plugins: [],
}