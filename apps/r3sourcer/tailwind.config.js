const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      primary: {
        200: '#eef6ff',
        300: '#d3deea',
        DEFAULT: '#2196f3',
      },
      gray: {
        300: '#7a7a7a',
        DEFAULT: '#333333',
      },
      yellow: '#F58926',
      white: '#ffffff'
    },
    extend: {},
  },
  plugins: [],
};
