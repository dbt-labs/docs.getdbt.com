const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Builds a map of page permalink -> banner at build time from a central
 * config file (website/page-banners.yml).
 *
 * Each banner entry can target one or many pages, and the map is exposed as
 * global data so the swizzled AnnouncementBar can render the correct banner
 * directly into the static HTML during SSR (no client-side swap, no flash of
 * the global announcement bar).
 *
 * Config format (website/page-banners.yml):
 *
 *   - paths:
 *       - /docs/introduction
 *       - /docs/build/models
 *     text: "Heads up — this feature is in <b>beta</b>."
 *     link: /docs/some-page
 *     open_in_new_tab: true
 *
 *   - path: /reference/some-page   # single path shorthand
 *     text: "A single-page banner"
 *
 * Per entry:
 *   - paths / path (required): one path (string) or a list of paths.
 *   - text (required): banner message; supports inline HTML.
 *   - link (optional): URL the banner links to.
 *   - open_in_new_tab (optional): open the link in a new tab.
 */

// Normalize a path for stable lookups (drop trailing slash, keep root "/").
function normalizePath(pathname) {
  if (!pathname) return pathname;
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

module.exports = function buildPageBannersPlugin(context) {
  const siteDir = (context && context.siteDir) || ".";
  const configPath = path.join(siteDir, "page-banners.yml");

  return {
    name: "docusaurus-build-page-banners-plugin",

    // Run after all content is loaded so we can validate configured paths
    // against the docs plugin's computed permalinks.
    async allContentLoaded({ allContent, actions }) {
      const { setGlobalData } = actions;

      // Read the central banner config (optional file).
      let entries = [];
      if (fs.existsSync(configPath)) {
        entries = yaml.load(fs.readFileSync(configPath, "utf8")) || [];
      }

      // Build a path -> banner map. Each entry may target one or many paths.
      const banners = {};
      entries.forEach((entry) => {
        if (!entry || !entry.text) return;
        const targets = [].concat(entry.paths || []).concat(entry.path || []);
        const banner = {
          text: entry.text,
          link: entry.link,
          open_in_new_tab: entry.open_in_new_tab,
        };
        targets.forEach((target) => {
          if (target) banners[normalizePath(target)] = banner;
        });
      });

      // Collect every built doc permalink so we can warn about banner paths
      // that don't match a real page (typos / pages moved or renamed).
      const knownPermalinks = new Set();
      const docsPluginContent =
        allContent["docusaurus-plugin-content-docs"] || {};
      Object.values(docsPluginContent).forEach((content) => {
        (content?.loadedVersions || []).forEach((version) => {
          (version.docs || []).forEach((doc) => {
            if (doc.permalink) {
              knownPermalinks.add(normalizePath(doc.permalink));
            }
          });
        });
      });

      if (knownPermalinks.size) {
        Object.keys(banners).forEach((bannerPath) => {
          if (!knownPermalinks.has(bannerPath)) {
            console.warn(
              `[page-banners] No page found for banner path "${bannerPath}" — this banner will not display. Check page-banners.yml.`
            );
          }
        });
      }

      setGlobalData({ banners });
    },
  };
};
