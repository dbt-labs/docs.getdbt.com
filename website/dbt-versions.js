/**
 * Sets the available dbt versions available in the navigation
 * @type {Array.<{
 * version: string,
 * EOLDate: string,
 * isPrerelease: boolean,
 * customDisplay: string,
 * }>}
 * @property {string} version The version number
 * @property {string} EOLDate "End of Life" date which is used to show the EOL banner
 * @property {boolean} isPrerelease Boolean used for showing the prerelease banner
 * @property {string} customDisplay Allows setting a custom display name for the current version
 *
 * customDisplay for dbt Cloud should be a version ahead of latest dbt Core release (GA or beta).
 */
exports.versions = [
  {
    version: "1.12",
    customDisplay: "dbt platform (Latest)",
  },
  {
    version: "2.0",
    customDisplay: "dbt Fusion engine",
    isPrerelease: true,
  },
 {
    version: "1.11",
    customDisplay: "Core v1.11 Beta",
    isPrerelease: true,
  },
  {
    version: "1.10",
    customDisplay: "Core v1.10 (Compatible)",
    EOLDate: "2026-06-15",
  },
  {
    version: "1.9",
    customDisplay: "Core v1.9 (Extended)",
    EOLDate: "2025-12-08",
  },
];

/**
 * Controls doc page visibility in the sidebar based on the current version
 * @type {Array.<{
 * page: string,
 * lastVersion: string,
 * }>}
 * @property {string} page The target page to hide/show in the sidebar
 * @property {string} lastVersion The last version the page is visible in the sidebar
 */
exports.versionedPages = [
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
    page: "reference/resource-configs/snapshot_meta_column_names",
    firstVersion: "1.9",
  },
  {
    page: "reference/resource-configs/target_database",
    lastVersion: "1.8",
  },
  {
    page: "reference/resource-configs/target_schema",
    lastVersion: "1.8",
  },
  {
    page: "reference/global-configs/indirect-selection",
    firstVersion: "1.8",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-apache-spark",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-amazon-athena",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-azure-synapse-analytics",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-microsoft-fabric",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-onehouse",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-postgresql-alloydb",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-starburst-trino",
    lastVersion: "1.99",
  },
  {
    page: "docs/cloud/connect-data-platform/connect-teradata",
    lastVersion: "1.99",
  },
];

/**
 * Controls doc category visibility in the sidebar based on the current version
 * @type {Array.<{
 * category: string,
 * firstVersion: string,
 * }>}
 * @property {string} category The target category to hide/show in the sidebar
 * @property {string} firstVersion The first version the category is visible in the sidebar
 */
exports.versionedCategories = [
  {
    category: "Connect dbt Core to your data platform",
    lastVersion: "1.99",
  },
  {
    category: "Install dbt Core",
    lastVersion: "1.99",
  },
];
