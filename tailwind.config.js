/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6c0957",
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#6c0957",
        background: "#ffffff",
        foreground: "#0f172a",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a"
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b"
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      }
    },
  },
  plugins: [],
};