const sidebarSettings = {
  docs: [
    "docs/introduction",
    "docs/supported-data-platforms",
    {
      type: "category",
      label: "About dbt Cloud",
      items: [
        "docs/cloud/about-cloud/dbt-cloud-features",
        "docs/cloud/about-cloud/architecture",
        "docs/cloud/about-cloud/tenancy",
        "docs/cloud/about-cloud/regions-ip-addresses",
        "docs/cloud/about-cloud/about-cloud-ide",
      ],
    }, // About dbt Cloud directory
    {
      type: "category",
      label: "Quickstarts",
      collapsed: true,
      items: [
        "docs/quickstarts/overview",
        {
          type: "category",
          label: "dbt Cloud",
          collapsed: true,
          items: [
            "docs/quickstarts/dbt-cloud/bigquery",
            "docs/quickstarts/dbt-cloud/databricks",
            "docs/quickstarts/dbt-cloud/redshift",
            "docs/quickstarts/dbt-cloud/snowflake",
            "docs/quickstarts/dbt-cloud/starburst-galaxy",
          ],
        },
        {
          type: "category",
          label: "dbt Core",
          collapsed: true,
          items: [
            "docs/quickstarts/dbt-core/codespace",
            "docs/quickstarts/dbt-core/manual-install",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Set up dbt",
      collapsed: true,
      items: [
        "docs/about-setup",
        {
          type: "category",
          label: "dbt Cloud",
          collapsed: true,
          items: [
            "docs/cloud/about-cloud-setup",
            {
              type: "category",
              label: "Connect data platform",
              items: [
                "docs/cloud/connect-data-platform/about-connections",
                "docs/cloud/connect-data-platform/connect-starburst-trino",
                "docs/cloud/connect-data-platform/connect-snowflake",
                "docs/cloud/connect-data-platform/connect-bigquery",
                "docs/cloud/connect-data-platform/connect-databricks",
                "docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb",
                "docs/cloud/connect-data-platform/connect-apache-spark",
              ],
            },
            {
              type: "category",
              label: "Manage access",
              items: [
                "docs/cloud/manage-access/about-access",
                "docs/cloud/manage-access/seats-and-users",
                {
                  type: "category",
                  label: "Permissions",
                  items: [
                    "docs/cloud/manage-access/self-service-permissions",
                    "docs/cloud/manage-access/enterprise-permissions",
                  ],
                },

                {
                  type: "category",
                  label: "Single sign-on",
                  items: [
                    "docs/cloud/manage-access/sso-overview",
                    "docs/cloud/manage-access/set-up-sso-saml-2.0",
                    "docs/cloud/manage-access/set-up-sso-okta",
                    "docs/cloud/manage-access/set-up-sso-google-workspace",
                    "docs/cloud/manage-access/set-up-sso-azure-active-directory",
                  ],
                }, // SSO
                {
                  type: "category",
                  label: "OAuth with data platforms",
                  items: [
                    "docs/cloud/manage-access/set-up-snowflake-oauth",
                    "docs/cloud/manage-access/set-up-bigquery-oauth",
                  ],
                }, // oauth
                "docs/cloud/manage-access/audit-log",
              ],
            }, // Manage access

            {
              type: "category",
              label: "Configure Git",
              items: [
                "docs/cloud/git/connect-github",
                "docs/cloud/git/connect-gitlab",
                {
                  type: "category",
                  label: "Azure DevOps",
                  items: [
                    "docs/cloud/git/connect-azure-devops",
                    "docs/cloud/git/setup-azure",
                    "docs/cloud/git/authenticate-azure",
                  ],
                },
                "docs/cloud/git/import-a-project-by-git-url",
              ],
            }, // Supported Git providers

            {
              type: "category",
              label: "Multi-tenant PrivateLink",
              items: [
                "docs/cloud/privatelink/about-privatelink",
                "docs/cloud/privatelink/snowflake-privatelink",
                "docs/cloud/privatelink/redshift-privatelink",
                "docs/cloud/privatelink/databricks-privatelink",
              ],
            }, // PrivateLink
            "docs/cloud/develop-in-the-cloud",
            "docs/cloud/dbt-cloud-tips",
          ],
        },
        {
          type: "category",
          label: "dbt Core",
          collapsed: true,
          items: [
            "docs/core/installation",
            "docs/core/about-the-cli",
            "docs/core/homebrew-install",
            "docs/core/pip-install",
            "docs/core/docker-install",
            "docs/core/source-install",
            "docs/core/connection-profiles",
          ],
        },
        "docs/running-a-dbt-project/run-your-dbt-projects",
      ],
    },
    {
      type: "category",
      label: "Build dbt projects",
      collapsed: true,
      items: [
        "docs/build/projects",
        {
          type: "category",
          label: "Build your DAG",
          collapsed: true,
          items: [
            "docs/build/sources",
            {
              type: "category",
              label: "Models",
              items: [
                "docs/build/models",
                "docs/build/sql-models",
                "docs/build/python-models",
              ],
            },
            "docs/build/seeds",
            "docs/build/snapshots",
            "docs/build/exposures",
            "docs/build/metrics",
            "docs/build/groups",
          ],
        },
        {
          type: "category",
          label: "Enhance your models",
          collapsed: true,
          items: [
            "docs/build/tests",
            "docs/build/materializations",
            "docs/build/incremental-models",
          ],
        },
        {
          type: "category",
          label: "Enhance your code",
          collapsed: true,
          items: [
            "docs/build/jinja-macros",
            "docs/build/project-variables",
            "docs/build/environment-variables",
            "docs/build/packages",
            "docs/build/analyses",
            "docs/build/hooks-operations",
          ],
        },
        {
          type: "category",
          label: "Organize your outputs",
          collapsed: true,
          items: [
            "docs/build/custom-schemas",
            "docs/build/custom-databases",
            "docs/build/custom-aliases",
            "docs/build/custom-target-names",
          ],
        },
        //"docs/building-a-dbt-project/dont-nest-your-curlies",
        //"docs/building-a-dbt-project/archival",
      ],
    },
    {
      type: "category",
      label: "Deploy dbt jobs",
      collapsed: true,
      link: { type: "doc", id: "docs/deploy/deployments" },
      items: [
        {
          type: "category",
          label: "Deploy with dbt Cloud",
          link: { type: "doc", id: "docs/deploy/dbt-cloud-job" },
          items: [
            "docs/deploy/artifacts",
            "docs/deploy/job-commands",
            "docs/deploy/job-triggers",
            "docs/deploy/job-notifications",
            "docs/deploy/webhooks",
            "docs/deploy/source-freshness",
            "docs/deploy/dashboard-status-tiles",
            "docs/deploy/cloud-ci-job",
          ],
        },
        "docs/deploy/deployment-tools",
        "docs/deploy/project-state",
      ],
    }, // end of "Deploy dbt jobs"
    {
      type: "category",
      label: "Collaborate with others",
      items: [
        {
          type: "category",
          label: "Environments",
          items: [
            "docs/collaborate/environments/environments-in-dbt",
            "docs/collaborate/environments/dbt-cloud-environments",
            "docs/collaborate/environments/dbt-core-environments",
          ],
        },
        {
          type: "category",
          label: "Git version control",
          items: [
            "docs/collaborate/git-version-control",
            "docs/collaborate/git/version-control-basics",
            "docs/collaborate/git/managed-repository",
            "docs/collaborate/git/pr-template",
            "docs/collaborate/git/merge-conflicts",
          ],
        },
        {
          type: "category",
          label: "Document your dbt projects",
          items: [
            "docs/collaborate/documentation",
            "docs/collaborate/build-and-view-your-docs",
          ],
        },
        {
          type: "category",
          label: "Maintain, share, and govern mature dbt models",
          collapsed: true,
          link: { type: "doc", id: "docs/collaborate/govern/about-model-governance" },
          items: [
            "docs/collaborate/govern/model-access",
            "docs/collaborate/govern/model-contracts",
            "docs/collaborate/govern/model-versions",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Use the dbt Semantic Layer",
      collapsed: true,
      items: [
        "docs/use-dbt-semantic-layer/quickstart-semantic-layer",
        "docs/use-dbt-semantic-layer/dbt-semantic-layer",
        "docs/use-dbt-semantic-layer/setup-dbt-semantic-layer",
        "docs/use-dbt-semantic-layer/avail-sl-integrations",
      ],
    },
    {
      type: "category",
      label: "dbt APIs",
      collapsed: true,
      items: [
        "docs/dbt-cloud-apis/overview",
        {
          type: "category",
          label: "Authentication",
          items: [
            "docs/dbt-cloud-apis/user-tokens",
            "docs/dbt-cloud-apis/service-tokens",
          ],
        },
        "docs/dbt-cloud-apis/admin-cloud-api",
        {
          type: "category",
          label: "Metadata API",
          items: [
            "docs/dbt-cloud-apis/metadata-api",
            "docs/dbt-cloud-apis/metadata-use-case-guides",
            "docs/dbt-cloud-apis/access-metadata-api",
            "docs/dbt-cloud-apis/metadata-querying",
            {
              type: "category",
              label: "Schema",
              items: [
                "docs/dbt-cloud-apis/metadata-schema-model",
                "docs/dbt-cloud-apis/metadata-schema-models",
                "docs/dbt-cloud-apis/metadata-schema-modelByEnv",
                "docs/dbt-cloud-apis/metadata-schema-metric",
                "docs/dbt-cloud-apis/metadata-schema-metrics",
                "docs/dbt-cloud-apis/metadata-schema-source",
                "docs/dbt-cloud-apis/metadata-schema-sources",
                "docs/dbt-cloud-apis/metadata-schema-seed",
                "docs/dbt-cloud-apis/metadata-schema-seeds",
                "docs/dbt-cloud-apis/metadata-schema-snapshots",
                "docs/dbt-cloud-apis/metadata-schema-test",
                "docs/dbt-cloud-apis/metadata-schema-tests",
                "docs/dbt-cloud-apis/metadata-schema-exposure",
                "docs/dbt-cloud-apis/metadata-schema-exposures",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Available dbt versions",
      items: [
        "docs/dbt-versions/core",
        "docs/dbt-versions/upgrade-core-in-cloud",
        "docs/dbt-versions/product-lifecycles",
        {
          type: "category",
          label: "dbt Cloud Release Notes",
          items: [
            "docs/dbt-versions/dbt-cloud-release-notes",
            {
              type: "autogenerated",
              dirName: "docs/dbt-versions/release-notes",
            },
          ],
        },
      ],
    },
    "docs/dbt-support",
    {
      type: "category",
      label: "Frequently asked questions",
      link: {
        type: "generated-index",
        title: "Frequently asked questions",
        description:
          "Our Frequently Asked Questions (FAQs) section is a space where you can find an answer to some questions we get asked a lot (but that we’re happy to answer!). If you have a question or are still stuck on something, just reach out to us by emailing support@getdbt.com or clicking on the chat widget, and we’ll do our best to help out.",
        slug: "/docs/faqs",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "faqs",
        },
      ],
    },
  ],
  reference: [
    {
      type: "category",
      label: "Project configs",
      collapsed: true,
      items: [
        "reference/dbt_project.yml",
        "reference/dbtignore",
        "reference/project-configs/analysis-paths",
        "reference/project-configs/asset-paths",
        "reference/project-configs/clean-targets",
        "reference/project-configs/config-version",
        "reference/project-configs/seed-paths",
        "reference/project-configs/dispatch-config",
        "reference/project-configs/docs-paths",
        "reference/project-configs/log-path",
        "reference/project-configs/macro-paths",
        "reference/project-configs/packages-install-path",
        "reference/project-configs/name",
        "reference/project-configs/on-run-start-on-run-end",
        "reference/project-configs/profile",
        "reference/project-configs/query-comment",
        "reference/project-configs/quoting",
        "reference/project-configs/require-dbt-version",
        "reference/project-configs/snapshot-paths",
        "reference/project-configs/model-paths",
        "reference/project-configs/target-path",
        "reference/project-configs/test-paths",
        "reference/project-configs/version",
      ],
    },
    {
      type: "category",
      label: "Adapter-specific configs",
      items: [
        "reference/resource-configs/postgres-configs",
        "reference/resource-configs/bigquery-configs",
        "reference/resource-configs/redshift-configs",
        "reference/resource-configs/snowflake-configs",
        "reference/resource-configs/singlestore-configs",
        "reference/resource-configs/spark-configs",
        "reference/resource-configs/trino-configs",
        "reference/resource-configs/materialize-configs",
        "reference/resource-configs/firebolt-configs",
        "reference/resource-configs/teradata-configs",
        "reference/resource-configs/clickhouse-configs",
        "reference/resource-configs/mindsdb-configs",
        "reference/resource-configs/mssql-configs",
        "reference/resource-configs/azuresynapse-configs",
        "reference/resource-configs/greenplum-configs",
        "reference/resource-configs/impala-configs",
        "reference/resource-configs/vertica-configs",
        "reference/resource-configs/doris-configs",
        "reference/resource-configs/fal-configs",
        "reference/resource-configs/oracle-configs",
      ],
    },
    {
      type: "category",
      label: "Resource configs and properties",
      items: [
        "reference/configs-and-properties",
        {
          type: "category",
          label: "General properties",
          items: [
            "reference/resource-properties/access",
            "reference/resource-properties/columns",
            "reference/resource-properties/config",
            "reference/resource-properties/constraints",
            "reference/resource-properties/description",
            "reference/resource-properties/latest-version",
            "reference/resource-properties/include-exclude",
            "reference/resource-properties/quote",
            "reference/resource-properties/tests",
            "reference/resource-properties/versions",
          ],
        },
        {
          type: "category",
          label: "General configs",
          items: [
            "reference/resource-configs/alias",
            "reference/resource-configs/database",
            "reference/resource-configs/enabled",
            "reference/resource-configs/full_refresh",
            "reference/resource-configs/contract",
            "reference/resource-configs/grants",
            "reference/resource-configs/docs",
            "reference/resource-configs/persist_docs",
            "reference/resource-configs/pre-hook-post-hook",
            "reference/resource-configs/schema",
            "reference/resource-configs/tags",
            "reference/resource-configs/meta",
            "reference/advanced-config-usage",
            "reference/resource-configs/plus-prefix",
          ],
        },
        {
          type: "category",
          label: "For models",
          items: [
            "reference/model-properties",
            "reference/model-configs",
            "reference/resource-configs/materialized",
            "reference/resource-configs/sql_header",
          ],
        },
        {
          type: "category",
          label: "For seeds",
          items: [
            "reference/seed-properties",
            "reference/seed-configs",
            "reference/resource-configs/column_types",
            "reference/resource-configs/quote_columns",
          ],
        },
        {
          type: "category",
          label: "For snapshots",
          items: [
            "reference/snapshot-properties",
            "reference/snapshot-configs",
            "reference/resource-configs/check_cols",
            "reference/resource-configs/strategy",
            "reference/resource-configs/target_database",
            "reference/resource-configs/target_schema",
            "reference/resource-configs/unique_key",
            "reference/resource-configs/updated_at",
            "reference/resource-configs/invalidate_hard_deletes",
          ],
        },
        {
          type: "category",
          label: "For tests",
          items: [
            "reference/test-configs",
            "reference/resource-configs/fail_calc",
            "reference/resource-configs/limit",
            "reference/resource-configs/severity",
            "reference/resource-configs/store_failures",
            "reference/resource-configs/where",
          ],
        },
        {
          type: "category",
          label: "For sources",
          items: [
            "reference/source-properties",
            "reference/source-configs",
            "reference/resource-properties/database",
            "reference/resource-properties/external",
            "reference/resource-properties/freshness",
            "reference/resource-properties/identifier",
            "reference/resource-properties/loader",
            "reference/resource-properties/quoting",
            "reference/resource-properties/schema",
            "reference/resource-properties/overrides",
          ],
        },
        {
          type: "category",
          label: "For analyses",
          items: ["reference/analysis-properties"],
        },
        {
          type: "category",
          label: "For exposures",
          items: ["reference/exposure-properties"],
        },
        {
          type: "category",
          label: "For macros",
          items: [
            "reference/macro-properties",
            "reference/resource-properties/argument-type",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Commands",
      items: [
        "reference/dbt-commands",
        {
          type: "category",
          label: "Node selection",
          items: [
            "reference/node-selection/syntax",
            "reference/node-selection/graph-operators",
            "reference/node-selection/set-operators",
            "reference/node-selection/exclude",
            "reference/node-selection/methods",
            "reference/node-selection/putting-it-together",
            "reference/node-selection/yaml-selectors",
            "reference/node-selection/test-selection-examples",
            "reference/node-selection/defer",
            "reference/node-selection/state-comparison-caveats",
          ],
        },
        {
          type: "category",
          label: "List of commands",
          items: [
            "reference/commands/build",
            "reference/commands/clean",
            "reference/commands/cmd-docs",
            "reference/commands/compile",
            "reference/commands/debug",
            "reference/commands/deps",
            "reference/commands/init",
            "reference/commands/list",
            "reference/commands/parse",
            "reference/commands/rpc",
            "reference/commands/run",
            "reference/commands/run-operation",
            "reference/commands/seed",
            "reference/commands/show",
            "reference/commands/snapshot",
            "reference/commands/source",
            "reference/commands/test",
          ],
        },
        "reference/global-cli-flags",
        "reference/global-configs",
        "reference/events-logging",
        "reference/exit-codes",
        "reference/parsing",
        "reference/programmatic-invocations",
      ],
    },
    {
      type: "category",
      label: "Jinja Reference",
      items: [
        {
          type: "category",
          label: "dbt Jinja functions",
          link: {
            type: "generated-index",
            title: "dbt Jinja functions",
            description:
              "In addition to the standard Jinja library, we've added additional functions and variables to the Jinja context that are useful when working with a dbt project.",
            slug: "/reference/dbt-jinja-functions",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "reference/dbt-jinja-functions",
            },
          ],
        },
        "reference/dbt-classes",
      ],
    },
    {
      type: "category",
      label: "Setups (CLI only)",
      items: [
        "reference/profiles.yml",
        "reference/warehouse-setups/bigquery-setup",
        "reference/warehouse-setups/postgres-setup",
        "reference/warehouse-setups/redshift-setup",
        "reference/warehouse-setups/snowflake-setup",
        "reference/warehouse-setups/mssql-setup",
        "reference/warehouse-setups/trino-setup",
        "reference/warehouse-setups/singlestore-setup",
        "reference/warehouse-setups/spark-setup",
        "reference/warehouse-setups/databricks-setup",
        "reference/warehouse-setups/hive-setup",
        "reference/warehouse-setups/exasol-setup",
        "reference/warehouse-setups/oracle-setup",
        "reference/warehouse-setups/azuresynapse-setup",
        "reference/warehouse-setups/dremio-setup",
        "reference/warehouse-setups/clickhouse-setup",
        "reference/warehouse-setups/materialize-setup",
        "reference/warehouse-setups/rockset-setup",
        "reference/warehouse-setups/firebolt-setup",
        "reference/warehouse-setups/teradata-setup",
        "reference/warehouse-setups/athena-setup",
        "reference/warehouse-setups/vertica-setup",
        "reference/warehouse-setups/tidb-setup",
        "reference/warehouse-setups/glue-setup",
        "reference/warehouse-setups/mindsdb-setup",
        "reference/warehouse-setups/greenplum-setup",
        "reference/warehouse-setups/impala-setup",
        "reference/warehouse-setups/layer-setup",
        "reference/warehouse-setups/iomete-setup",
        "reference/warehouse-setups/duckdb-setup",
        "reference/warehouse-setups/sqlite-setup",
        "reference/warehouse-setups/mysql-setup",
        "reference/warehouse-setups/ibmdb2-setup",
        "reference/warehouse-setups/alloydb-setup",
        "reference/warehouse-setups/doris-setup",
        "reference/warehouse-setups/infer-setup",
        "reference/warehouse-setups/databend-setup",
        "reference/warehouse-setups/fal-setup",
        "reference/warehouse-setups/decodable-setup",
      ],
    },
    {
      type: "category",
      label: "dbt Artifacts",
      items: [
        "reference/artifacts/dbt-artifacts",
        "reference/artifacts/manifest-json",
        "reference/artifacts/run-results-json",
        "reference/artifacts/catalog-json",
        "reference/artifacts/sources-json",
        "reference/artifacts/other-artifacts",
      ],
    },
    {
      type: "category",
      label: "Database Permissions",
      items: ["reference/snowflake-permissions"],
    },
  ],
  guides: [
    {
      type: "category",
      label: "Best practices",
      link: {
        type: "generated-index",
        title: "Best practice guides",
        description:
          "Learn how dbt Labs approaches building projects through our current viewpoints on structure, style, and setup.",
        slug: "/guides/best-practices",
      },
      items: [
        {
          type: "category",
          label: "How we structure our dbt projects",
          link: {
            type: "doc",
            id: "guides/best-practices/how-we-structure/1-guide-overview",
          },
          items: [
            "guides/best-practices/how-we-structure/2-staging",
            "guides/best-practices/how-we-structure/3-intermediate",
            "guides/best-practices/how-we-structure/4-marts",
            "guides/best-practices/how-we-structure/5-the-rest-of-the-project",
          ],
        },
        {
          type: "category",
          label: "Materializations best practices",
          link: {
            type: "doc",
            id: "guides/best-practices/materializations/materializations-guide-1-guide-overview",
          },
          items: [
            "guides/best-practices/materializations/materializations-guide-2-available-materializations",
            "guides/best-practices/materializations/materializations-guide-3-configuring-materializations",
            "guides/best-practices/materializations/materializations-guide-4-incremental-models",
            "guides/best-practices/materializations/materializations-guide-5-best-practices",
            "guides/best-practices/materializations/materializations-guide-6-examining-builds",
            "guides/best-practices/materializations/materializations-guide-7-conclusion",
          ],
        },
        {
          type: "category",
          label: "dbt Cloud Environment best practices",
          link: {
            type: "doc",
            id: "guides/best-practices/environment-setup/1-env-guide-overview",
          },
          items: [
            "guides/best-practices/environment-setup/2-one-deployment-environment",
            "guides/best-practices/environment-setup/3-many-deployment-environments",
          ],
        },
        "guides/best-practices/debugging-errors",
        "guides/best-practices/writing-custom-generic-tests",
      ],
    },
    {
      type: "category",
      label: "Orchestration",
      link: {
        type: "generated-index",
        title: "Orchestration guides",
        description:
          "Learn how to orchestrate your data transformations in dbt, using dbt Cloud, a variety of popular tools, or both working together.",
        slug: "/guides/orchestration",
      },
      items: [
        {
          type: "category",
          label: "Airflow and dbt Cloud",
          link: {
            type: "doc",
            id: "guides/orchestration/airflow-and-dbt-cloud/1-airflow-and-dbt-cloud",
          },
          items: [
            "guides/orchestration/airflow-and-dbt-cloud/2-setting-up-airflow-and-dbt-cloud",
            "guides/orchestration/airflow-and-dbt-cloud/3-running-airflow-and-dbt-cloud",
            "guides/orchestration/airflow-and-dbt-cloud/4-airflow-and-dbt-cloud-faqs",
          ],
        },
        {
          type: "category",
          label: "Customizing CI/CD",
          link: {
            type: "doc",
            id: "guides/orchestration/custom-cicd-pipelines/1-cicd-background",
          },
          items: [
            "guides/orchestration/custom-cicd-pipelines/2-lint-on-push",
            "guides/orchestration/custom-cicd-pipelines/3-dbt-cloud-job-on-merge",
            "guides/orchestration/custom-cicd-pipelines/4-dbt-cloud-job-on-pr",
            "guides/orchestration/custom-cicd-pipelines/5-something-to-consider",  
          ],
        },
        {
          type: "category",
          label: "Webhooks with dbt Cloud and SaaS apps",
          link: {
            type: "generated-index",
            title: "Use dbt Cloud's webhooks with other SaaS apps",
            description:
              "Learn how to use webhooks to trigger actions in other tools by using Zapier or a serverless platform.",
            slug: "/guides/orchestration/webhooks",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "guides/orchestration/webhooks",
            },
          ],
        },
        "guides/orchestration/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs",
      ],
    },
    {
      type: "category",
      label: "Migration",
      items: [
        {
          type: "category",
          label: "Versions",
          link: {
            type: "generated-index",
            title: "Version migration guides",
            description:
              "Learn how to upgrade to the latest version of dbt Core.",
            slug: "/guides/migration/versions",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "guides/migration/versions",
            },
          ],
        },
        {
          type: "category",
          label: "Tools",
          link: {
            type: "generated-index",
            title: "Tool migration guides",
            description:
              "Learn how to migrate to dbt from other tools and platforms.",
            slug: "/guides/migration/tools",
          },
          items: [
            {
              type: "category",
              label: "Migrating from stored procedures",
              link: {
                type: "doc",
                id: "guides/migration/tools/migrating-from-stored-procedures/1-migrating-from-stored-procedures",
              },
              items: [
                "guides/migration/tools/migrating-from-stored-procedures/2-inserts",
                "guides/migration/tools/migrating-from-stored-procedures/3-updates",
                "guides/migration/tools/migrating-from-stored-procedures/4-deletes",
                "guides/migration/tools/migrating-from-stored-procedures/5-merges",
                "guides/migration/tools/migrating-from-stored-procedures/6-migrating-from-stored-procedures-conclusion",
              ],
            },
            "guides/migration/tools/migrating-from-spark-to-databricks",
            "guides/migration/tools/refactoring-legacy-sql"
          ],
        },
      ],
    },
    {
      type: "category",
      label: "dbt Ecosystem",
      link: {
        type: "generated-index",
        title: "dbt Ecosystem guides",
        description: "Learn about the dbt ecosystem and how to build with dbt.",
        slug: "/guides/dbt-ecosystem/",
      },
      items: [
        {
          type: "category",
          label: "Adapter development",
          link: {
            type: "doc",
            id: "guides/dbt-ecosystem/adapter-development/1-what-are-adapters",
          },
          items: [
            "guides/dbt-ecosystem/adapter-development/1-what-are-adapters",
            "guides/dbt-ecosystem/adapter-development/2-prerequisites-for-a-new-adapter",
            "guides/dbt-ecosystem/adapter-development/3-building-a-new-adapter",
            "guides/dbt-ecosystem/adapter-development/4-testing-a-new-adapter",
            "guides/dbt-ecosystem/adapter-development/5-documenting-a-new-adapter",
            "guides/dbt-ecosystem/adapter-development/6-promoting-a-new-adapter",
            "guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter",
          ],
        },
        {
          type: "category",
          label: "dbt Python Snowpark",
          link: {
            type: "doc",
            id: "guides/dbt-ecosystem/dbt-python-snowpark/1-overview-dbt-python-snowpark",
          },
          items: [
            "guides/dbt-ecosystem/dbt-python-snowpark/2-snowflake-configuration",
            "guides/dbt-ecosystem/dbt-python-snowpark/3-connect-to-data-source",
            "guides/dbt-ecosystem/dbt-python-snowpark/4-configure-dbt",
            "guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name",
            "guides/dbt-ecosystem/dbt-python-snowpark/6-foundational-structure",
            "guides/dbt-ecosystem/dbt-python-snowpark/7-folder-structure",
            "guides/dbt-ecosystem/dbt-python-snowpark/8-sources-and-staging",
            "guides/dbt-ecosystem/dbt-python-snowpark/9-sql-transformations",
            "guides/dbt-ecosystem/dbt-python-snowpark/10-python-transformations",
            "guides/dbt-ecosystem/dbt-python-snowpark/11-machine-learning-prep",
            "guides/dbt-ecosystem/dbt-python-snowpark/12-machine-learning-training-prediction",
            "guides/dbt-ecosystem/dbt-python-snowpark/13-testing",
            "guides/dbt-ecosystem/dbt-python-snowpark/14-documentation",
            "guides/dbt-ecosystem/dbt-python-snowpark/15-deployment",
          ],
        },
        {
          type: "category",
          label: "Databricks and dbt",
          link: {
            type: "doc",
            id: "guides/dbt-ecosystem/databricks-guides/how-to-set-up-your-databricks-dbt-project",
          },
          items: [
            "guides/dbt-ecosystem/databricks-guides/how-to-set-up-your-databricks-dbt-project",
            "guides/dbt-ecosystem/databricks-guides/dbt-unity-catalog-best-practices",
            "guides/dbt-ecosystem/databricks-guides/how_to_optimize_dbt_models_on_databricks",

          ],
        },
        "guides/dbt-ecosystem/sl-partner-integration-guide",
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: ["guides/advanced/creating-new-materializations",
        "guides/advanced/using-jinja",
      ],
    },
    {
      type: "category",
      label: "Legacy",
      items: [
        "guides/legacy/debugging-schema-names",
        "guides/legacy/getting-help",
        "guides/legacy/best-practices",
        "guides/legacy/building-packages",
        "guides/legacy/videos",
      ],
    },
  ],
  community: [
    {
      type: "doc",
      id: "community/join",
    },
    {
      type: "category",
      label: "Contributing",
      link: {
        type: "doc",
        id: "community/contribute",
      },
      items: [
        {
          type: "doc",
          label: "Become a contributor",
          id: "community/contribute",
        },
        "community/contributing/contributing-writing",
        "community/contributing/contributing-coding",
        "community/contributing/contributing-online-community",
        "community/contributing/contributing-realtime-events",
      ],
    },
    {
      type: "link",
      label: "Community Forum",
      href: "/community/forum",
    },
    {
      type: "link",
      label: "Events",
      href: "/community/events",
    },
    {
      type: "category",
      label: "Additional resources",
      items: [
        "community/resources/viewpoint",
        "community/resources/code-of-conduct",
        "community/resources/slack-rules-of-the-road",
        "community/resources/maintaining-a-channel",
        "community/resources/vendor-guidelines",
        "community/resources/forum-guidelines",
        "community/resources/organizing-inclusive-events",
        "community/resources/oss-expectations",
        "community/resources/oss-projects",
        "community/resources/contributor-license-agreements",
        "community/resources/speaking-at-a-meetup",
      ],
    },
  ],
  Glossary: [
    {
      type: "category",
      label: "Analytics Engineering Glossary",
      link: {
        type: "generated-index",
        title: "Analytics Engineering Glossary",
        description:
          "The Analytics Engineering Glossary is a living collection of terms & concepts commonly used in the data industry. You can use and contribute to this resource to educate yourself, your team, and your stakeholders.",
        slug: "/glossary",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "terms",
        },
      ],
    },
  ],
  SQLReference: [
    {
      type: "category",
      label: "SQL Reference",
      link: {
        type: "generated-index",
        title: "SQL Reference",
        description:
          "The SQL Reference is a collection of SQL functions and keywords that you can use during your daily data work.",
        slug: "/sql-reference",
      },
      items: [
        {
          type: "category",
          label: "Statements",
          items: [
            "sql-reference/statements/select",
            "sql-reference/statements/from",
            "sql-reference/statements/case",
            "sql-reference/statements/group-by",
            "sql-reference/statements/distinct",
          ],
        },
        {
          type: "category",
          label: "Aggregate Functions",
          items: [
            "sql-reference/aggregate-functions/avg",
            "sql-reference/aggregate-functions/count",
            "sql-reference/aggregate-functions/max",
            "sql-reference/aggregate-functions/min",
            "sql-reference/aggregate-functions/round",
            "sql-reference/aggregate-functions/sum",
            "sql-reference/aggregate-functions/array-agg",
          ],
        },
        {
          type: "category",
          label: "Clauses",
          items: [
            "sql-reference/clauses/where",
            "sql-reference/clauses/having",
            "sql-reference/clauses/limit",
            "sql-reference/clauses/order-by",
          ],
        },
        {
          type: "category",
          label: "Date Functions",
          items: [
            "sql-reference/date-functions/dateadd",
            "sql-reference/date-functions/datediff",
            "sql-reference/date-functions/datepart",
            "sql-reference/date-functions/datetrunc",
          ],
        },
        {
          type: "category",
          label: "String Functions",
          items: [
            "sql-reference/string-functions/upper",
            "sql-reference/string-functions/lower",
            "sql-reference/string-functions/concat",
            "sql-reference/string-functions/trim",
          ],
        },
        {
          type: "category",
          label: "Window Functions",
          items: [
            "sql-reference/window-functions/rank",
            "sql-reference/window-functions/row-number",
          ],
        },
        {
          type: "category",
          label: "Operators",
          items: [
            "sql-reference/operators/between",
            "sql-reference/operators/in",
            "sql-reference/operators/or",
            "sql-reference/operators/ilike",
            "sql-reference/operators/like",
            "sql-reference/operators/and",
            "sql-reference/operators/not",
            "sql-reference/operators/any-all",
          ],
        },
        {
          type: "category",
          label: "Joins",
          items: [
            "sql-reference/joins/inner-join",
            "sql-reference/joins/outer-join",
            "sql-reference/joins/self-join",
            "sql-reference/joins/cross-join",
            "sql-reference/joins/left-join",
            "sql-reference/joins/right-join",
          ],
        },
        {
          type: "category",
          label: "Data Types",
          items: [
            "sql-reference/data-type/data-types",
            "sql-reference/data-type/strings",
          ],
        },
        {
          type: "category",
          label: "Other",
          items: ["sql-reference/other/cast", "sql-reference/other/comments"],
        },
      ],
    },
  ],
};

module.exports = sidebarSettings;