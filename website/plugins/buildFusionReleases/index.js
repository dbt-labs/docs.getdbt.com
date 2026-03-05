const RELEASES_URL = "https://public.cdn.getdbt.com/fs/releases.json";
const VERSIONS_URL = "https://public.cdn.getdbt.com/fs/versions.json";

module.exports = function buildFusionReleasesPlugin() {
  return {
    name: "docusaurus-build-fusion-releases-plugin",
    async loadContent() {
      try {
        const [releasesRes, versionsRes] = await Promise.all([
          fetch(RELEASES_URL),
          fetch(VERSIONS_URL),
        ]);

        if (!releasesRes.ok) {
          throw new Error(`Failed to fetch releases: ${releasesRes.status}`);
        }
        if (!versionsRes.ok) {
          throw new Error(`Failed to fetch versions: ${versionsRes.status}`);
        }

        const releases = await releasesRes.json();
        const versions = await versionsRes.json();

        return { releases, versions };
      } catch (err) {
        console.warn(
          `[buildFusionReleases] Could not fetch release data: ${err.message}`
        );
        return { releases: {}, versions: {} };
      }
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
};
