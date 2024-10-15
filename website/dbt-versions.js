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
    version: "1.9.1",
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
    EOLDate: "2024-10-30",
  },
  {
    version: "1.6",
    EOLDate: "2024-07-31",
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
  {
    page: "reference/resource-configs/store_failures_as",
    firstVersion: "1.7",
  },
  {
    page: "docs/build/build-metrics-intro",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/sl-getting-started",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/about-metricflow",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/join-logic",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/validation",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/semantic-models",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/group-by",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/entities",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/metrics-overview",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/cumulative",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/derived",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/measure-proxy",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/ratio",
    firstVersion: "1.6",
  },
  {
    page: "reference/commands/clone",
    firstVersion: "1.6",
  },
  {
    page: "docs/collaborate/govern/project-dependencies",
    firstVersion: "1.6",
  },
  {
    page: "reference/dbt-jinja-functions/thread_id",
    firstVersion: "1.6",
  },
  {
    page: "reference/resource-properties/deprecation_date",
    firstVersion: "1.6",
  },
  {
    page: "reference/commands/retry",
    firstVersion: "1.6",
  },
  {
    page: "docs/build/groups",
    firstVersion: "1.5",
  },
  {
    page: "docs/collaborate/govern/model-contracts",
    firstVersion: "1.5",
  },
  {
    page: "reference/commands/show",
    firstVersion: "1.5",
  },
  {
    page: "docs/collaborate/govern/model-access",
    firstVersion: "1.5",
  },
  {
    page: "docs/collaborate/govern/model-versions",
    firstVersion: "1.5",
  },
  {
    page: "reference/programmatic-invocations",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-configs/contract",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-configs/group",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-properties/access",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-properties/constraints",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-properties/latest_version",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-properties/versions",
    firstVersion: "1.5",
  },
  {
    page: "reference/resource-configs/on_configuration_change",
    firstVersion: "1.6",
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
    category: "Model governance",
    firstVersion: "1.5",
  },
  {
    category: "Build your metrics",
    firstVersion: "1.6",
  },
];
