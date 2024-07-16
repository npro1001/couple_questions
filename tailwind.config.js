
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // theme: {
  //   extend: {
  //     backgroundImage: {
  //       "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
  //       "gradient-conic":
  //         "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
  //     },
  //   },
  // },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        night: {
          "color-scheme": "dark",
          "primary": "#38bdf8",
          "secondary": "#818CF8",
          "accent": "#F471B5",
          "neutral": "#1E293B",
          "base-100": "#0F172A",
          "info": "#0CA5E9",
          "info-content": "#000000",
          "success": "#2DD4BF",
          "warning": "#F4BF50",
          "error": "#FB7085",
        },
      }
    ],
  },
};
