/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      colors: {
        'bmw-blue': '#0066CC',
        'bmw-light': '#E3F2FD',
        'bmw-dark': '#1A1A1A',
        'bmw-gray': '#666666',
        'bmw-border': '#E0E0E0',
      },
      boxShadow: {
        'bmw': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'bmw-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
