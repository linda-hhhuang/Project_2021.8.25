module.exports = {
  prefix: '',
  purge: {
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        antd: {
          DEFAULT: '#337951',
        }
      },
      spacing: {
        '120': '30rem',
        '180': '60rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
