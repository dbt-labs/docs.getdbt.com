
module.exports = {
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  tagline: 'Your entire analytics engineering workflow',
  title: 'dbt - Documentation',
  url: 'https://docs.getdbt.com',

  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: true,
    image: '/img/dbt-logo-full-white.png',
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
          to: '/docs/tutorial/setting-up',
          label: 'Tutorial',
          position: 'left',
        },
        {
          to: '/docs/tutorial/faqs/all',
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
      style: 'dark',
      logo: {
        alt: 'dbt Logo',
        src: '/img/dbt-logo-full-white.png',
        href: 'https://www.getdbt.com/',
      },
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
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),

          editUrl: 'https://github.com/fishtown-analytics/docs.getdbt.com/edit/master/website/',
          showLastUpdateTime: false,
          //showLastUpdateAuthor: false,
        }
      },
    ],
  ],
  scripts: [
    'https://code.jquery.com/jquery-3.4.1.min.js',
    'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.js',
  ],
  stylesheets: [
    '/src/css/fonts.css',
    'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.css',
  ]
};
