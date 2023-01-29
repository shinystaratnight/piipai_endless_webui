const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      primary: '#2196F3',
      'primary-light': '#D3DEEA',

      yellow: '#F58926',
    },
    extend: {},
  },
  plugins: [],
};
