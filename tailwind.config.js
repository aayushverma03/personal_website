/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/ai-projects/verity-ehs/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/ehs/**/*.{js,ts,jsx,tsx,mdx}',
    './app/lib/ehs-*.{js,ts}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
