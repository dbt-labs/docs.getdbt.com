const path = require('path');
const math = require('remark-math');
const katex = require('rehype-katex');
const { versions, versionedPages } = require('./dbt-versions');
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
if (GIT_BRANCH !== 'current') {
  metatags.push({
    tagName: 'meta',
    attributes: {
      name: 'robots',
      content: 'noindex'
    }
  })
}

console.log("DEBUG: CONTEXT =", process.env.CONTEXT);
console.log("DEBUG: DEPLOY_URL =", process.env.DEPLOY_URL);
console.log("DEBUG: SITE_URL = ", SITE_URL);
console.log("DEBUG: ALGOLIA_INDEX_NAME = ", ALGOLIA_INDEX_NAME);
console.log("DEBUG: metatags = ", metatags);

var siteSettings = {
  baseUrl: '/',
  favicon: '/img/favicon.ico',
  tagline: 'End user documentation, guides and technical reference for dbt (data build tool)',
  title: 'dbt Docs',
  url: SITE_URL,
  onBrokenLinks: 'warn',
  trailingSlash: false,
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
    announcementBar: {
      id: "live_qa",
      content:
        "Have questions you want answered live? Join us for a dbt Live: Expert Series session!",
      backgroundColor: "#047377",
      textColor: "#fff",
      isCloseable: true
    },
    announcementBarActive: true,
    announcementBarLink: "https://www.getdbt.com/events/",
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
          to: '/guides/getting-started',
          label: 'Guides',
          position: 'left',
          activeBasePath: 'guides'
        },
        {
          to: '/blog/',
          label: 'Developer Blog',
          position: 'right',
          activeBasePath: 'blog'
        },
        {
          label: 'Courses',
          position: 'right',
          items: [
            {
              label: 'Online courses',
              href: 'https://courses.getdbt.com',
            },
            {
              label: 'Live courses',
              href: 'https://learn.getdbt.com/public',
            }
          ],
        },
        {
          label: 'Community',
          position: 'right',
          items: [
            {
              label: 'Maintaining a Slack Channel',
              to: '/community/maintaining-a-channel',
            },
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
              href: 'https://github.com/dbt-labs/dbt-core',
            },
          ]
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} dbt Labs™, Inc. All Rights Reserved. | <a href="https://www.getdbt.com/cloud/terms/" title="Terms of Service" target="_blank">Terms of Service</a> | <a href="https://www.getdbt.com/cloud/privacy-policy/" title="Privacy Policy" target="_blank">Privacy Policy</a> | <a href="https://www.getdbt.com/security/" title="Security" target="_blank">Security</a> | <button id=\"ot-sdk-btn\" class=\"ot-sdk-show-settings\">Cookie Settings</button>`
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
          remarkPlugins: [math],
          rehypePlugins: [katex],

          editUrl: 'https://github.com/dbt-labs/docs.getdbt.com/edit/' + GIT_BRANCH + '/website/',
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
          remarkPlugins: [math],
          rehypePlugins: [katex],
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
    [
      path.resolve('plugins/buildGlobalData'),
      { versionedPages }
    ],
    path.resolve('plugins/buildAuthorPages')
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
    'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap',
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
}

// If versions json file found, add versions dropdown to nav
if (versions) {
  siteSettings.themeConfig.navbar.items.push({
    label: 'Versions',
    position: 'left',
    className: 'nav-versioning',
    items: [
      ...versions.reduce((acc, version) => {
        if (version?.version) {
          acc.push({
            label: `${version.version}`,
            href: '#',
          })
        }
        return acc
      }, [])
    ]
  })
}

module.exports = siteSettings;
