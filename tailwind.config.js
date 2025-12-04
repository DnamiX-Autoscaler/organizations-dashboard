/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable dark mode support
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#84006A",
        secondary: "#FFFFFF",
        accent: "#000000",
        backgroundLight: "#FAFAFA",
        backgroundDark: "#F5F5F5",
        textLight: "#333333",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
