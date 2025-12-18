/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",   // ⭐ REQUIRED FOR DARK MODE
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        elegant: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#047857",
        secondary: "#10B981",
        accent: "#F59E0B",
        darkText: "#1F2937",
        lightText: "#6B7280",
      },
    },
  },
  plugins: [],
};
