/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: "200ms",
      },
      colors: {
        dark: {
          input: "#1f2937",
          text: "#f3f4f6",
        },
        light: {
          input: "#ffffff",
          text: "#111827",
        },
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      touchAction: {
        none: "none",
        manipulation: "manipulation",
      },
    },
    fontFamily: {
      sans: ["Atkinson Hyperlegible", "sans-serif"],
      mono: ["Geist Mono", "monospace"],
    },
  },
  variants: {
    extend: {
      backgroundColor: ["hover"],
      opacity: ["hover", "group-hover"],
      touchAction: ["responsive"],
      userSelect: ["responsive"],
      scrollSnapType: ["responsive"],
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
