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
          DEFAULT: '#1890ff'
        }
      },
      spacing: {
        '120': '30rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
