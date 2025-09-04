module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#8ab4f8",
          DEFAULT: "#1a73e8",
          dark: "#174ea6"
        },
        secondary: {
          light: "#f8bbd0",
          DEFAULT: "#e91e63",
          dark: "#880e4f"
        },
        background: {
          DEFAULT: "#f8f9fa",
          paper: "#ffffff",
        },
        text: {
          primary: "#202124",
          secondary: "#5f6368",
        }
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
      borderRadius: {
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.1)',
        'md': '0 2px 4px rgba(0,0,0,0.1)',
        'lg': '0 4px 6px rgba(0,0,0,0.15)',
        'xl': '0 8px 12px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}