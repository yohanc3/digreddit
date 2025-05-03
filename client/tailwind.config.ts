import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
      borderColor: {
        light: "#EAECF0"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryColor: {
          DEFAULT: "#576F72",
        },
        secondaryColor: {
          DEFAULT: "#344054"
        },
        tertiaryColor:{
          DEFAULT: "#475467"
        }
      },
      fontSize: {
        primarySize: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],  
        mediumSize: ['1.6875rem', { lineHeight: '2.25rem', fontWeight: '500' }],
        secondarySize: ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }], 
        tertiarySize: ['0.625rem', { lineHeight: '0.875rem', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
export default config;
