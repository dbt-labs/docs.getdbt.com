/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//  usePrism: ['yaml', 'sql', 'markdown', 'shell-session'],
//
//  // Add custom scripts here that would be placed in <script> tags.
//  scripts: [
//      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
//      'https://buttons.github.io/buttons.js',
//      'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
//      'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.js',
//      '/js/code-block-buttons.js',
//  ],
//  stylesheets: [
//      '/css/code-block-buttons.css',
//      'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.css',
//  ],


module.exports = {
  baseUrl: '/',
  favicon: '/src/img/favicon.ico',
  tagline: 'Your entire analytics engineering workflow',
  title: 'dbt - Documentation',
  url: 'https://docs.getdbt.com',

  themeConfig: {
    docsSideNavCollapsible: true,
    disableDarkMode: true,
    image: 'src/img/dbt-logo-full-white.png',
    prism: {
      theme: require('prism-react-renderer/themes/atom-dark'),
    },
    navbar: {
      logo: {
        src: '/src/img/dbt-logo-full-white.png',
        alt: 'dbt Logo',
      },
      links: [
        {
          href: "https://docs.getdbt.com",
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/setting-up',
          label: 'Tutorial',
          position: 'left',
        },
      ],
    },
    footer: {
      logo: {
        alt: 'dbt Logo',
        src: '/src/img/dbt-logo-full-white.png',
        href: 'https://www.getdbt.com/',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Fishtown Analytics, Inc.`,
    },
    image: 'img/oss_logo.png',
    sidebarCollapsible: false,
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // docs folder path relative to website dir.
          path: 'docs/',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.json'),
        },
      },
    ],
  ],
};
