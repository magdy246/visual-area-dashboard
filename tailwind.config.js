import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#f5f5dc",
        woodBrown: "#8b4513",
        lightWood: "#deb887",
        darkWood: "#84461f",
        warmGradientFrom: "#b5651d",
        warmGradientTo: "#feb47b",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        'gradient-wood': 'linear-gradient(90deg, #deb887, #8b4513)',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#f5f5dc", // Beige
            foreground: "#8b4513", // Wood brown
            primary: {
              50: "#fdf8f1",
              100: "#f9eadb",
              200: "#f2d5b5",
              300: "#ebc08f",
              400: "#e4ab69",
              500: "#deb887", // Light wood
              600: "#c9a06c",
              700: "#b5651d",
              800: "#8b4513", // Wood brown
              900: "#84461f", // Dark wood
              DEFAULT: "#8b4513",
              foreground: "#ffffff"
            },
          }
        },
        dark: {
          colors: {
            background: "#121212",
            foreground: "#f5f5dc", // Beige
            primary: {
              50: "#84461f", // Dark wood
              100: "#8b4513", // Wood brown
              200: "#a0522d",
              300: "#b5651d",
              400: "#c9a06c",
              500: "#deb887", // Light wood
              600: "#e4ab69",
              700: "#ebc08f",
              800: "#f2d5b5",
              900: "#f9eadb",
              DEFAULT: "#deb887",
              foreground: "#121212"
            },
          }
        }
      }
    })
  ],
};
