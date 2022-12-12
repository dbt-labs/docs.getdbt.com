const dagTheme = require('@dbt-labs/react-dbt-dag/tailwind.config');

module.exports = {
  presets: [dagTheme],
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './public/index.html',
    './node_modules/@dbt-labs/react-dbt-dag/dist/react-dbt-dag.es.js',
  ],
};
