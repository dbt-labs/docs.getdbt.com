const sourdoughTheme = require('@dbt-labs/sourdough/tailwind.config');
const dagTheme = require('@dbt-labs/react-dbt-dag/tailwind.config');

module.exports = {
  presets: [dagTheme, sourdoughTheme],
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './node_modules/@dbt-labs/sourdough/dist/sourdough.js',
    './node_modules/@dbt-labs/react-dbt-dag/dist/react-dbt-dag.es.js',
  ],
};
