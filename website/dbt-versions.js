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
    name: "Fusion",
    subProducts: [
      {
        name: "dbt platform (stable)",
        version: "2.0",
      },
      {
        name: "dbt Fusion engine",
        version: "2.0",
      },
    ],
  },
  {
    name: "Core",
    subProducts: [
      {
        name: "dbt platform (latest)",
        version: "1.12",
      },
      {
        name: "dbt Core v2.0 (alpha)",
        version: "2.0",
      },
      {
        name: "dbt Core v1.12 (beta)",
        version: "1.12",
      },
      {
        name: "Core v1.11",
        EOLDate: "2026-12-18",
        version: "1.11",
      },
    ],
  },
];

exports.products = products;

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
      isPrerelease: sp.isBeta || false,
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
  {
    page: "docs/reference/commands/lint",
    firstVersion: "2.0",  
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
  {
    page: "reference/global-configs/cache",
    lastVersion: "1.99",
  },
  {
    page: "reference/global-configs/sqlparse",
    firstVersion: "1.11",
  },
  {
    page: "reference/dbt-jinja-functions/run_query_as",
    firstVersion: "2.0",
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
