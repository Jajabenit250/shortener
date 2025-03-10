/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#fff",
        foreground: "#051638",
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
        aliceblue: "#e6f3ff",
        backblue: "#051638",
        foreblue: "#F3F3F3",
        gray: {
          "100": "#939393",
          "200": "#051638",
          "300": "rgba(16, 16, 16, 0.8)",
          "400": "rgba(29, 29, 29, 0.4)",
          "500": "rgba(16, 16, 16, 0.96)",
          "600": "rgba(0, 0, 0, 0.7)",
        },
        black: "#000",
        white: "#fff",
        whiteish: "#fff",
        darkslateblue: {
          "100": "#0054a7",
          "200": "rgba(0, 84, 167, 0.96)",
          "300": "#162e5d",
          "400": "#162e5c",
        },
        lavender: {
          "100": "#e9f0ff",
          "200": "#deefff",
        },
        cornflowerblue: "#267acc",
        cornflowerblueish: "#162E5C",
        gainsboro: "#dedede",
        lightgreenish: "#E8F6E7",
        silver: "#c9c9c9",
        darkgray: "#b1b1b1",
        darkslategray: "#373737",
        lightblue: "#c4d6e6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xs": "10px",
        "21xl": "40px",
        "10xs": "3px",
        "mini-4": "14.4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      spacing: {},
      fontFamily: {
        nunito: "Nunito",
      },
      fontSize: {
        lgi: "19px",
        base: "16px",
        xl: "20px",
        sm: "14px",
        xs: "12px",
        xxs: "7px",
        mid: "17px",
        "13xl": "32px",
        "7xl": "26px",
        inherit: "inherit",
      },
      screens: {
        "2xl": "1500px",
        mq1125: {
          raw: "screen and (max-width: 1125px)",
        },
        mq1050: {
          raw: "screen and (max-width: 1050px)",
        },
        mq750: {
          raw: "screen and (max-width: 750px)",
        },
        mq450: {
          raw: "screen and (max-width: 450px)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require('@tailwindcss/forms'),],
};
