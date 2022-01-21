const path = require('path');
require('dotenv').config()

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

let { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

let metatags = []
// If Not Current Branch, do not index site
if(GIT_BRANCH !== 'current') {
  metatags.push({
    tagName: 'meta',
    attributes: {
      name: 'robots',
      content: 'noindex'
    }
  })
}

const versions = require('./dbt-versions.json');
const lastReleasedVersion = versions[0];

console.log("DEBUG: CONTEXT =", process.env.CONTEXT);
console.log("DEBUG: DEPLOY_URL =", process.env.DEPLOY_URL);
console.log("DEBUG: SITE_URL = ", SITE_URL);
console.log("DEBUG: PRERELEASE = ", PRERELEASE);
console.log("DEBUG: ALGOLIA_INDEX_NAME = ", ALGOLIA_INDEX_NAME);
console.log("DEBUG: metatags = ", metatags);

var siteSettings = {
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  tagline: 'End user documentation, guides and technical reference for dbt (data build tool)',
  title: 'dbt Docs',
  url: SITE_URL,
  onBrokenLinks: 'warn',

  themeConfig: {
    image: '/img/avatar.png',
    colorMode: {
      disableSwitch: true
    },
    // Adding non-empty strings for Algolia config 
    // allows Docusaurus to run locally without .env file 
    algolia: {
      apiKey: ALGOLIA_API_KEY ? ALGOLIA_API_KEY : 'dbt',
      indexName: ALGOLIA_INDEX_NAME ? ALGOLIA_INDEX_NAME : 'dbt',
      appId: ALGOLIA_APP_ID ? ALGOLIA_APP_ID : 'dbt'
      //debug: true,
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
        src: '/img/dbt-logo-light.svg',
        alt: 'dbt Logo',
      },
      items: [
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
          to: '/faqs/all',
          label: 'FAQs',
          position: 'left',
          activeBasePath: 'faqs'
        },
        {
          to: '/blog/',
          label: 'Developer Blog',
          position: 'right',
          activeBasePath: 'blog'
        },        
        {
          label: 'Learn',
          position: 'right',
          items: [
            {
              label: 'Getting Started Tutorial',
              to: '/tutorial/setting-up',
            },
            {
              label: 'Online Courses',
              href: 'https://courses.getdbt.com',
            },
            {
              label: 'Live Courses',
              href: 'https://learn.getdbt.com/public',
            }
          ],
        },
        {
          label: 'Community',
          position: 'right',
          items: [
            {
              label: 'dbt Slack',
              href: 'https://community.getdbt.com/',
            },
            {
              label: 'Blog',
              href: 'https://blog.getdbt.com',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/fishtown-analytics/dbt',
            },
          ]
        },
        {
          label: 'Versions',
          position: 'right',
          className: 'nav-versioning',
          items: [
            ...versions.map((version, i) => (
              {
                label: `v${version}`,
                href: '/',
              }
            ))
          ]
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} dbt Labs, Inc. All Rights Reserved.`,
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

          sidebarCollapsible: true,     
        },
        blog: {
          blogTitle: 'dbt Developer Blog',
          blogDescription: 'Technical tutorials from the dbt Community.',
          postsPerPage: 20,
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount: 5,
        },

      },
    ],
  ],
  plugins: [
    [
      path.resolve('plugins/insertMetaTags'), 
      { metatags } 
    ],
    path.resolve('plugins/svg'),
    path.resolve('plugins/customWebpackConfig'),
    path.resolve('plugins/buildBlogData'),
    path.resolve('plugins/buildAuthorPages'),
    path.resolve('plugins/handleVersioning'),
  ],
  scripts: [
    {
      src: 'https://code.jquery.com/jquery-3.4.1.min.js',
      defer: true
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.js',
      defer: true
    },
    '/js/gtm.js',
    'https://kit.fontawesome.com/7110474d41.js'
  ],
  stylesheets: [
    '/css/fonts.css',
    '/css/entypo.css',
    '/css/search.css',
    '/css/api.css',
    'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap'
  ],
}

var PRERELEASE = (process.env.PRERELEASE || false);

if (PRERELEASE) {
  var WARNING_BANNER = {
    id: 'prerelease', // Any value that will identify this message.
    content:
      'CAUTION: Prerelease! This documentation reflects the next minor version of dbt. <a href="https://docs.getdbt.com">View current docs</a>.',
    backgroundColor: '#ffa376', // Defaults to `#fff`.
    textColor: '#033744', // Defaults to `#000`.
  }
  siteSettings.themeConfig.announcementBar = WARNING_BANNER;
}

module.exports = siteSettings;
