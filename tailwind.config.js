/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        'csdai-navy': '#0A1628',
        'csdai-sky': '#0EA5E9',
        'csdai-amber': '#F59E0B',
        'csdai-emerald': '#10B981',
      },
    },
  },
  plugins: [],
};
