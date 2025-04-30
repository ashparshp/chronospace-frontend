/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        secondary: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },
        accent: {
          DEFAULT: "#06B6D4",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
          950: "#083344",
        },
        background: {
          light: "#F9FAFB",
          dark: "#0D1117",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0D1117",
        },
        text: {
          light: "#111827",
          dark: "#F8FAFC",
        },
        // Add violet colors for our gradient
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Gelasio", "ui-serif", "Georgia", "serif"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        // Add new font families
        playfair: ['"Playfair Display"', "serif"],
        montserrat: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        custom: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
        "custom-lg": "0 10px 25px 0 rgba(0, 0, 0, 0.1)",
        "custom-glow": "0 0 15px rgba(79, 70, 229, 0.3)",
        "custom-glow-green": "0 0 15px rgba(16, 185, 129, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        float: "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-out": "fadeOut 0.5s ease-out",
        // Add new animation for expanding underline
        "expand-width": "expandWidth 1s ease-in-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        // Add new keyframe for expanding underline
        expandWidth: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(to right, #4F46E5, #06B6D4)",
        "gradient-secondary": "linear-gradient(to right, #06B6D4, #10B981)",
        "gradient-violet-indigo": "linear-gradient(to right, #8b5cf6, #6366f1)",
      },
    },
  },
  plugins: [],
};
