import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d8ecfe',
          200: '#b9dffe',
          300: '#89ccfd',
          400: '#52b0fc',
          500: '#0066b2', // Primary Al Fayasel Ocean Blue
          600: '#005294',
          700: '#004278',
          800: '#003763',
          900: '#062f53',
          dark: '#002542',
        },
        woodmart: {
          bg: '#f8f9fa',
          border: '#e1e8ed',
          text: '#242424',
          lightText: '#777777',
          accent: '#0066b2',
          badgeNew: '#0066b2',
          badgeHot: '#e74c3c',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'woodmart': '0 0 20px rgba(0,0,0,0.08)',
        'hover-card': '0 10px 25px -5px rgba(0, 102, 178, 0.15)',
      }
    },
  },
  plugins: [],
};
export default config;
