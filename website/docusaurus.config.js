
const path = require('path');

/* Debugging */
var SITE_URL;
if (!process.env.CONTEXT || process.env.CONTEXT == 'production') {
    SITE_URL = 'https://docs.getdbt.com';
} else {
    SITE_URL = process.env.DEPLOY_URL;
}

var GIT_BRANCH;
if (!process.env.CONTEXT || process.env.CONTEXT == 'production') {
    GIT_BRANCH = 'current';
} else {
    GIT_BRANCH = process.env.HEAD;
}

var PRERELEASE = (process.env.PRERELEASE || false);

var WARNING_BANNER;
if (!PRERELEASE) {
    WARNING_BANNER = {};
} else {
    WARNING_BANNER = {
        id: 'prerelease', // Any value that will identify this message.
        content:
          'CAUTION: Prerelease! This documentation reflects the next minor version of dbt. <a href="https://docs.getdbt.com">View current docs</a>.',
        backgroundColor: '#ffa376', // Defaults to `#fff`.
        textColor: '#033744', // Defaults to `#000`.
    }
}

var ALGOLIA_API_KEY;
if (!process.env.ALGOLIA_API_KEY) {
    ALGOLIA_API_KEY = '0e9665cbb272719dddc6e7113b4131a5';
} else {
    ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
}

var ALGOLIA_INDEX_NAME;
if (!process.env.ALGOLIA_INDEX_NAME) {
    ALGOLIA_INDEX_NAME = 'dbt';
} else {
    ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;
}

console.log("DEBUG: CONTEXT =", process.env.CONTEXT);
console.log("DEBUG: DEPLOY_URL =", process.env.DEPLOY_URL);
console.log("DEBUG: SITE_URL = ", SITE_URL);
console.log("DEBUG: PRERELEASE = ", PRERELEASE);
console.log("DEBUG: ALGOLIA_INDEX_NAME = ", ALGOLIA_INDEX_NAME);


module.exports = {
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  tagline: 'Your entire analytics engineering workflow',
  title: 'docs.getdbt.com',
  url: SITE_URL,

  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: true,
    image: '/img/avatar.png',

    announcementBar: WARNING_BANNER,

    algolia: {
      apiKey: ALGOLIA_API_KEY,
      //debug: true,
      indexName: ALGOLIA_INDEX_NAME,
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

          editUrl: 'https://github.com/fishtown-analytics/docs.getdbt.com/edit/' + GIT_BRANCH + '/website/',
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
