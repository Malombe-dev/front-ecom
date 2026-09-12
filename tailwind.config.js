/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#16213E",
          700: "#223258",
          600: "#2C3E70",
          100: "#E7EAF3",
        },
        accent: {
          600: "#CC8A2A",
          500: "#E8A33D",
          100: "#FBEACB",
        },
        success: { 600: "#1F7A5C", 100: "#DCF3EA" },
        danger: { 600: "#C1443C", 100: "#F8DEDC" },
        paper: "#FAFAF9",
        ink: { 900: "#1C1B1A", 500: "#6B6963", 300: "#A8A6A0" },
      },
      fontFamily: {
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
