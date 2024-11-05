---
title: "dbt Cloud release notes"
description: "dbt Cloud release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt Cloud release notes"
pagination_next: null
pagination_prev: null
---

dbt Cloud release notes for recent and historical changes. Release notes fall into one of the following categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC)\* environments

\* The official release date for this new format of release notes is May 15th, 2024. Historical release notes for prior dates may not reflect all available features released earlier this year or their tenancy availability.

## October 2024
<Expandable alt_header="Coalesce 2024 announcements">

  Documentation for new features and functionality announced at Coalesce 2024:

  - Iceberg table support for [Snowflake](https://docs.getdbt.com/reference/resource-configs/snowflake-configs#iceberg-table-format)
  - [Athena](https://docs.getdbt.com/reference/resource-configs/athena-configs) and [Teradata](https://docs.getdbt.com/reference/resource-configs/teradata-configs) adapter support in dbt Cloud
  - dbt Cloud now hosted on [Azure](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses)
  - Get comfortable with [Versionless dbt Cloud](https://docs.getdbt.com/docs/dbt-versions/versionless-cloud)
  - Scalable [microbatch incremental models](https://docs.getdbt.com/docs/build/incremental-microbatch)
  - Advanced CI [features](https://docs.getdbt.com/docs/deploy/advanced-ci)
  - [Linting with CI jobs](https://docs.getdbt.com/docs/deploy/continuous-integration#sql-linting)
  - dbt Assist is now [dbt Copilot](https://docs.getdbt.com/docs/cloud/dbt-copilot)
  - Developer blog on [Snowflake Feature Store and dbt: A bridge between data pipelines and ML](https://docs.getdbt.com/blog/snowflake-feature-store)
  - New [Quickstart for dbt Cloud CLI](https://docs.getdbt.com/guides/dbt-cloud-cli?step=1)
  - [Auto-exposures with Tableau](https://docs.getdbt.com/docs/collaborate/auto-exposures)
  - Semantic Layer integration with [Excel desktop and M365](https://docs.getdbt.com/docs/cloud-integrations/semantic-layer/excel)
  - [Data health tiles](https://docs.getdbt.com/docs/collaborate/data-tile)
  - [Semantic Layer and Cloud IDE integration](https://docs.getdbt.com/docs/build/metricflow-commands#metricflow-commands)
  - Query history in [Explorer](https://docs.getdbt.com/docs/collaborate/model-query-history#view-query-history-in-explorer)
  - Semantic Layer Metricflow improvements, including [improved granularity and custom calendar](https://docs.getdbt.com/docs/build/metricflow-time-spine#custom-calendar) 
  - [Python SDK](https://docs.getdbt.com/docs/dbt-cloud-apis/sl-python) is now generally available 

</Expandable>
 
- **Behavior change:** [Multi-factor authentication](/docs/cloud/manage-access/mfa) is now enforced on all users who log in with username and password credentials. 
- **Enhancement**: The dbt Semantic Layer JDBC now allows users to paginate `semantic_layer.metrics()` and `semantic_layer.dimensions()` for metrics and dimensions using `page_size` and `page_number` parameters. Refer to [Paginate metadata calls](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) for more information.
- **Enhancement**: The dbt Semantic Layer JDBC now allows you to filter your metrics to include only those that contain a specific substring, using the `search` parameter. If no substring is provided, the query returns all metrics. Refer to [Fetch metrics by substring search](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) for more information.
- **Fix**: The [dbt Semantic Layer Excel integration](/docs/cloud-integrations/semantic-layer/excel) now correctly surfaces errors when a query fails to execute. Previously, it was not clear why a query failed to run.
- **Fix:** Previously, POST requests to the Jobs API with invalid `cron` strings would return HTTP response status code 500s but would update the underlying entity. Now, POST requests to the Jobs API with invalid `cron` strings will result in status code 400s, without the underlying entity being updated.
- **Fix:** Fixed an issue where the `Source` view page in dbt Explorer did not correctly display source freshness status if older than 30 days.
- **Fix:** The UI now indicates when the description of a model is inherited from a catalog comment.
- **Behavior change:** User API tokens have been deprecated. Update to [personal access tokens](/docs/dbt-cloud-apis/user-tokens) if you have any still in use.
- **New**: The dbt Cloud IDE supports signed commits for Git, available for Enterprise plans. You can sign your Git commits when pushing them to the repository to prevent impersonation and enhance security. Supported Git providers are GitHub and GitLab. Refer to [Git commit signing](/docs/cloud/dbt-cloud-ide/git-commit-signing.md) for more information.
- **New:** With dbt Mesh, you can now enable bidirectional dependencies across your projects. Previously, dbt enforced dependencies to only go in one direction. dbt checks for cycles across projects and raises errors if any are detected. For details, refer to [Cycle detection](/docs/collaborate/govern/project-dependencies#cycle-detection). There's also the [Intro to dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) guide to help you learn more best practices. 
- **New**: The [dbt Semantic Layer Python software development kit](/docs/dbt-cloud-apis/sl-python) is now [generally available](/docs/dbt-versions/product-lifecycles). It provides users with easy access to the dbt Semantic Layer with Python and enables developers to interact with the dbt Semantic Layer APIs to query metrics/dimensions in downstream tools.
- **Enhancement**: You can now add a description to a singular data test in dbt Cloud Versionless. Use the [`description` property](/reference/resource-properties/description) to document [singular data tests](/docs/build/data-tests#singular-data-tests). You can also use [docs block](/docs/build/documentation#using-docs-blocks) to capture your test description. The enhancement will be included in upcoming dbt Core 1.9 release.
- **New**: Introducing the [microbatch incremental model strategy](/docs/build/incremental-microbatch) (beta), available in dbt Cloud Versionless and will soon be supported in dbt Core 1.9. The microbatch strategy allows for efficient, batch-based processing of large time-series datasets for improved performance and resiliency, especially when you're working with data that changes over time (like new records being added daily). To enable this feature in dbt Cloud, set the `DBT_EXPERIMENTAL_MICROBATCH` environment variable to `true` in your project.
- **New**: The dbt Semantic Layer supports custom calendar configurations in MetricFlow, available in [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Custom calendar configurations allow you to query data using non-standard time periods like `fiscal_year` or `retail_month`. Refer to [custom calendar](/docs/build/metricflow-time-spine#custom-calendar) to learn how to define these custom granularities in your MetricFlow timespine YAML configuration.
- **New**: In dbt Cloud Versionless, [Snapshots](/docs/build/snapshots) have been updated to use YAML configuration files instead of SQL snapshot blocks. This new feature simplifies snapshot management and improves performance, and will soon be released in dbt Core 1.9.
  - Who does this affect? New user on Versionless can define snapshots using the new YAML specification. Users upgrading to Versionless who use snapshots can keep their existing configuration or can choose to migrate their snapshot definitions to YAML. 
  - Users on dbt 1.8 and earlier: No action is needed; existing snapshots will continue to work as before. However, we recommend upgrading to Versionless to take advantage of the new snapshot features.
- **Behavior change:** Set [`state_modified_compare_more_unrendered_values`](/reference/global-configs/behavior-changes#source-definitions-for-state) to true to reduce false positives for `state:modified` when configs differ between `dev` and `prod` environments.
- **Behavior change:** Set the [`skip_nodes_if_on_run_start_fails`](/reference/global-configs/behavior-changes#failures-in-on-run-start-hooks) flag to `True` to skip all selected resources from running if there is a failure on an `on-run-start` hook.
- **Enhancement**: In dbt Cloud Versionless, snapshots defined in SQL files can now use `config` defined in `schema.yml` YAML files. This update resolves the previous limitation that required snapshot properties to be defined exclusively in `dbt_project.yml` and/or a `config()` block within the SQL file. This will also be released in dbt Core 1.9.
- **New**: In dbt Cloud Versionless, the `snapshot_meta_column_names` config allows for customizing the snapshot metadata columns. This feature allows an organization to align these automatically-generated column names with their conventions, and will be included in the upcoming dbt Core 1.9 release.
- **Enhancement**: dbt Cloud versionless began inferring a model's `primary_key` based on configured data tests and/or constraints within `manifest.json`. The inferred `primary_key` is visible in dbt Explorer and utilized by the dbt Cloud [compare changes](/docs/deploy/run-visibility#compare-tab) feature. This will also be released in dbt Core 1.9. Read about the [order dbt infers columns can be used as primary key of a model](https://github.com/dbt-labs/dbt-core/blob/7940ad5c7858ff11ef100260a372f2f06a86e71f/core/dbt/contracts/graph/nodes.py#L534-L541). 
- **New:** dbt Explorer now includes trust signal icons, which is currently available as a [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Trust signals offer a quick, at-a-glance view of data health when browsing your dbt models in Explorer. These icons indicate whether a model is **Healthy**, **Caution**, **Degraded**, or **Unknown**. For accurate health data, ensure the resource is up-to-date and has had a recent job run. Refer to [Trust signals](/docs/collaborate/explore-projects#trust-signals-for-resources) for more information. 
- **New:** Auto exposures are now available in Preview in dbt Cloud. Auto-exposures helps users understand how their models are used in downstream analytics tools to inform investments and reduce incidents. It imports and auto-generates exposures based on Tableau dashboards, with user-defined curation. To learn more, refer to [Auto exposures](/docs/collaborate/auto-exposures).


## September 2024

- **Fix**: MetricFlow updated `get_and_expire` to replace the unsupported `GETEX` command with a `GET` and conditional expiration, ensuring compatibility with Azure Redis 6.0.
- **Enhancement**: The [dbt Semantic Layer Python SDK](/docs/dbt-cloud-apis/sl-python) now supports `TimeGranularity` custom grain for metrics. This feature allows you to define custom time granularities for metrics, such as `fiscal_year` or `retail_month`, to query data using non-standard time periods.
- **New**: Use the dbt Copilot AI engine to generate semantic model for your models, now available in beta. dbt Copilot automatically generates documentation, tests, and now semantic models based on the data in your model, . To learn more, refer to [dbt Copilot](/docs/cloud/dbt-copilot).
- **New**: Use the new recommended syntax for [defining `foreign_key` constraints](/reference/resource-properties/constraints) using `refs`, available in dbt Cloud Versionless. This will soon be released in dbt Core v1.9. This new syntax will capture dependencies and works across different environments.
- **Enhancement**: You can now run [Semantic Layer commands](/docs/build/metricflow-commands) commands in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud). The supported commands are `dbt sl list`, `dbt sl list metrics`, `dbt sl list dimension-values`, `dbt sl list saved-queries`, `dbt sl query`, `dbt sl list dimensions`, `dbt sl list entities`, and `dbt sl validate`. 
- **New**: Microsoft Excel, a dbt Semantic Layer integration, is now generally available. The integration allows you to connect to Microsoft Excel to query metrics and collaborate with your team. Available for [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26) or [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True). For more information, refer to [Microsoft Excel](/docs/cloud-integrations/semantic-layer/excel).
- **New**: [Data health tile](/docs/collaborate/data-tile) is now generally available in dbt Explorer. Data health tiles provide a quick at-a-glance view of your data quality, highlighting potential issues in your data. You can embed these tiles in your dashboards to quickly identify and address data quality issues in your dbt project.
- **New**: dbt Explorer's Model query history feature is now in Preview for dbt Cloud Enterprise customers. Model query history allows you to view the count of consumption queries for a model based on the data warehouse's query logs. This feature provides data teams insight, so they can focus their time and infrastructure spend on the worthwhile used data products. To learn more, refer to [Model query history](/docs/collaborate/model-query-history). 
- **Enhancement**: You can now use [Extended Attributes](/docs/dbt-cloud-environments#extended-attributes) and [Environment Variables](/docs/build/environment-variables) when connecting to the Semantic Layer. If you set a value directly in the Semantic Layer Credentials, it will have a higher priority than Extended Attributes. When using environment variables, the default value for the environment will be used.  If you're using exports, job environment variable overrides aren't supported yet, but they will be soon.
- **New:** There are two new [environment variable defaults](/docs/build/environment-variables#dbt-cloud-context) &mdash; `DBT_CLOUD_ENVIRONMENT_NAME` and `DBT_CLOUD_ENVIRONMENT_TYPE`.
- **New:** The [Amazon Athena warehouse connection](/docs/cloud/connect-data-platform/connect-amazon-athena) is available as a public preview for dbt Cloud accounts that have upgraded to [`versionless`](/docs/dbt-versions/versionless-cloud).

## August 2024

- **Fix:** Fixed an issue in [dbt Explorer](/docs/collaborate/explore-projects) where navigating to a consumer project from a public node resulted in displaying a random public model rather than the original selection. 
- **New**: You can now configure metrics at granularities at finer time grains, such as hour, minute, or even by the second. This is particularly useful for more detailed analysis and for datasets where high-resolution time data is required, such as minute-by-minute event tracking. Refer to [dimensions](/docs/build/dimensions) for more information about time granularity.
- **Enhancement**: Microsoft Excel now supports [saved selections](/docs/cloud-integrations/semantic-layer/excel#using-saved-selections) and [saved queries](/docs/cloud-integrations/semantic-layer/excel#using-saved-queries). Use Saved selections to save your query selections within the Excel application. The application also clears stale data in [trailing rows](/docs/cloud-integrations/semantic-layer/excel#other-settings) by default. To return your results and keep any previously selected data intact, un-select the **Clear trailing rows** option. 
- **Behavior change:** GitHub is no longer supported for OAuth login to dbt Cloud. Use a supported [SSO or OAuth provider](/docs/cloud/manage-access/sso-overview) to securely manage access to your dbt Cloud account.

## July 2024
- **Behavior change:** `target_schema` is no longer a required configuration for [snapshots](/docs/build/snapshots). You can now target different schemas for snapshots across development and deployment environments using the [schema config](/reference/resource-configs/schema).
- **New:** [Connections](/docs/cloud/connect-data-platform/about-connections#connection-management) are now available under **Account settings** as a global setting. Previously, they were found under **Project settings**.  This is being rolled out in phases over the coming weeks.
- **New:** Admins can now assign [environment-level permissions](/docs/cloud/manage-access/environment-permissions) to groups for specific roles.
- **New:** [Merge jobs](/docs/deploy/merge-jobs) for implementing [continuous deployment (CD)](/docs/deploy/continuous-deployment) workflows are now GA in dbt Cloud. Previously, you had to either set up a custom GitHub action or manually build the changes every time a pull request is merged.
- **New**: The ability to lint your SQL files from the dbt Cloud CLI is now available. To learn more, refer to [Lint SQL files](/docs/cloud/configure-cloud-cli#lint-sql-files).
- **Behavior change:** dbt Cloud IDE automatically adds a `--limit 100` to preview queries to avoid slow and expensive queries during development. Recently, dbt Core changed how the `limit` is applied to ensure that `order by` clauses are consistently respected. Because of this, queries that already contain a limit clause might now cause errors in the IDE previews. To address this, dbt Labs plans to provide an option soon to disable the limit from being applied. Until then, dbt Labs recommends removing the (duplicate) limit clause from your queries during previews to avoid these IDE errors.

- **Enhancement**: Introducing a revamped overview page for dbt Explorer, available in beta. It includes a new design and layout for the Explorer homepage. The new layout provides a more intuitive experience for users to navigate their dbt projects, as well as a new **Latest updates** section to view the latest changes or issues related to project resources. To learn more, refer to [Overview page](/docs/collaborate/explore-projects#overview-page).

#### dbt Semantic Layer
- **New**: Introduced the [`dbt-sl-sdk` Python software development kit (SDK)](https://github.com/dbt-labs/semantic-layer-sdk-python) Python library, which provides you with easy access to the dbt Semantic Layer with Python. It allows developers to interact with the dbt Semantic Layer APIs and query metrics and dimensions in downstream tools. Refer to the [dbt Semantic Layer Python SDK](/docs/dbt-cloud-apis/sl-python) for more information.
- **New**: Introduced Semantic validations in CI pipelines. Automatically test your semantic nodes (metrics, semantic models, and saved queries) during code reviews by adding warehouse validation checks in your CI job using the `dbt sl validate` command. You can also validate modified semantic nodes to guarantee code changes made to dbt models don't break these metrics. Refer to [Semantic validations in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) to learn about the additional commands and use cases.
- **New**: We now expose the `meta` field within the [config property](/reference/resource-configs/meta) for dbt Semantic Layer metrics in the [JDBC and GraphQL APIs](/docs/dbt-cloud-apis/sl-api-overview) under the `meta` field.
- **New**: Added a new command in the dbt Cloud CLI called `export-all`, which allows you to export multiple or all of your saved queries. Previously, you had to explicitly specify the [list of saved queries](/docs/build/metricflow-commands#list-saved-queries).
- **Enhancement**: The dbt Semantic Layer now offers more granular control by supporting multiple data platform credentials, which can represent different roles or service accounts. Available for dbt Cloud Enterprise plans, you can map credentials to service tokens for secure authentication. Refer to [Set up dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) for more details.
- **Fix**: Addressed a bug where unicode query filters (such as Chinese characters) were not working correctly in the dbt Semantic Layer Tableau integration.
- **Fix**: Resolved a bug with parsing certain private keys for BigQuery when running an export.
- **Fix**: Addressed a bug that caused a "closed connection" error to be returned when querying or running an Export.
- **Fix**: Resolved an issue in dbt Core where, during partial parsing, all generated metrics in a file were incorrectly deleted instead of just those related to the changed semantic model. Now, only the metrics associated with the modified model are affected.

## June 2024
- **New:** Introduced new granularity support for cumulative metrics in MetricFlow. Granularity options for cumulative metrics are slightly different than granularity for other metric types. For other metrics, we use the `date_trunc` function to implement granularity. However, because cumulative metrics are non-additive (values can't be added up), we can't use the `date_trunc` function to change their time grain granularity. 
  
  Instead, we use the `first()`, `last()`, and `avg()` aggregation functions to aggregate cumulative metrics over the requested period. By default, we take the first value of the period. You can change this behavior by using the `period_agg` parameter. For more information, refer to [Granularity options for cumulative metrics](/docs/build/cumulative#granularity-options).

#### dbt Semantic Layer
- **New:** Added support for <Term id="predicate-pushdown"/> SQL optimization in MetricFlow. We will now push down categorical dimension filters to the metric source table. Previously filters were applied after we selected from the metric source table. This change helps reduce full table scans on certain query engines.
- **New:** Enabled `where` filters  on dimensions (included in saved queries) to use the cache during query time. This means you can now dynamically filter your dashboards without losing the performance benefits of caching. Refer to [caching](/docs/use-dbt-semantic-layer/sl-cache#result-caching) for more information.
- **Enhancement:** In [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets), we added information icons and descriptions to metrics and dimensions options in the Query Builder menu. Click on the **Info** icon button to view a description of the metric or dimension. Available in the following Query Builder menu sections: metric, group by, where, saved selections, and saved queries.
- **Enhancement:** In [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets), you can now apply granularity to all time dimensions, not just metric time. This update uses our [APIs](/docs/dbt-cloud-apis/sl-api-overview) to support granularity selection on any chosen time dimension.
- **Enhancement**: MetricFlow time spine warnings now prompt users to configure missing or small-grain-time spines. An error message is displayed for multiple time spines per granularity.
- **Enhancement**: Errors now display if no time spine is configured at the requested or smaller granularity. 
- **Enhancement:** Improved querying error message when no semantic layer credentials were set.
- **Enhancement:** Querying grains for cumulative metrics now returns multiple granularity options (day, week, month, quarter, year) like all other metric types. Previously, you could only query one grain option for cumulative metrics.
- **Fix:** Removed errors that prevented querying cumulative metrics with other granularities.
- **Fix:** Fixed various Tableau errors when querying certain metrics or when using calculated fields.
- **Fix:** In Tableau, we relaxed naming field expectations to better identify calculated fields.
- **Fix:** Fixed an error when refreshing database metadata for columns that we can't convert to Arrow. These columns will now be skipped. This mainly affected Redshift users with custom types.
- **Fix:** Fixed Private Link connections for Databricks.

#### Also available this month:

- **Enhancement:** Updates to the UI when [creating merge jobs](/docs/deploy/merge-jobs) are now available. The updates include improvements to helper text, new deferral settings, and performance improvements.
- **New**: The dbt Semantic Layer now offers a seamless integration with Microsoft Excel, available in [preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Build semantic layer queries and return data on metrics directly within Excel, through a custom menu. To learn more and install the add-on, check out [Microsoft Excel](/docs/cloud-integrations/semantic-layer/excel).
- **New:** [Job warnings](/docs/deploy/job-notifications) are now GA. Previously, you could receive email or Slack alerts about your jobs when they succeeded, failed, or were canceled. Now with the new **Warns** option, you can also receive alerts when jobs have encountered warnings from tests or source freshness checks during their run. This gives you more flexibility on _when_ to be notified. 
- **New:** A [preview](/docs/dbt-versions/product-lifecycles#dbt-cloud) of the dbt Snowflake Native App is now available. With this app, you can access dbt Explorer, the **Ask dbt** chatbot, and orchestration observability features, extending your dbt Cloud experience into the Snowflake UI. To learn more, check out [About the dbt Snowflake Native App](/docs/cloud-integrations/snowflake-native-app) and [Set up the dbt Snowflake Native App](/docs/cloud-integrations/set-up-snowflake-native-app).

## May 2024

- **Enhancement:** We've now introduced a new **Prune branches** [Git button](/docs/cloud/dbt-cloud-ide/ide-user-interface#prune-branches-modal) in the dbt Cloud IDE. This button allows you to delete local branches that have been deleted from the remote repository, keeping your branch management tidy. Available in all regions now and will be released to single tenant accounts during the next release cycle.

#### dbt Cloud Launch Showcase event

The following features are new or enhanced as part of our [dbt Cloud Launch Showcase](https://www.getdbt.com/resources/webinars/dbt-cloud-launch-showcase) event on May 14th, 2024:

- **New:** [dbt Copilot](/docs/cloud/dbt-copilot) is a powerful AI engine helping you generate documentation, tests, and semantic models, saving you time as you deliver high-quality data. Available in private beta for a subset of dbt Cloud Enterprise users and in the dbt Cloud IDE. [Register your interest](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform) to join the private beta.

- **New:** The new low-code editor, now in private beta, enables less SQL-savvy analysts to create or edit dbt models through a visual, drag-and-drop experience inside of dbt Cloud. These models compile directly to SQL and are indistinguishable from other dbt models in your projects: they are version-controlled, can be accessed across projects in dbt Mesh, and integrate with dbt Explorer and the Cloud IDE. [Register your interest](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform) to join the private beta.

- **New:** [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) is now Generally Available (GA) to all users. The dbt Cloud CLI is a command-line interface that allows you to interact with dbt Cloud, use automatic deferral, leverage dbt Mesh, and more!

- **New:** The VS Code extension [Power user for dbt Core and dbt Cloud](https://docs.myaltimate.com/arch/beta/) is now available in beta for [dbt Cloud CLI](https://docs.myaltimate.com/setup/reqdConfigCloud/) users. The extension accelerates dbt and SQL development and includes features such as generating models from your source definitions or SQL, and [more](https://docs.myaltimate.com/)!

- **New:** [Unit tests](/docs/build/unit-tests) are now GA in dbt Cloud. Unit tests enable you to test your SQL model logic against a set of static inputs.

- <Expandable alt_header="New: Native support for Azure Synapse Analytics" lifecycle="preview"> 

  Native support in dbt Cloud for Azure Synapse Analytics is now available as a [preview](/docs/dbt-versions/product-lifecycles#dbt-cloud)!

  To learn more, refer to [Connect Azure Synapse Analytics](/docs/cloud/connect-data-platform/connect-azure-synapse-analytics) and [Microsoft Azure Synapse DWH configurations](/reference/resource-configs/azuresynapse-configs).

  Also, check out the [Quickstart for dbt Cloud and Azure Synapse Analytics](/guides/azure-synapse-analytics?step=1). The guide walks you through:

  - Loading the Jaffle Shop sample data (provided by dbt Labs) into Azure Synapse Analytics. 
  - Connecting dbt Cloud to Azure Synapse Analytics.
  - Turning a sample query into a model in your dbt project. A model in dbt is a SELECT statement.
  - Adding tests to your models.
  - Documenting your models.
  - Scheduling a job to run.

  </Expandable>

- **New:** MetricFlow enables you to now add metrics as dimensions to your metric filters to create more complex metrics and gain more insights. Available for all dbt Cloud Semantic Layer users.

- **New:** [Staging environment](/docs/deploy/deploy-environments#staging-environment) is now GA. Use staging environments to grant developers access to deployment workflows and tools while controlling access to production data. Available to all dbt Cloud users.

- **New:** Oauth login support via [Databricks](/docs/cloud/manage-access/set-up-databricks-oauth) is now GA to Enterprise customers.

- <Expandable alt_header="New: GA of dbt Explorer's features" > 

  dbt Explorer's current capabilities &mdash; including column-level lineage, model performance analysis, and project recommendations &mdash; are now Generally Available for dbt Cloud Enterprise and Teams plans. With Explorer, you can more easily navigate your dbt Cloud project – including models, sources, and their columns – to gain a better understanding of its latest production or staging state.

  To learn more about its features, check out:
  
  - [Explore projects](/docs/collaborate/explore-projects)
  - [Explore multiple projects](/docs/collaborate/explore-multiple-projects) 
  - [Column-level lineage](/docs/collaborate/column-level-lineage) 
  - [Model performance](/docs/collaborate/model-performance) 
  - [Project recommendations](/docs/collaborate/project-recommendations) 

  </Expandable>

- **New:** Native support for Microsoft Fabric in dbt Cloud is now GA. This feature is powered by the [dbt-fabric](https://github.com/Microsoft/dbt-fabric) adapter. To learn more, refer to [Connect Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric) and [Microsoft Fabric DWH configurations](/reference/resource-configs/fabric-configs). There's also a [quickstart guide](https://docs.getdbt.com/guides/microsoft-fabric?step=1) to help you get started. 

- **New:** dbt Mesh is now GA to dbt Cloud Enterprise users. dbt Mesh is a framework that helps organizations scale their teams and data assets effectively. It promotes governance best practices and breaks large projects into manageable sections. Get started with dbt Mesh by reading the [dbt Mesh quickstart guide](https://docs.getdbt.com/guides/mesh-qs?step=1).

- **New:** The dbt Semantic Layer [Tableau Desktop, Tableau Server](/docs/cloud-integrations/semantic-layer/tableau), and [Google Sheets integration](/docs/cloud-integrations/semantic-layer/gsheets) is now GA to dbt Cloud Team or Enterprise accounts. These first-class integrations allow you to query and unlock valuable insights from your data ecosystem.

- **Enhancement:** As part of our ongoing commitment to improving the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#considerations), the filesystem now comes with improvements to speed up dbt development, such as introducing a Git repository limit of 10GB.

#### Also available this month:

- **Update**: The [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) is now available for Azure single tenant and is accessible in all [deployment regions](/docs/cloud/about-cloud/access-regions-ip-addresses) for both multi-tenant and single-tenant accounts.

- **New**: The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) introduces [declarative caching](/docs/use-dbt-semantic-layer/sl-cache), allowing you to cache common queries to speed up performance and reduce query compute costs. Available for dbt Cloud Team or Enterprise accounts.

- <Expandable alt_header="New: Versionless" > 

  The **Versionless** setting is now Generally Available (previously Public Preview).

  When the new **Versionless** setting is enabled, you get a versionless experience and always get the latest features and early access to new functionality for your dbt project. dbt Labs will handle upgrades behind-the-scenes, as part of testing and redeploying the dbt Cloud application &mdash; just like other dbt Cloud capabilities and other SaaS tools that you're using. No more manual upgrades and no more need for _a second sandbox project_ just to try out new features in development.

  To learn more about the new setting, refer to [Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) for details. 

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Versionless setting"/>

  </Expandable>

- **Behavior change:** Introduced the `require_resource_names_without_spaces` flag, opt-in and disabled by default. If set to `True`, dbt will raise an exception if it finds a resource name containing a space in your project or an installed package. This will become the default in a future version of dbt. Read [No spaces in resource names](/reference/global-configs/behavior-changes#no-spaces-in-resource-names) for more information.

## April 2024

- <Expandable alt_header="New: Merge jobs" lifecycle="beta" > 

  You can now set up a continuous deployment (CD) workflow for your projects natively in dbt Cloud. You can now access a beta release of [Merge jobs](/docs/deploy/merge-jobs), which is a new [job type](/docs/deploy/jobs), that enables you to trigger dbt job runs as soon as changes (via Git pull requests) merge into production.

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" width="90%" title="Example of creating a merge job"/>

  </Expandable>
  
- **Behavior change:** Introduced the `require_explicit_package_overrides_for_builtin_materializations` flag, opt-in and disabled by default. If set to `True`, dbt will only use built-in materializations defined in the root project or within dbt, rather than implementations in packages. This will become the default in May 2024 (dbt Core v1.8 and "Versionless" dbt Cloud). Read [Package override for built-in materialization](/reference/global-configs/behavior-changes#package-override-for-built-in-materialization) for more information.

**dbt Semantic Layer**
- **New**: Use Saved selections to [save your query selections](/docs/cloud-integrations/semantic-layer/gsheets#using-saved-selections) within the [Google Sheets application](/docs/cloud-integrations/semantic-layer/gsheets). They can be made private or public and refresh upon loading.
- **New**: Metrics are now displayed by their labels as `metric_name`.
- **Enhancement**: [Metrics](/docs/build/metrics-overview) now supports the [`meta` option](/reference/resource-configs/meta) under the [config](/reference/resource-properties/config) property. Previously, we only supported the now deprecated `meta` tag.
- **Enhancement**: In the Google Sheets application, we added [support](/docs/cloud-integrations/semantic-layer/gsheets#using-saved-queries) to allow jumping off from or exploring MetricFlow-defined saved queries directly.
- **Enhancement**: In the Google Sheets application, we added support to query dimensions without metrics. Previously, you needed a dimension.
- **Enhancement**: In the Google Sheets application, we added support for time presets and complex time range filters such as "between", "after", and "before".
- **Enhancement**: In the Google Sheets application, we added supported to automatically populate dimension values when you select a "where" filter, removing the need to manually type them.  Previously, you needed to manually type the dimension values.
- **Enhancement**: In the Google Sheets application, we added support to directly query entities, expanding the flexibility of data requests.
- **Enhancement**: In the Google Sheets application, we added an option to exclude column headers, which is useful for populating templates with only the required data.
- **Deprecation**: For the Tableau integration, the [`METRICS_AND_DIMENSIONS` data source](/docs/cloud-integrations/semantic-layer/tableau#using-the-integration) has been deprecated for all accounts not actively using it. We encourage users to transition to the "ALL" data source for future integrations.

## March 2024

- **New:** The Semantic Layer services now support using Privatelink for customers who have it enabled.
- **New:** You can now develop against and test your Semantic Layer in the Cloud CLI if your developer credential uses SSO.
- **Enhancement:** You can select entities to Group By, Filter By, and Order By.
- **Fix:** `dbt parse` no longer shows an error when you use a list of filters (instead of just a string filter) on a metric.
- **Fix:** `join_to_timespine` now properly gets applied to conversion metric input measures.
- **Fix:** Fixed an issue where exports in Redshift were not always committing to the DWH, which also had the side-effect of leaving table locks open.
- **Behavior change:** Introduced the `source_freshness_run_project_hooks` flag, opt-in and disabled by default. If set to `True`, dbt will include `on-run-*` project hooks in the `source freshness` command. This will become the default in a future version of dbt. Read [Project hooks with source freshness](/reference/global-configs/behavior-changes#project-hooks-with-source-freshness) for more information.


## February 2024

- **New:** [Exports](/docs/use-dbt-semantic-layer/exports#define-exports) allow you to materialize a saved query as a table or view in your data platform. By using exports, you can unify metric definitions in your data platform and query them as you would any other table or view.
- **New:** You can access a list of your [exports](/docs/use-dbt-semantic-layer/exports) with the new list saved-queries command by adding `--show-exports`
- **New:** The dbt Semantic Layer and [Tableau Connector](/docs/cloud-integrations/semantic-layer/tableau) now supports relative date filters in Tableau.

- <Expandable alt_header="New: Use exports to write saved queries">

  You can now use the [exports](/docs/use-dbt-semantic-layer/exports) feature with [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), allowing you to query reliable metrics and fast data reporting. Exports enhance the saved queries feature, allowing you to write commonly used queries directly within your data platform using dbt Cloud's job scheduler.

  By exposing tables of metrics and dimensions, exports enable you to integrate with additional tools that don't natively connect with the dbt Semantic Layer, such as PowerBI.

  Exports are available for dbt Cloud multi-tenant [Team or Enterprise](https://www.getdbt.com/pricing/) plans on dbt versions 1.7 or newer. Refer to the [exports blog](https://www.getdbt.com/blog/announcing-exports-for-the-dbt-semantic-layer) for more details.

  <Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />

  </Expandable>

- <Expandable alt_header="New: Trigger on job completion " lifecycle="team,enterprise" >

  Now available for dbt Cloud Team and Enterprise plans is the ability to trigger deploy jobs when other deploy jobs are complete. You can enable this feature [in the UI](/docs/deploy/deploy-jobs) with the  **Run when another job finishes** option in the **Triggers** section of your job or with the [Create Job API endpoint](/dbt-cloud/api-v2#/operations/Create%20Job). 

  When enabled, your job will run after the specified upstream job completes. You can configure which run status(es) will trigger your job. It can be just on `Success` or on all statuses. If you have dependencies between your dbt projects, this allows you to _natively_ orchestrate your jobs within dbt Cloud &mdash; no need to set up a third-party tool.

  An example of the **Triggers** section when creating the job:  

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Example of Triggers on the Deploy Job page"/>

  </Expandable>

- <Expandable alt_header="New: Versionless " lifecycle="beta">

  _Now available in the dbt version dropdown in dbt Cloud &mdash; starting with select customers, rolling out to wider availability through February and March._

  When the new **Versionless** setting is enabled, you always get the latest fixes and early access to new functionality for your dbt project. dbt Labs will handle upgrades behind-the-scenes, as part of testing and redeploying the dbt Cloud application &mdash; just like other dbt Cloud capabilities and other SaaS tools that you're using. No more manual upgrades and no more need for _a second sandbox project_ just to try out new features in development.

  To learn more about the new setting, refer to [Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) for details. 

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Versionless setting"/>

  </Expandable>


- <Expandable alt_header="New: Override dbt version with new User development settings" >

  You can now [override the dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version) that's configured for the development environment within your project and use a different version &mdash; affecting only your user account. This lets you test new dbt features without impacting other people working on the same project. And when you're satisfied with the test results, you can safely upgrade the dbt version for your project(s).  

  Use the **dbt version** dropdown to specify the version to override with. It's available on your project's credentials page in the **User development settings** section. For example:

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Example of overriding the dbt version on your user account"/>

  </Expandable>

- <Expandable alt_header="Enhancement: Edit in primary git branch in IDE">

  You can now edit, format, or lint files and execute dbt commands directly in your primary git branch in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).  This enhancement is available across various repositories, including native integrations, imported git URLs, and managed repos.

  This enhancement is currently available to all dbt Cloud multi-tenant regions and will soon be available to single-tenant accounts.

  The primary branch of the connected git repo has traditionally been _read-only_ in the IDE. This update changes the branch to _protected_ and allows direct edits. When a commit is made, dbt Cloud will prompt you to create a new branch. dbt Cloud will pre-populate the new branch name with the GIT_USERNAME-patch-#; however, you can edit the field with a custom branch name.

  Previously, the primary branch was displayed as read-only, but now the branch is displayed with a lock icon to identify it as protected:

  <DocCarousel slidesPerView={1}>

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/read-only.png" width="75%" title="Previous read-only experience"/>

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/protected.png" width="75%" title="New protected experience"/>

  </DocCarousel>

  When you make a commit while on the primary branch, a modal window will open prompting you to create a new branch and enter a commit message:

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-new-branch.png" width="75%" title="Create new branch window"/>

  </Expandable>

- **Enhancement:**  The dbt Semantic Layer [Google Sheets integration](/docs/cloud-integrations/semantic-layer/gsheets) now exposes a note on the cell where the data was requested, indicating clearer data requests. The integration also now exposes a new **Time Range** option, which allows you to quickly select date ranges.
- **Enhancement:** The [GraphQL API](/docs/dbt-cloud-apis/sl-graphql) includes a `requiresMetricTime` parameter to better handle metrics that must be grouped by time. (Certain metrics defined in MetricFlow can't be looked at without a time dimension).
- **Enhancement:** Enable querying metrics with offset and cumulative metrics with the time dimension name, instead of `metric_time`. [Issue #1000](https://github.com/dbt-labs/metricflow/issues/1000)
  - Enable querying `metric_time` without metrics. [Issue #928](https://github.com/dbt-labs/metricflow/issues/928)
- **Enhancement:** Added support for consistent SQL query generation, which enables ID generation consistency between otherwise identical MF queries. Previously, the SQL generated by `MetricFlowEngine` was not completely consistent between identical queries. [Issue 1020](https://github.com/dbt-labs/metricflow/issues/1020)
- **Fix:** The Tableau Connector returns a date filter when filtering by dates. Previously it was erroneously returning a timestamp filter.
-  **Fix:** MetricFlow now validates if there are `metrics`, `group by`, or `saved_query` items in each query. Previously, there was no validation. [Issue 1002](https://github.com/dbt-labs/metricflow/issues/1002)
- **Fix:** Measures using `join_to_timespine` in MetricFlow now have filters applied correctly after time spine join.
- **Fix:** Querying multiple granularities with offset metrics:
  - If you query a time offset metric with multiple instances of `metric_time`/`agg_time_dimension`, only one of the instances will be offset. All of them should be.
  - If you query a time offset metric with one instance of `metric_time`/`agg_time_dimension` but filter by a different one, the query will fail.
- **Fix:** MetricFlow prioritizes a candidate join type over the default type when evaluating nodes to join. For example, the default join type for distinct values queries is `FULL OUTER JOIN`, however, time spine joins require `CROSS JOIN`, which is more appropriate.
- **Fix:** Fixed a bug that previously caused errors when entities were referenced in `where` filters.

## January 2024

- <Expandable alt_header="January docs updates">

  Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 10 new community contributors to docs.getdbt.com :pray: What a busy start to the year! We merged 110 PRs in January.

  Here's how we improved the [docs.getdbt.com](http://docs.getdbt.com/) experience:

  - Added new hover behavior for images
  - Added new expandables for FAQs
  - Pruned outdated notices and snippets as part of the docs site maintenance

  January saw some great new content:

  - New [dbt Mesh FAQs](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-4-faqs) page
  - Beta launch of [Explorer’s column-level lineage](https://docs.getdbt.com/docs/collaborate/column-level-lineage) feature
  - Developer blog posts:
    - [More time coding, less time waiting: Mastering defer in dbt](https://docs.getdbt.com/blog/defer-to-prod)
    - [Deprecation of dbt Server](https://docs.getdbt.com/blog/deprecation-of-dbt-server)
    - From the community: [Serverless, free-tier data stack with dlt + dbt core](https://docs.getdbt.com/blog/serverless-dlt-dbt-stack)
  - The Extrica team added docs for the [dbt-extrica community adapter](https://docs.getdbt.com/docs/core/connect-data-platform/extrica-setup)
  - Semantic Layer: New [conversion metrics docs](https://docs.getdbt.com/docs/build/conversion) and added the parameter `fill_nulls_with` to all metric types (launched the week of January 12, 2024)
  - New [dbt environment command](https://docs.getdbt.com/reference/commands/dbt-environment) and its flags for the dbt Cloud CLI

  January also saw some refreshed content, either aligning with new product features or requests from the community:

  - Native support for [partial parsing in dbt Cloud](https://docs.getdbt.com/docs/cloud/account-settings#partial-parsing)
  - Updated guidance on using dots or underscores in the [Best practice guide for models](https://docs.getdbt.com/best-practices/how-we-style/1-how-we-style-our-dbt-models)
  - Updated [PrivateLink for VCS docs](https://docs.getdbt.com/docs/cloud/secure/vcs-privatelink)
  - Added a new `job_runner` role in our [Enterprise project role permissions docs](https://docs.getdbt.com/docs/cloud/manage-access/enterprise-permissions#project-role-permissions)
  - Added saved queries to [Metricflow commands](https://docs.getdbt.com/docs/build/metricflow-commands#list-saved-queries)
  - Removed [as_text docs](https://github.com/dbt-labs/docs.getdbt.com/pull/4726) that were wildly outdated

  </Expandable>

- **New:** New metric type that allows you to measure conversion events. For example, users who viewed a web page and then filled out a form. For more details, refer to [Conversion metrics](/docs/build/conversion). 
- **New:** Instead of specifying the fully qualified dimension name (for example, `order__user__country`) in the group by or filter expression, you now only need to provide the primary entity and dimensions name, like `user__county`. 
- **New:** You can now query the [saved queries](/docs/build/saved-queries) you've defined in the dbt Semantic Layer using [Tableau](/docs/cloud-integrations/semantic-layer/tableau), [GraphQL API](/docs/dbt-cloud-apis/sl-graphql), [JDBC API](/docs/dbt-cloud-apis/sl-jdbc), and the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). 

- <Expandable alt_header="New: Native support for partial parsing" >

  By default, dbt parses all the files in your project at the beginning of every dbt invocation. Depending on the size of your project, this operation can take a long time to complete. With the new partial parsing feature in dbt Cloud, you can reduce the time it takes for dbt to parse your project. When enabled, dbt Cloud parses only the changed files in your project instead of parsing all the project files. As a result, your dbt invocations will take less time to run.

  To learn more, refer to [Partial parsing](/docs/cloud/account-settings#partial-parsing).

  <Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Partial parsing option" />

  </Expandable>

- **Enhancement:** The YAML spec parameter `label` is now available for Semantic Layer metrics in [JDBC and GraphQL APIs](/docs/dbt-cloud-apis/sl-api-overview). This means you can conveniently use `label` as a display name for your metrics when exposing them.
- **Enhancement:** Added support for `create_metric: true` for a measure, which is a shorthand to quickly create metrics. This is useful in cases when metrics are only used to build other metrics.
- **Enhancement:** Added support for Tableau parameter filters. You can use the [Tableau connector](/docs/cloud-integrations/semantic-layer/tableau) to create and use parameters with your dbt Semantic Layer data.
- **Enhancement:** Added support to expose `expr` and `agg` for [Measures](/docs/build/measures) in the [GraphQL API](/docs/dbt-cloud-apis/sl-graphql).
- **Enhancement:** You have improved error messages in the command line interface when querying a dimension that is not reachable for a given metric.
- **Enhancement:** You can now query entities using our Tableau integration (similar to querying dimensions). 
- **Enhancement:** A new data source is available in our Tableau integration called "ALL", which contains all semantic objects defined. This has the same information as "METRICS_AND_DIMENSIONS". In the future, we will deprecate "METRICS_AND_DIMENSIONS" in favor of "ALL" for clarity. 

- **Fix:** Support for numeric types with precision greater than 38 (like `BIGDECIMAL`) in BigQuery is now available. Previously, it was unsupported so would return an error.
- **Fix:** In some instances, large numeric dimensions were being interpreted by Tableau in scientific notation, making them hard to use. These should now be displayed as numbers as expected.
- **Fix:** We now preserve dimension values accurately instead of being inadvertently converted into strings. 
- **Fix:** Resolved issues with naming collisions in queries involving multiple derived metrics using the same metric input. Previously, this  could cause a naming collision. Input metrics are now deduplicated, ensuring each is referenced only once.
- **Fix:** Resolved warnings related to using two duplicate input measures in a derived metric. Previously, this would trigger a warning. Input measures are now deduplicated, enhancing query processing and clarity.
- **Fix:** Resolved an error where referencing an entity in a filter using the object syntax would fail. For example, `{{Entity('entity_name')}}` would fail to resolve.
