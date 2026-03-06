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
    version: "2.1",
    customDisplay: "dbt platform (Latest Fusion)",
  },
  {
    version: "2.0",
    customDisplay: "Fusion CLI + extension",
    isPrerelease: true,
  },
    {
    version: "1.12",
    customDisplay: "dbt platform (Latest Core)",
  },
  {
    version: "1.11",
    customDisplay: "Core v1.11",
    EOLDate: "2026-12-18",
  },
  {
    version: "1.10",
    customDisplay: "Core v1.10 (Compatible/Extended)",
    EOLDate: "2026-06-15",
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
  {
    page: "docs/build/measures",
    lastVersion: "1.11",
  },
  {
    page: "docs/local/connect-data-platform/spark-setup",
    lastVersion: "1.99",
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
    page: "docs/local/connect-data-platform/connection-profiles",
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
    page: "docs/local/connect-data-platform/duckdb-setup",
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
    page: "docs/local/connect-data-platform/ibmdb2-setup",
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
    category: "Install dbt Core",
    lastVersion: "1.99",
  },
];
