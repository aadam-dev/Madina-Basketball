/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',
        'primary-dark': '#e55a2b',
        secondary: '#004e89',
        accent: '#ffd23f',
        muted: '#f5f5f5',
        border: '#e5e5e5',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

