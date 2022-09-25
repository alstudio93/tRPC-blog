/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'hero-h1': 'clamp(2rem, 7vw, 4rem)',
        'section-h2': 'clamp(2.2rem, 5vw, 4rem)',
        'contact-h3': 'clamp(1.6rem, 5vw, 3rem)',
        'contact-h4': 'clamp(1.1rem, 3vw, 1.6rem)'
      },
    },
  },
  plugins: [],
};
