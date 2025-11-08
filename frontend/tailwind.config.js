/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#6366f1",
        "brand-secondary": "#a855f7",
        "brand-dark": "#0f172a"
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.15)"
      }
    }
  },
  plugins: []
};
