const path = require("path");
const math = require("remark-math");
const katex = require("rehype-katex");

const { versions, versionedPages, versionedCategories } = require("./dbt-versions");
require("dotenv").config();

/* Debugging */
var SITE_URL;
if (!process.env.CONTEXT || process.env.CONTEXT == "production") {
  SITE_URL = "https://docs.getdbt.com";
} else {
  SITE_URL = process.env.DEPLOY_URL;
}

var GIT_BRANCH;
if (!process.env.CONTEXT || process.env.CONTEXT == "production") {
  GIT_BRANCH = "current";
} else {
  GIT_BRANCH = process.env.HEAD;
}

let { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

let metatags = [];
// If Not Current Branch, do not index site
if (GIT_BRANCH !== "current") {
  metatags.push({
    tagName: "meta",
    attributes: {
      name: "robots",
      content: "noindex",
    },
  });
}

console.log("DEBUG: CONTEXT =", process.env.CONTEXT);
console.log("DEBUG: DEPLOY_URL =", process.env.DEPLOY_URL);
console.log("DEBUG: SITE_URL = ", SITE_URL);
console.log("DEBUG: ALGOLIA_INDEX_NAME = ", ALGOLIA_INDEX_NAME);
console.log("DEBUG: metatags = ", metatags);

var siteSettings = {
  baseUrl: "/",
  tagline: "End user documentation, guides and technical reference for dbt",
  title: "dbt Developer Hub",
  url: SITE_URL,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  trailingSlash: false,
  themeConfig: {
    docs:{
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    image: "/img/avatar.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // Adding non-empty strings for Algolia config
    // allows Docusaurus to run locally without .env file
    algolia: {
      apiKey: ALGOLIA_API_KEY ? ALGOLIA_API_KEY : "dbt",
      indexName: ALGOLIA_INDEX_NAME ? ALGOLIA_INDEX_NAME : "dbt",
      appId: ALGOLIA_APP_ID ? ALGOLIA_APP_ID : "dbt",
      //debug: true,
    },
    announcementBar: {
      id: "biweekly-demos",
      content:
        "Join our weekly demos and dbt Cloud in action!",
      backgroundColor: "#047377",
      textColor: "#fff",
      isCloseable: true,
    },
    announcementBarActive: true,
    announcementBarLink: "https://www.getdbt.com/resources/dbt-cloud-demos-with-experts?utm_source=docs&utm_medium=event&utm_campaign=q1-2024_cloud-demos-with-experts_awareness",
    // Set community spotlight member on homepage
    // This is the ID for a specific file under docs/community/spotlight
    communitySpotlightMember: "faith-lierheimer",
    prism: {
      theme: (() => {
        var theme = require("prism-react-renderer/themes/nightOwl");
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
            color: "rgb(255, 203, 139)",
          },
        });
        return theme;
      })(),
      additionalLanguages: ["bash"],
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        src: "/img/dbt-logo.svg",
        srcDark: "img/dbt-logo-light.svg",
        alt: "dbt Logo",
      },
      items: [
        {
          to: "/docs/introduction",
          label: "Docs",
          position: "left",
          activeBaseRegex: "docs/(?!(dbt-cloud))",
        },
        {
          to: "reference/references-overview",
          label: "Reference",
          position: "left",
          activeBasePath: "reference",
        },
        {
          label: "Resources",
          position: "right",
          items: [
            {
              label: 'Courses',
              href: 'https://courses.getdbt.com',
            },
            {
              label: 'Best Practices',
              to: '/best-practices',
            },
            {
              label: "Guides",
              to: "/guides",
            },
            {
              label: "Developer Blog",
              to: "/blog",
            },
            {
              label: "Glossary",
              to: "/glossary",
            }
          ],
        },
        {
          label: "Community",
          position: "right",
          items: [
            {
              label: "Join the Community",
              to: "/community/join",
            },
            {
              label: "Become a contributor",
              to: "/community/contribute",
            },
            {
              label: "Community Forum",
              to: "/community/forum",
            },
            {
              label: "Events",
              to: "/community/events",
            },
            {
              label: "Spotlight",
              to: "/community/spotlight",
            },
          ],
        },
        {
          label: "Create a free account",
          to: "https://www.getdbt.com/signup/",
          position: "right",
          className: "nav-create-account button button--primary",
        },
      ],
    },
    footer: {
      links: [
        {
          html: `
          <div class='footer__items'>
            <a href='https://www.getdbt.com/cloud/terms/'>Terms of Service</a>
            <a href='https://www.getdbt.com/cloud/privacy-policy/'>Privacy Policy</a>
            <a href='https://www.getdbt.com/security/'>Security</a>
            <button id="ot-sdk-btn" onclick="openPreferenceCenter()">Cookie Settings</button>
          </div>

          <div class='footer__items--right'>
            <a href='https://twitter.com/getdbt'><i class="fa-brands fa-twitter"></i></a>
            <a href='https://www.getdbt.com/community/join-the-community/'><i class="fa-brands fa-slack"></i></a>
            <a href='https://github.com/dbt-labs/dbt-core'><i class="fa-brands fa-github"></i></a>
          </div>
          `,
        },
      ],

      copyright: `&copy; ${new Date().getFullYear()} dbt Labs, Inc. All Rights Reserved.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [math],
          rehypePlugins: [katex],

          editUrl:
            "https://github.com/dbt-labs/docs.getdbt.com/edit/" +
            GIT_BRANCH +
            "/website/",
          showLastUpdateTime: true,
          //showLastUpdateAuthor: false,

          sidebarCollapsible: true,
        },
        blog: {
          blogTitle: "Developer Blog | dbt Developer Hub",
          blogDescription: "Find tutorials, product updates, and developer insights in the dbt Developer Blog.",
          postsPerPage: 20,
          blogSidebarTitle: "Recent posts",
          blogSidebarCount: 5,
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
      },
    ],
  ],
  plugins: [
    [path.resolve("plugins/insertMetaTags"), { metatags }],
    path.resolve("plugins/svg"),
    path.resolve("plugins/customWebpackConfig"),
    [path.resolve("plugins/buildGlobalData"), { versionedPages, versionedCategories }],
    path.resolve("plugins/buildAuthorPages"),
    path.resolve("plugins/buildSpotlightIndexPage"),
    path.resolve("plugins/buildQuickstartIndexPage"),
    path.resolve("plugins/buildRSSFeeds"),
  ],
  scripts: [
    {
      src: "https://code.jquery.com/jquery-3.4.1.min.js",
      defer: true,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/featherlight@1.7.14/release/featherlight.min.js",
      defer: true,
    },
    "https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js",
    "/js/headerLinkCopy.js",
    "/js/gtm.js",
    "/js/onetrust.js",
    "https://kit.fontawesome.com/7110474d41.js",
  ],
  stylesheets: [
    "/css/fonts.css",
    "/css/entypo.css",
    "/css/search.css",
    "/css/api.css",
    "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;600;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap",
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    {rel: 'icon', href: '/img/favicon.png', type: 'image/png'},
    {rel: 'icon', href: '/img/favicon.svg', type: 'image/svg+xml'},
  ],
};

// If versions json file found, add versions dropdown to nav
if (versions) {
  siteSettings.themeConfig.navbar.items.push({
    label: "Versions",
    position: "left",
    className: "nav-versioning",
    items: [
      ...versions.reduce((acc, version) => {
        if (version?.version) {
          acc.push({
            label: `${version.version}`,
            href: "#",
          });
        }
        return acc;
      }, []),
    ],
  });
}

module.exports = siteSettings;
