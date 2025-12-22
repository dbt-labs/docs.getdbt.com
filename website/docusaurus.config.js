import path from "path";
import math from "remark-math";
import katex from "rehype-katex";
const { themes } = require('prism-react-renderer')

const { versions, versionedPages, versionedCategories } = require("./dbt-versions");
require("dotenv").config();

/* Set SITE_URL by environment */
var SITE_URL = "https://docs.getdbt.com";
if (process?.env?.VERCEL_ENV === "preview" && process?.env?.VERCEL_BRANCH_URL) {
  SITE_URL = `https://${process.env.VERCEL_BRANCH_URL}`;
} else if (process?.env?.VERCEL_ENV === "development") {
  SITE_URL = `http://localhost:3000`;
}

const GIT_BRANCH = process?.env?.VERCEL_GIT_COMMIT_REF;

let { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

let metatags = [];
// If not `current` and not `main` branch, do not index site
if (GIT_BRANCH && (GIT_BRANCH !== "current" && GIT_BRANCH !== "main")) {
  metatags.push({
    tagName: "meta",
    attributes: {
      name: "robots",
      content: "noindex",
    },
  });
}

console.log("DEBUG: VERCEL_GIT_COMMIT_REF =", process.env.VERCEL_GIT_COMMIT_REF);
console.log("DEBUG: GIT_BRANCH =", GIT_BRANCH);
console.log("DEBUG: CONTEXT =", process.env.CONTEXT);
console.log("DEBUG: DEPLOY_URL =", process.env.DEPLOY_URL);
console.log("DEBUG: VERCEL_ENV =", process.env.VERCEL_ENV);
console.log("DEBUG: VERCEL_BRANCH_URL =", process.env.VERCEL_BRANCH_URL);
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
    docs: {
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
      id: "dbt-workshop",
      content:
        "Help us find out what's next for data teams by taking the 2026 State of Analytics Engineering survey",
      isCloseable: true,
    },
    announcementBarActive: true,
    announcementBarLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSdbOMc5kT8rFUGHryEO2RcJEzwF9xr_qWE3CHBbOcQpnilyIg/viewform",
    // Set community spotlight member on homepage
    // This is the ID for a specific file under docs/community/spotlight
    communitySpotlightMember: "original-dbt-athena-maintainers",
    prism: {
      theme: (() => {
        var theme = themes.nightOwl;
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
        src: "/img/dbt-logo.svg?v=2",
        srcDark: "img/dbt-logo-light.svg?v=2",
        alt: "dbt Logo",
      },
      items: [
        {
          label: "Docs",
          position: "right",
          items: [
            {
              label: "Product docs",
              to: "/docs/introduction",
              activeBaseRegex: "docs/(?!(dbt-cloud))",
            },
            {
              label: "References",
              to: "reference/references-overview",
            },
            {
              label: "Best practices",
              to: "/best-practices",
            },
            {
              to: "/blog",
              label: "Developer blog",
            },
          ],
        },
        {
          to: "/guides",
          label: "Guides",
          position: "right",
        },
        {
          to: "/docs/dbt-cloud-apis/overview",
          label: "APIs",
          position: "right",
        },
        {
          label: "Help",
          position: "right",
          items: [
            {
              label: "Release notes",
              to: "/docs/dbt-versions/dbt-cloud-release-notes",
            },
            {
              label: "FAQs",
              to: "/docs/faqs",
            },
            {
              label: "Support and billing",
              to: "/docs/dbt-support",
            },
            {
              label: "Fusion Diaries",
              href: "https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements",
            },
            {
              label: "Courses",
              href: "https://learn.getdbt.com",
            },
          ],
        },
        {
          label: "Community",
          position: "right",
          items: [
            {
              label: "Join the dbt Community",
              to: "/community/join",
            },
            {
              label: "Become a contributor",
              to: "/community/contribute",
            },
            {
              label: "Community forum",
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
          label: "Account",
          position: "right",
          className: "navbar__account hide-label",
          items: [
            {
              label: "Log in to dbt",
              to: "https://cloud.getdbt.com/",
              target: "_blank",
            },
            {
              label: "Create a free account",
              to: "https://www.getdbt.com/signup",
            },
          ],
        },
        {
          label: "Install VS Code extension",
          position: "right",
          to: "https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt",
          id: "nav-install-vs-code-extension",
          className: "nav-install-dbt-extension",
        },
      ],
    },
    footer: {
      links: [
        {
          html: `
          <script 
            src="https://solve-widget.forethought.ai/embed.js" id="forethought-widget-embed-script" data-api-key="9d421bf3-96b8-403e-9900-6fb059132264" 
            data-ft-workflow-tag="docs" 
            config-ft-greeting-message="Welcome to dbt Product docs! Ask a question."
            config-ft-widget-header-title = "Ask a question"
            config-ft-privacy-policy = "We're pleased to offer this complimentary chatbot service, powered by Forethought.ai, to optimize your experience and productivity. Your use of this chatbot is subject to, and may be retained pursuant to, the terms of the privacy policy available for review at <a href='https://www.getdbt.com/cloud/privacy-policy' target='_blank'>https://www.getdbt.com/cloud/privacy-policy</a>."
          ></script>
          <div class='bottom-cta'>
            <div class='container'>
              <div class='cta-section-text'>
                <span class="eyebrow">Get started</span>
                <h2 class="heading-2">Start building with dbt.</h2>
                <p>The free dbt VS Code extension is the best way to develop locally with the dbt Fusion Engine.</p>
              </div>
              <div class="cta-section">
                <a href="https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt" target="_blank" class="primary-cta">Install free extension</a>
                <a href="https://www.getdbt.com/contact" target="_blank" class="secondary-cta">Request your demo</a>
              </div>
            </div>
          </div>

          <div class="sub-footer">
          <div class="container">
          <div class="footer-logo">
            <a href="/">
              <img src="/img/dbt-logo-light.svg?v=2" alt="dbt Labs" />
            </a>
          </div>

          <div class="footer-grid">
            <div class="footer-grid-item">
              <h5 class="heading-5">Resources</h5>
              <a href='/docs/about-dbt-extension'>VS Code Extension</a>
              <a href="https://www.getdbt.com/resources" target="_blank">Resource Hub</a>
              <a href="https://www.getdbt.com/dbt-learn" target="_blank">dbt Learn</a>
              <a href="https://www.getdbt.com/dbt-certification" target="_blank">Certification</a>
              <a href="/blog">Developer Blog</a>
            </div>
            <div class="footer-grid-item">
              <h5 class="heading-5">Community</h5>
              <a href='/community/join'>Join the Community</a>
              <a href="/community/contribute">Become a Contributor</a>
              <a href="https://hub.getdbt.com/" target="_blank">Open Source dbt Packages</a>
              <a href="/community/forum">Community Forum</a>
            </div>
            <div class="footer-grid-item">
              <h5 class="heading-5">Support</h5>
              <a href='/docs/dbt-support'>Contact Support</a>
              <a href="https://www.getdbt.com/services" target="_blank">Professional Services</a>
              <a href="https://www.getdbt.com/partner-directory" target="_blank">Find a Partner</a>
              <a href="https://status.getdbt.com/" target="_blank">System Status</a>
            </div>
            <div class="footer-grid-item">
              <h5 class="heading-5">Connect with Us</h5>
              <div class="social-icons">
            <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <a href='https://github.com/dbt-labs/docs.getdbt.com' title="GitHub" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg></a>
            <a href='https://www.linkedin.com/company/dbtlabs/mycompany/' title="LinkedIn" target="_blank" rel="noreferrer noopener"><svg class="fa-brands fa-linkedin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg></a>
            <a href='https://www.youtube.com/channel/UCVpBwKK-ecMEV75y1dYLE5w' title="YouTube" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg></a>
            <a href='https://www.instagram.com/dbt_labs/' title="Instagram" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a>
            <a href='https://x.com/dbt_labs' title="X" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
            <a href='https://bsky.app/profile/getdbt.com' title="Bluesky" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/></svg></a>
            <a href='https://www.getdbt.com/community/join-the-community/' title="Community Slack" target="_blank" rel="noreferrer noopener"><svg class="fa-brands" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z"/></svg></a>
            </div>
            </div>
          </div>

          <div class='footer-sub-items'>
            <div class="footer-copyright">
              <span>&copy; ${new Date().getFullYear()} dbt Labs, Inc. All Rights Reserved.</span>
            </div>
            <div class="footer-sub-items-links">
              <a href='https://www.getdbt.com/terms-of-use/'>Terms of Service</a>
              <a href='https://www.getdbt.com/cloud/privacy-policy/'>Privacy Policy</a>
              <a href='https://www.getdbt.com/security/'>Security</a>
              <button id="ot-sdk-btn" onclick="openPreferenceCenter()">Cookie Settings</button>
            </div>
          </div>
          </div>
          </div>
          `,
        },
      ],
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
          exclude: ["hover-terms.md"],
        },
        blog: {
          blogTitle: "Developer Blog | dbt Developer Hub",
          blogDescription:
            "Find tutorials, product updates, and developer insights in the dbt Developer blog.",
          postsPerPage: 20,
          blogSidebarTitle: "Recent posts",
          blogSidebarCount: 5,
          remarkPlugins: [math],
          rehypePlugins: [katex],
          // Un-truncated blog posts will throw an error
          // https://docusaurus.io/blog/releases/3.5#onuntruncatedblogposts
          onUntruncatedBlogPosts: "throw",
        },
      },
    ],
  ],
  plugins: [
    [path.resolve("plugins/insertMetaTags"), { metatags }],
    path.resolve("plugins/customWebpackConfig"),
    [
      path.resolve("plugins/buildGlobalData"),
      { versionedPages, versionedCategories },
    ],
    path.resolve("plugins/buildSpotlightIndexPage"),
    path.resolve("plugins/buildQuickstartIndexPage"),
    path.resolve("plugins/buildRSSFeeds"),
    path.resolve("plugins/buildRawMarkdownData"),
    [
      "vercel-analytics",
      {
        debug: false,
        mode: "auto",
      },
    ],
    [
      "@signalwire/docusaurus-plugin-llms-txt",
      {
        generate: {
          enableMarkdownFiles: true,
          enableLlmsFullTxt: true,
          relativePaths: false,
        },
        include: {
          includeBlog: false,
          includePages: false,
          includeDocs: true,
        },
        // Content organization
        structure: {
          sections: [
            {
              id: "getting-started",
              name: "Getting Started",
              routes: [
                { route: "/docs/introduction" },
                { route: "/docs/get-started-dbt" },
                { route: "/docs/configuration-checklist" },
              ],
            },
            {
              id: "set-up-dbt",
              name: "Set up dbt",
              routes: [
                { route: "/docs/about-setup" },
                { route: "/docs/environments-in-dbt" },
                { route: "/docs/running-a-dbt-project/**" },
              ],
              subsections: [
                {
                  id: "dbt-platform",
                  name: "dbt platform",
                  routes: [
                    { route: "/docs/about-cloud-setup" },
                    { route: "/docs/cloud/account-settings" },
                    { route: "/docs/cloud/account-integrations" },
                    { route: "/docs/dbt-cloud-environments" },
                    { route: "/docs/cloud/migration" },
                  ],
                  subsections: [
                    {
                      id: "connect-data-platform",
                      name: "Connect data platform",
                      routes: [{ route: "/docs/cloud/connect-data-platform/**" }],
                    },
                    {
                      id: "manage-access",
                      name: "Manage access",
                      routes: [{ route: "/docs/cloud/manage-access/**" }],
                    },
                    {
                      id: "git",
                      name: "Git",
                      routes: [{ route: "/docs/cloud/git/**" }],
                    },
                    {
                      id: "secure",
                      name: "Secure",
                      routes: [{ route: "/docs/cloud/secure/**" }],
                    },
                  ],
                },
                {
                  id: "dbt-core-and-fusion",
                  name: "dbt Core and Fusion",
                  routes: [
                    { route: "/docs/about-dbt-install" },
                    { route: "/docs/core/dbt-core-environments" },
                  ],
                  subsections: [
                    {
                      id: "install-dbt-fusion-engine",
                      name: "Install dbt Fusion engine",
                      routes: [
                        { route: "/docs/fusion/about-fusion-install" },
                        { route: "/docs/fusion/install-dbt-extension" },
                        { route: "/docs/fusion/install-fusion-cli" },
                      ],
                    },
                    {
                      id: "install-dbt-core",
                      name: "Install dbt Core",
                      routes: [
                        { route: "/docs/core/installation-overview" },
                        { route: "/docs/core/docker-install" },
                        { route: "/docs/core/pip-install" },
                        { route: "/docs/core/source-install" },
                      ],
                    },
                    {
                      id: "core-connect-data-platform",
                      name: "Connect data platform",
                      routes: [
                        { route: "/docs/core/connect-data-platform/**" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "fusion",
              name: "Fusion",
              routes: [{ route: "/docs/fusion/**" }],
            },
            {
              id: "platform",
              name: "Platform",
              routes: [{ route: "/docs/cloud/**" }],
            },
            {
              id: "api-reference",
              name: "API Reference",
              routes: [{ route: "/docs/dbt-cloud-apis/**" }],
            },
          ],
          siteTitle: "dbt Developer Hub",
          siteDescription:
            "End user documentation, guides and technical reference for dbt",
        },
      },
    ],
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
    {
      src: "/js/checkboxes.js",
      async: true,
    },
    "https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js",
    "/js/headerLinkCopy.js",
    "/js/gtm.js",
    "/js/onetrust.js",
    "/js/mutiny.js",
    "/js/hide-forethought.js",
    {
      src: "https://www.google.com/recaptcha/api.js?render=6LeIksMrAAAAABYsWNCpUv15lXXzEZj91zdDCymo",
      async: true,
      defer: true,
    },
  ],
  stylesheets: [
    "/css/fonts.css",
    "/css/entypo.css",
    "/css/search.css",
    "/css/api.css",
    "https://use.typekit.net/kvb8avc.css",
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    { rel: "icon", href: "/img/favicon.png", type: "image/png" },
    { rel: "icon", href: "/img/favicon.svg", type: "image/svg+xml" },
  ],
  future: {
    // Enables all Docusaurus Faster features
    // experimental_faster: true,
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
      rspackBundler: true,

      // Coming in v3.8.0
      // ssgWorkerThreads: true,
    },
  },
};

// If versions json file found, add versions dropdown to nav
if (versions) {
  siteSettings.themeConfig.navbar.items.push({
    label: "Versions",
    position: "right",
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
