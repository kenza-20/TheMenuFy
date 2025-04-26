import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customYellow: 'rgb(244, 127, 115)', // Déclaration de ta couleur exacte ici
      },
    },
  },
  plugins: [],
} satisfies Config;
