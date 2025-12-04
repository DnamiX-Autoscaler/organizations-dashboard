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
        darkBackground: "#1A1A1A",
        darkBackgroundVery: "#0F0F0F",
        textLight: "#333333",
        // Dark mode colors
        dark: {
          primary: "#84006A",
          secondary: "#1F2937",
          background: "#111827",
          surface: "#1F2937",
          text: "#F9FAFB",
          darkBackground: "#1A1A1A",
          darkBackgroundVery: "#0F0F0F",
        }
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
