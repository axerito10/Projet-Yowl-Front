export const content = [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
];
export const theme = {
  extend: {
    transitionDuration: {
      '300': '300ms',
      '30': '30ms',
      '3000': '3000ms'
    },
    colors: {
      'custom-orange': 'rgb(255, 119, 1)',
      'custom-blue': 'rgb(0, 7, 69)',
      'custom-hoverorange': 'rgb(234, 88, 12)',
    },
    fontFamily: {
      'Avenir': ['Avenir', 'sans-serif'],
    },
  },
};
export const plugins = [];
