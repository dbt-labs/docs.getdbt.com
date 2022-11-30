const sidebarSettings = {
  docs: [
    "docs/introduction",
    "docs/supported-data-platforms",
    {
      type: "category",
      label: "Get started with dbt",
      collapsed: true,
      items: [
        "docs/get-started/getting-started/overview",
        {
          type: "category",
          label: "Get started with dbt Cloud",
          collapsed: true,
          items: [
            "docs/get-started/getting-started/set-up-dbt-cloud",
            {
              type: "category",
              label: "Getting set up",
              items: [
                "docs/get-started/getting-started/getting-set-up/setting-up-bigquery",
                "docs/get-started/getting-started/getting-set-up/setting-up-databricks",
                "docs/get-started/getting-started/getting-set-up/setting-up-redshift",
                "docs/get-started/getting-started/getting-set-up/setting-up-snowflake",
              ],
            },
            {
              type: "category",
              label: "Building your first project",

              items: [
                "docs/get-started/getting-started/building-your-first-project/build-your-first-models",
                "docs/get-started/getting-started/building-your-first-project/test-and-document-your-project",
                "docs/get-started/getting-started/building-your-first-project/schedule-a-job",
              ],
            },
            {
              type: "category",
              label: "Learning more",
              items: [
                "docs/get-started/learning-more/using-jinja",
                "docs/get-started/learning-more/refactoring-legacy-sql",
              ],
            },
            "docs/get-started/dbt-cloud-features",
            "docs/get-started/connect-your-database",
            "docs/get-started/develop-in-the-cloud",
            "docs/get-started/dbt-cloud-tips",
          ],
        },
        {
          type: "category",
          label: "Get started with dbt Core",
          collapsed: true,
          items: [
            "docs/get-started/getting-started-dbt-core",
            {
              type: "category",
              label: "Install dbt Core",
              collapsed: true,
              items: [
                "docs/get-started/installation",
                "docs/get-started/homebrew-install",
                "docs/get-started/pip-install",
                "docs/get-started/docker-install",
                "docs/get-started/source-install",
              ],
            },
            "docs/get-started/about-the-cli",
            "docs/get-started/connection-profiles",
          ],
        },
        "docs/get-started/run-your-dbt-projects",
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
        {
          type: "category",
          label: "Advanced workflows",
          collapsed: true,
          items: [
            {
              type: "category",
              label: "dbt Cloud APIs",
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
            "docs/build/hooks-operations",
          ],
        },
        //"docs/building-a-dbt-project/dont-nest-your-curlies",
        //"docs/building-a-dbt-project/archival",
      ],
    },
    {
      type: "category",
      label: "Deploy dbt projects",
      collapsed: true,
      items: [
        "docs/deploy/deployments",
        "docs/deploy/regions",
        {
          type: "category",
          label: "dbt Cloud deploy options",
          items: [
            "docs/deploy/architecture",
            "docs/deploy/single-tenant",
            "docs/deploy/multi-tenant",
          ],
        },
        {
          type: "category",
          label: "dbt Cloud production jobs",
          items: [
            "docs/deploy/job-triggers",
            "docs/deploy/job-notifications",
            "docs/deploy/source-freshness",
            "docs/deploy/dashboard-status-tiles",
          ],
        },
        "docs/deploy/cloud-ci-job",
      ],
    },
    {
      type: "category",
      label: "Collaborate with others",
      items: [
        "docs/collaborate/environments",
        {
          type: "category",
          label: "Git version control",
          items: [
            "docs/collaborate/git-version-control",
            "docs/collaborate/git/version-control-basics",
            "docs/collaborate/git/managed-repository",
            "docs/collaborate/git/pr-template",
            "docs/collaborate/git/resolve-merge-conflicts",
            {
              type: "category",
              label: "Supported git providers",
              items: [
                "docs/collaborate/git/connect-github",
                "docs/collaborate/git/connect-gitlab",
                {
                  type: "category",
                  label: "Azure DevOps",
                  items: [
                    "docs/collaborate/git/connect-azure-devops",
                    "docs/collaborate/git/setup-azure",
                    "docs/collaborate/git/authenticate-azure",
                  ],
                },
                "docs/collaborate/git/import-a-project-by-git-url",
              ],
            },
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
          label: "Manage access",
          items: [
            "docs/collaborate/manage-access/about-access",
            "docs/collaborate/manage-access/seats-and-users",
            {
              type: "category",
              label: "Permissions",
              items: [
                "docs/collaborate/manage-access/self-service-permissions",
                "docs/collaborate/manage-access/enterprise-permissions",
              ],
            },

            {
              type: "category",
              label: "Single sign-on",
              items: [
                "docs/collaborate/manage-access/sso-overview",
                "docs/collaborate/manage-access/set-up-sso-saml-2.0",
                "docs/collaborate/manage-access/set-up-sso-google-workspace",
                "docs/collaborate/manage-access/set-up-sso-azure-active-directory",
              ],
            }, // SSO
            {
              type: "category",
              label: "OAuth with data platforms",
              items: [
                "docs/collaborate/manage-access/set-up-snowflake-oauth",
                "docs/collaborate/manage-access/set-up-bigquery-oauth",
              ],
            }, // oauth
            "docs/collaborate/manage-access/audit-log",
          ],
        }, // Manage access
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
  "dbt Cloud": [
    {
      type: "category",
      label: "Overview",
      link: { type: "doc", id: "docs/dbt-cloud/cloud-overview" },
      items: [],
    },
    {
      type: "category",
      label: "dbt Cloud IDE",
      items: ["docs/dbt-cloud/cloud-ide/viewing-docs-in-the-ide"],
    },
    {
      type: "category",
      label: "Configuring dbt Cloud",
      items: [
        "docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version",
      ],
    },
    {
      type: "category",
      label: "Using dbt Cloud",
      link: {
        type: "generated-index",
        title: "Using dbt Cloud",
        description: "Learn how you can use dbt Cloud.",
        slug: "/docs/dbt-cloud",
      },
      items: [
        "docs/dbt-cloud/using-dbt-cloud/artifacts",
        "docs/dbt-cloud/using-dbt-cloud/cloud-model-timing-tab",
      ],
    },
  ],
  reference: [
    {
      type: "category",
      label: "Project configs",
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
        "reference/resource-configs/materialize-configs",
        "reference/resource-configs/firebolt-configs",
        "reference/resource-configs/teradata-configs",
        "reference/resource-configs/clickhouse-configs",
        "reference/resource-configs/mindsdb-configs",
        "reference/resource-configs/mssql-configs",
        "reference/resource-configs/azuresynapse-configs",
        "reference/resource-configs/greenplum-configs",
        "reference/resource-configs/impala-configs",
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
            "reference/resource-properties/columns",
            "reference/resource-properties/config",
            "reference/resource-properties/description",
            "reference/resource-properties/quote",
            "reference/resource-properties/tests",
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
    ,
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
            "guides/orchestration/custom-cicd-pipelines/4-something-to-consider",
          ],
        },
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
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: [
        {
          type: "category",
          label: "Adapter development",
          items: [
            "guides/advanced/adapter-development/1-what-are-adapters",
            "guides/advanced/adapter-development/2-prerequisites-for-a-new-adapter",
            "guides/advanced/adapter-development/3-building-a-new-adapter",
            "guides/advanced/adapter-development/4-testing-a-new-adapter",
            "guides/advanced/adapter-development/5-documenting-a-new-adapter",
            "guides/advanced/adapter-development/6-promoting-a-new-adapter",
            "guides/advanced/adapter-development/7-verifying-a-new-adapter",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Legacy",
      items: [
        "guides/legacy/debugging-errors",
        "guides/legacy/debugging-schema-names",
        "guides/legacy/getting-help",
        "guides/legacy/best-practices",
        "guides/legacy/writing-custom-generic-tests",
        "guides/legacy/building-packages",
        "guides/legacy/creating-new-materializations",
        "guides/legacy/understanding-state",
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
};

module.exports = sidebarSettings;
