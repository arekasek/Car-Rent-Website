/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        ford: "url('/img/mustang.png')",
      },
      fontFamily: {
        sans: ["Exo", "sans-serif"],
        vibes: ["Great Vibes", "serif"],
      },
      spacing: {
        "calc-50%-20px": "calc(50% - 20px)",
        "calc-50%-100px": "calc(50% - 100px)",
        "calc-50%-80px": "calc(50% - 80px)",
        "calc-50%-60px": "calc(50% - 60px)",
        "calc-50%-40px": "calc(50% - 40px)",
        "calc-50%-20px": "calc(50% - 20px)",
      },
    },
  },
  plugins: [],
};
