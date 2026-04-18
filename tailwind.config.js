/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D97706",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        secondary: {
          DEFAULT: "#F43F5E",
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
          950: "#4C0519",
        },
        accent: {
          DEFAULT: "#A78BFA",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },
        background: {
          light: "#FAFAF9",
          dark: "#0C0A09",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1C1917",
        },
        text: {
          light: "#1C1917",
          dark: "#F5F5F4",
        },
      },
      fontFamily: {
        sans: [
          "'Outfit'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        heading: [
          "'Space Grotesk'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ["'Libre Baskerville'", "ui-serif", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Outfit'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        custom: "0 4px 14px 0 rgba(0, 0, 0, 0.06)",
        "custom-lg": "0 10px 25px 0 rgba(0, 0, 0, 0.08)",
        "custom-glow": "0 0 20px rgba(217, 119, 6, 0.15)",
        "custom-glow-rose": "0 0 20px rgba(244, 63, 94, 0.15)",
        "custom-glow-accent": "0 0 20px rgba(167, 139, 250, 0.15)",
        "warm-sm": "0 1px 3px rgba(28, 25, 23, 0.06), 0 1px 2px rgba(28, 25, 23, 0.04)",
        "warm-md": "0 4px 6px rgba(28, 25, 23, 0.05), 0 2px 4px rgba(28, 25, 23, 0.04)",
        "warm-lg": "0 10px 15px rgba(28, 25, 23, 0.06), 0 4px 6px rgba(28, 25, 23, 0.04)",
        "warm-xl": "0 20px 25px rgba(28, 25, 23, 0.08), 0 8px 10px rgba(28, 25, 23, 0.04)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        float: "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-out": "fadeOut 0.5s ease-out",
        "expand-width": "expandWidth 1s ease-in-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
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
        expandWidth: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(217, 119, 6, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(217, 119, 6, 0.4)" },
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
        "gradient-primary": "linear-gradient(to right, #F59E0B, #D97706)",
        "gradient-secondary": "linear-gradient(to right, #F43F5E, #E11D48)",
        "gradient-warm": "linear-gradient(135deg, #F59E0B, #F43F5E)",
        "gradient-aurora": "linear-gradient(135deg, #D97706, #F43F5E, #A78BFA)",
      },
    },
  },
  plugins: [],
};
