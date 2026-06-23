/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mgsa: {
          accent: "#22C55E", // Primary Accent (Mint Green)
          accentDark: "#16A34A", // Darker Mint for hover
          darkText: "#1E293B", // Dark Text (Neutral Slate)
          subtleText: "#64748B", // Subtle Text (Gray Blue)
          bgWhite: "#FFFFFF", // Light Background White
          bgSubtle: "#F0FDF4", // Soft Section Background (Pale Mint)
          accentYellow: "#FACC15", // Optional Accent Yellow
          border: "#E2E8F0", // Subtle card borders
          badgeBg: "#DCFCE7", // Green badge bg
          badgeText: "#166534", // Green badge text
        },
      },
    },
  },
  plugins: [],
};
