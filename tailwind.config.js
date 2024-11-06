/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.html",
    "./src/app/**/*.component.ts"
  ],
  theme: {
    extend: {
      colors:{
        primary:"#212529",
        secondary:"#F8F9FA",
        accent:"#007BFF"
      }
    },
  },
  plugins: [],
}

