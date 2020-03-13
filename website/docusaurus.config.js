
const path = require('path');

module.exports = {
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  tagline: 'Your entire analytics engineering workflow',
  title: 'dbt - Documentation',
  url: 'https://tutorial.getdbt.com',

  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: true,
    image: '/img/avatar.png',

    algolia: {
      apiKey: '0e9665cbb272719dddc6e7113b4131a5',
      //debug: true,
      indexName: 'dbt',
      algoliaOptions: {
      },
    },

    prism: {
      theme: require('prism-react-renderer/themes/nightOwl'),
    },
    navbar: {
      logo: {
        src: '/img/dbt-logo-full-white.png',
        alt: 'dbt Logo',
      },
      links: [
        {
          to: '/docs/introduction',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/reference/dbt_project.yml',
          label: 'Reference',
          position: 'left',
        },
        {
          to: '/tutorial/setting-up',
          label: 'Tutorial',
          position: 'left',
        },
        {
          to: '/faqs/all',
          label: 'FAQs',
          position: 'left',
        },
        {
          href: 'https://blog.getdbt.com',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://github.com/fishtown-analytics/dbt',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Fishtown Analytics, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),

          editUrl: 'https://github.com/fishtown-analytics/docs.getdbt.com/edit/master/website/',
          showLastUpdateTime: false,
          //showLastUpdateAuthor: false,
        }
      },
    ],
  ],
  plugins: [
    path.resolve('plugins/svg'),
  ],
  scripts: [
    'https://code.jquery.com/jquery-3.4.1.min.js',
    'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.js',
    '/js/gtm.js',
  ],
  stylesheets: [
    '/css/fonts.css',
    '/css/search.css',
    '/css/api.css',
    'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.css',
  ]
};
