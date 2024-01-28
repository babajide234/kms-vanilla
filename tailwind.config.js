/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./img/.{jpg,png,svg,gif}"],
  theme: {
    extend: {
      colors: {
        primary: "#991313",
        bgsecond: "#f1efef",
        text: "#3a3737",
        textsub: "#9a9898",
        border: "#c2bdbd",
        hemp: "#8a7474",
        accent1: "#c39494",
        accent2: "#cdacac",
        sirocco: "#6c7474",
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
};
