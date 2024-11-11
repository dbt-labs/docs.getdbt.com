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
    version: "1.10",
    customDisplay: "Cloud (Versionless)",
  },
  {
    version: "1.9",
    isPrerelease: true,
  },
  {
    version: "1.8",
    EOLDate: "2025-04-15",
  },
  {
    version: "1.7",
    EOLDate: "2024-11-01",
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

];
