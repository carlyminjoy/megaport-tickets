module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#6500d1",
        },
        red: {
          DEFAULT: "#ff0000",
        },
        white: {
          DEFAULT: "#F8F9FA",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  pink: {
    light: "#ff7ce5",
    DEFAULT: "#ff49db",
    dark: "#ff16d1",
  },
};
