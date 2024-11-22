/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar'),
  ],
  daisyui: {
    themes: [{
      mytheme : {
        "primary" : "#E3881A",
        "secondary" : "42b72a",
        "accent" : "#37cdbe",
        "neutral" : "#F6F5FA",
        "base-100" : "#ffffff"
      }
    }],
  },
}