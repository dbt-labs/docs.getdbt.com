/**
 * Products define the top-level categories in the version menu.
 * Each product contains sub-products (release tracks) with an associated version.
 *
 * Sub-product properties:
 * @property {string} name - Display name (must be unique across all products)
 * @property {string} version - The version number used by VersionBlock for content filtering
 * @property {boolean} [isBeta] - Marks this sub-product as beta/prerelease
 * @property {string} [EOLDate] - End-of-life date (YYYY-MM-DD) for EOL banners
 *
 * The same version can appear in multiple sub-products. Each sub-product
 * appears as a separate item in the version menu, even when versions overlap.
 */

const products = [
  {
    name: "v2",
    displayName: "",
    subProducts: [
      {
        name: "v2",
        version: "2.0",
      },
    ],
  },
  {
    name: "v1",
    displayName: "",
    // List newest first; the first entry is treated as the current/latest track.
    // `stage` drives the lifecycle tag shown in the menu: "alpha" | "rc" | "beta" | "Preview"
    // (omit for a stable/GA release). Update as a version moves through its cycle.
    subProducts: [
      {
        name: "dbt Core v1.12",
        EOLDate: "2027-07-15",
        version: "1.12",
      },
      {
        name: "dbt Core v1.11",
        EOLDate: "2026-12-18",
        version: "1.11",
      },
    ],
  },
];

exports.products = products;

/**
 * Single source of truth for "is this sub-product a prerelease?".
 * Derived from `stage` (alpha/rc/beta) so the menu label and version behavior
 * can never disagree. Legacy `isBeta` is still honored as a fallback.
 */
const PRERELEASE_STAGES = new Set(["alpha", "rc", "beta"]);
function isPrerelease(subProduct) {
  if (!subProduct) return false;
  if (subProduct.isBeta) return true;
  return Boolean(subProduct.stage && PRERELEASE_STAGES.has(subProduct.stage));
}
exports.isPrerelease = isPrerelease;

/**
 * Backward-compatible versions array derived from products.
 * When the same version appears in multiple sub-products, the first occurrence wins.
 * Used by versionedPages/versionedCategories utilities and VersionContext internals.
 */
const _seenVersions = new Set();
exports.versions = products.flatMap((product) =>
  product.subProducts
    .filter((sp) => {
      if (_seenVersions.has(sp.version)) return false;
      _seenVersions.add(sp.version);
      return true;
    })
    .map((sp) => ({
      version: sp.version,
      customDisplay: sp.name,
      isPrerelease: isPrerelease(sp),
      EOLDate: sp.EOLDate,
    }))
);

/**
 * Controls doc page visibility in the sidebar based on the current version and/or product.
 * @type {Array.<{
 * page: string,
 * firstVersion?: string,
 * lastVersion?: string,
 * product?: string,
 * }>}
 *
 * `product` — when set, the page is only shown when that top-level product is
 * selected (e.g. "Fusion" or "Core"). Can be combined with firstVersion /
 * lastVersion to further restrict by version within that product.
 */
exports.versionedPages = [
  // v2/Fusion-only pages — hidden from the v1 sidebar. `about-fusion` and
  // `about-dbt-extension` stay open as v1 discovery + upgrade on-ramps.
  { page: "docs/fusion/fusion", firstVersion: "2.0" },
  { page: "docs/fusion/get-started-fusion", firstVersion: "2.0" },
  { page: "docs/fusion/fusion-availability", firstVersion: "2.0" },
  { page: "docs/fusion/fusion-readiness", firstVersion: "2.0" },
  { page: "docs/fusion/new-concepts", firstVersion: "2.0" },
  { page: "docs/fusion/supported-features", firstVersion: "2.0" },
  { page: "docs/fusion/fusion-networking", firstVersion: "2.0" },
  { page: "docs/fusion/fusion-releases", firstVersion: "2.0" },
  { page: "docs/fusion/telemetry", firstVersion: "2.0" },
  { page: "docs/dbt-extension-features", firstVersion: "2.0" },
  { page: "docs/install-dbt-extension", firstVersion: "2.0" },
  { page: "docs/sign-in-dbt-extension", firstVersion: "2.0" },
  { page: "docs/configure-dbt-extension", firstVersion: "2.0" },
  { page: "reference/commands/login", firstVersion: "2.0" },
  {
    page: "docs/dbt-extension-features",
    firstVersion: "2.0",
  },
  {
    page: "docs/install-dbt-extension",
    firstVersion: "2.0",
  },
  {
    page: "docs/upgrade-to-fusion-extension",
    firstVersion: "2.0",
  },
  {
    page: "docs/sign-in-dbt-extension",
    firstVersion: "2.0",
  },
  {
    page: "docs/configure-dbt-extension",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/about-fusion",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/about-fusion-install",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/adbc",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/vs-compare-changes",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/get-started-fusion",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/fusion-availability",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/supported-features",
    firstVersion: "2.0",
  },
  {
    page: "docs/fusion/fusion-releases",
    firstVersion: "2.0",
  },
  {
    page: "reference/telemetry-observability",
    firstVersion: "2.0",
  },
  {
    page: "docs/local/fusion-networking-requirements",
    firstVersion: "2.0",
  },
  {
    page: "docs/build/about-static-analysis",
    firstVersion: "2.0",
  },
  // Commands that don't exist in dbt Core -- hidden from the v1 sidebar.
  // Page paths must match the docId (relative to the docs/ content root), so
  // reference/* pages take NO "docs/" prefix (unlike pages under docs/docs/).
  {
    // Fusion engine SQL linter.
    page: "reference/commands/lint",
    firstVersion: "2.0",
  },
  {
    // dbt CLI (platform) command.
    page: "reference/commands/dbt-environment",
    firstVersion: "2.0",
  },
  {
    // dbt CLI (platform) command.
    page: "reference/commands/invocation",
    firstVersion: "2.0",
  },
  {
    // Manages the Fusion CLI install; no dbt Core equivalent.
    page: "reference/commands/system",
    firstVersion: "2.0",
  },
  {
    // Legacy dbt-rpc: maintained through dbt-core v1.5, unsupported from v1.6+.
    page: "reference/commands/rpc",
    lastVersion: "1.5",
  },
  {
    page: "docs/local/connect-data-platform/salesforce-data-cloud-setup",
    firstVersion: "2.0",
  },
  {
    page: "docs/build/sample-flag",
    firstVersion: "1.10",
  },
  {
    page: "docs/build/empty-flag",
    firstVersion: "1.8",
  },
  {
    page: "docs/build/incremental-microbatch",
    firstVersion: "1.9",
  },
  {
    page: "docs/platform/connect-data-platform/connect-apache-spark",
    lastVersion: "1.99",

  },
  {
    page: "docs/platform/connect-data-platform/connect-amazon-athena",
    lastVersion: "1.99",
  },
  {
    page: "docs/platform/connect-data-platform/connect-azure-synapse-analytics",
    lastVersion: "1.99",
  },
  {
    page: "docs/platform/connect-data-platform/connect-microsoft-fabric",
    lastVersion: "1.99",
  },
  {
    page: "docs/platform/connect-data-platform/connect-onehouse",
    lastVersion: "1.99",
  },
  {
    page: "docs/platform/connect-data-platform/connect-postgresql-alloydb",
    lastVersion: "1.99",
  },
  {
    page: "docs/platform/connect-data-platform/connect-salesforce",
    firstVersion: "2.0",
  },
  {
    page: "docs/platform/connect-data-platform/connect-starburst-trino",
    lastVersion: "1.99",
  },
  {
    page: "docs/platform/connect-data-platform/connect-teradata",
    lastVersion: "1.99",
  },
  {
    page: "docs/build/measures",
    lastVersion: "1.11",
  },
  {
    page: "docs/local/connect-data-platform/fabric-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/fabricspark-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/alloydb-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/athena-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/azuresynapse-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/clickhouse-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/confluent-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/cratedb-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/databend-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/decodable-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/deltastream-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/doris-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/dremio-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/exasol-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/extrica-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/firebolt-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/glue-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/greenplum-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/hive-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/hologres-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/ibm-db2-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/ibmnetezza-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/impala-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/infer-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/iomete-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/lakebase-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/layer-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/materialize-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/maxcompute-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/mindsdb-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/mssql-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/mysql-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/oracle-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/postgres-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/risingwave-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/rockset-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/singlestore-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/sqlite-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/starrocks-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/teradata-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/tidb-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/trino-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/upsolver-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/vertica-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/watsonx-presto-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/watsonx-spark-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/ydb-setup",
    lastVersion: "1.99",
  },
  {
    page: "docs/local/connect-data-platform/yellowbrick-setup",
    lastVersion: "1.99",
  },
  {
    page: "reference/global-configs/cache",
    lastVersion: "1.99",
  },
  {
    page: "reference/global-configs/sqlparse",
    firstVersion: "1.11",
  },
  {
    page: "reference/global-configs/user-settings",
    firstVersion: "1.13",
  },
];

/**
 * Controls doc category visibility in the sidebar based on the current version and/or product.
 * @type {Array.<{
 * category: string,
 * firstVersion?: string,
 * lastVersion?: string,
 * product?: string,
 * }>}
 *
 * `product` — when set, the category is only shown when that top-level product
 * is selected (e.g. "Fusion" or "Core"). Can be combined with firstVersion /
 * lastVersion to further restrict by version within that product.
 */
exports.versionedCategories = [
  {
    category: "Install dbt Core",
    lastVersion: "1.99",
  },
];
