
const path = require('path');

module.exports = {
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  tagline: 'Your entire analytics engineering workflow',
  title: 'dbt - Documentation',
  url: 'https://docs.getdbt.com',

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
      theme: (() => {
          var theme = require('prism-react-renderer/themes/nightOwl');
          // Add additional rule to nightowl theme in order to change
          // the color of YAML keys (to be different than values).
          // There weren't many Prism themes that differentiated
          // YAML keys and values. See link:
          // https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes
          theme.styles.push({
              types: ["atrule"],
              style: {
                  // color chosen from the nightowl theme palette
                  // https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/themes/nightOwl.js#L83
                  color: "rgb(255, 203, 139)"
              }
          });
          return theme
      })(),
      additionalLanguages: ['bash'],
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
          activeBaseRegex: 'docs\/(?!(dbt-cloud))',
        },
        {
          to: '/reference/dbt_project.yml',
          label: 'Reference',
          position: 'left',
          activeBasePath: 'reference'
        },
        {
          to: '/dbt-cli/cli-overview',
          label: 'dbt CLI',
          position: 'left',
          activeBasePath: 'dbt-cli'
        },
        {
          to: '/docs/dbt-cloud/cloud-overview',
          label: 'dbt Cloud',
          position: 'left',
          activeBasePath: 'docs/dbt-cloud'
        },
        {
          to: '/tutorial/setting-up',
          label: 'Tutorial',
          position: 'left',
          activeBasePath: 'tutorial'
        },
        {
          to: '/faqs/all',
          label: 'FAQs',
          position: 'left',
          activeBasePath: 'faqs'
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
    '/css/entypo.css',
    '/css/search.css',
    '/css/api.css',
    'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.css',
  ]
};
