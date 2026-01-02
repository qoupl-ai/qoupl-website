import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-qoupl)", "system-ui", "sans-serif"],
        brand: ["var(--font-poppins)", "system-ui", "sans-serif"],
        caveat: ["var(--font-caveat)", "cursive"],
      },
      fontSize: {
        // Fluid typography with clamp for smooth responsive scaling
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.125vw, 0.875rem)', // 12px -> 14px
        'fluid-sm': 'clamp(0.875rem, 0.85rem + 0.125vw, 0.9375rem)', // 14px -> 15px
        'fluid-base': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', // 16px -> 18px
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', // 18px -> 20px
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', // 20px -> 24px
        'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)', // 24px -> 36px
        'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.75rem)', // 30px -> 44px
        'fluid-4xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)', // 32px -> 48px
        'fluid-5xl': 'clamp(2.5rem, 2rem + 2.5vw, 3.5rem)', // 40px -> 56px
        'fluid-6xl': 'clamp(3rem, 2rem + 5vw, 4rem)', // 48px -> 64px
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Typography colors
        title: {
          DEFAULT: "hsl(var(--title))",
        },
        paragraph: {
          DEFAULT: "hsl(var(--paragraph))",
        },
        'secondary-text': {
          DEFAULT: "hsl(var(--secondary-text))",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      maxWidth: {
        'prose': '65ch',
        'prose-wide': '75ch',
      },
      letterSpacing: {
        'functional': '0.01em', // For small functional text
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
