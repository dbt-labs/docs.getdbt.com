---
title: "dbt release notes"
description: "dbt release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt release notes"
pagination_next: null
pagination_prev: null
---

<Constant name="cloud" /> release notes for recent and historical changes. Release notes fall into one of the following categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

## October 2025
- **Enhancement**:
  - **<Constant name="fusion" /> MCP tools** &mdash; Added <Constant name="fusion" /> tools that support `compile_sql` and `get_column_lineage` (Fusion-exclusive) for both [Remote](/docs/dbt-ai/about-mcp#fusion-tools-remote) and [Local](/docs/dbt-ai/about-mcp#fusion-tools-local) usage. Remote <Constant name="fusion" /> tools defer to your prod environment by default (set with `x-dbt-prod-environment-id`); you can disable deferral with `x-dbt-fusion-disable-defer=true`. Refer to [set up remote MCP](/docs/dbt-ai/setup-remote-mcp) for more info.
  - **Local MCP OAuth** &mdash; You can now authenticate the local dbt MCP server to the dbt platform with OAuth (supported docs for [Claude](/docs/dbt-ai/integrate-mcp-claude), [Cursor](/docs/dbt-ai/integrate-mcp-cursor), and [VS Code](/docs/dbt-ai/integrate-mcp-vscode)), reducing local secret management and standardizing setup. Refer to [dbt platform authentication](/docs/dbt-ai/setup-local-mcp#dbt-platform-authentication) for more information.
- **Behavior change**: The CodeGenCodeLens feature for creating models from your sources with a click of a button has been temporarily removed from the <Constant name="cloud_ide" /> due to compatibility issues. We plan to reintroduce this feature in the near future for both the IDE and the VS Code extension.

## September 2025

- **Fix**: Improved how [MetricFlow](/docs/build/about-metricflow) handles [offset metrics](/docs/build/derived) for more accurate results when querying time-based data. MetricFlow now joins data _after_ aggregation when the query grain matches the offset grain. Previously, when querying offset metrics, the offset join was applied _before_ aggregation, which could exclude some values from the total time period.

## August 2025

- **Fix**: Resolved a bug that caused [saved query](/docs/build/saved-queries) exports to fail during `dbt build` with `Unable to get saved_query` errors. 
- **New**: The <Constant name="semantic_layer" /> GraphQL API now has a [`queryRecords`](/docs/dbt-cloud-apis/sl-graphql#query-records) endpoint. With this endpoint, you can view the query history both for Insights and <Constant name="semantic_layer" /> queries.
- **Fix**: Resolved a bug that caused <Constant name="semantic_layer" /> queries with a trailing whitespace to produce an error. This issue mostly affected [Push.ai](https://docs.push.ai/data-sources/semantic-layers/dbt) users and is fixed now. 
- **New**: You can now use [personal access tokens (PATs)](/docs/dbt-cloud-apis/user-tokens) to authenticate in the Semantic Layer. This enables user-level authentication and reduces the need for sharing tokens between users. When you authenticate using PATs, queries are run using your personal development credentials. For more information, see [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl).

## July 2025

- **New**: The [Tableau Cloud](https://www.tableau.com/products/cloud-bi) integration with Semantic Layer is now available. For more information, see [Tableau](/docs/cloud-integrations/semantic-layer/tableau).
- **Preview**: The [Semantic Layer Power BI integration](/docs/cloud-integrations/semantic-layer/power-bi) is now available in Preview.
- **Enhancement:** You can now use `limit` and `order_by` parameters when creating [saved queries](/docs/build/saved-queries). 
- **Enhancement:** Users assigned IT [licenses](/docs/cloud/manage-access/seats-and-users) can now edit and manage [global connections settings](/docs/cloud/connect-data-platform/about-connections#connection-management).
- **New**: Paginated [GraphQL](/docs/dbt-cloud-apis/sl-graphql) endpoints for metadata queries in Semantic Layer are now available. This improves integration load times for large manifests. For more information, see [Metadata calls](/docs/dbt-cloud-apis/sl-graphql#metadata-calls).

## June 2025

- **New**: [System for Cross-Domain Identity Management](/docs/cloud/manage-access/scim#scim-configuration-for-entra-id) (SCIM) through Microsoft Entra ID is now GA. Also available on legacy Enterprise plans. 
- **Enhancement:** You can now set the [compilation environment](/docs/explore/access-dbt-insights#set-jinja-environment) to control how Jinja functions are rendered in dbt Insights.
- **Beta**: The dbt Fusion engine supports the BigQuery adapter in beta.
- **New:** You can now view the history of settings changes for [projects](/docs/cloud/account-settings), [environments](/docs/dbt-cloud-environments), and [jobs](/docs/deploy/deploy-jobs).
- **New:** Added support for the latest version of BigQuery credentials in Semantic Layer and MetricFlow.
- **New:**  Snowflake External OAuth is now supported for Semantic Layer queries.
Snowflake connections that use External OAuth for user credentials can now emit queries for <Constant name="query_page" />, <Constant name="cloud_cli" />, and <Constant name="cloud_ide" /> through the Semantic Layer Gateway. This enables secure, identity-aware access via providers like Okta or Microsoft Entra ID.
- **New:** You can now [download your managed Git repo](/docs/cloud/git/managed-repository#download-managed-repository) from the dbt platform.
- **New**: The <Constant name="semantic_layer" /> now supports Trino as a data platform. For more details, see [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **New**: The dbt Fusion engine supports Databricks in beta.
- **Enhancement**: Group owners can now specify multiple email addresses for model-level notifications, enabling broader team alerts. Previously, only a single email address was supported. Check out the [Configure groups](/docs/deploy/model-notifications#configure-groups) section to learn more.
- **New**: The Semantic Layer GraphQL API now has a [`List a saved query`](/docs/dbt-cloud-apis/sl-graphql#list-a-saved-query) endpoint.

## May 2025

### 2025 dbt Launch Showcase
The following features are new or enhanced as part of our [dbt Launch Showcase](https://www.getdbt.com/resources/webinars/2025-dbt-cloud-launch-showcase) on May 28th, 2025:

- **New**: The dbt Fusion engine is the brand new dbt engine re-written from the ground up to provide incredible speed, cost-savings tools, and comprehensive SQL language tools. The dbt Fusion engine is now available in beta for Snowflake users.
  - Read more [about Fusion](/docs/fusion/about-fusion).
  - Understand what actions you need to take to get your projects Fusion-ready with the [upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
  - Begin testing today with the [quickstart guide](/guides/fusion).
  - Know [where we're headed with the dbt Fusion engine](https://getdbt.com/blog/where-we-re-headed-with-the-dbt-fusion-engine). 
- **New**: The dbt VS Code extension is a powerful new tool that brings the speed and productivity of the dbt Fusion engine into your Visual Studio Code editor. This is a free download that will forever change your dbt development workflows. The dbt VS Code extension is now available as beta [alongside Fusion](https://getdbt.com/blog/get-to-know-the-new-dbt-fusion-engine-and-vs-code-extension). Check out the [installation instructions](/docs/install-dbt-extension) and read more [about the features](/docs/about-dbt-extension) to get started enhancing your dbt workflows today! 
- **New**: dbt Explorer is now <Constant name="explorer" />! Learn more about the change [here](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features).
	- dbt's Catalog, global navigation provides a search experience that lets you find dbt resources across all your projects, as well as non-dbt resources in Snowflake.
	- External metadata ingestion allows you to connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt. 
- **New**: [dbt Canvas is now generally available](https://getdbt.com/blog/dbt-canvas-is-ga) (GA). Canvas is the intuitive visual editing tool that enables anyone to create dbt models with an easy to understand drag-and-drop interface. Read more [about Canvas](/docs/cloud/canvas) to begin empowering your teams to build more, faster! 
- **New**: [State-aware orchestration](/docs/deploy/state-aware-about) is now in beta! Every time a new job in Fusion runs, state-aware orchestration automatically determines which models to build by detecting changes in code or data.
- **New**: With Hybrid Projects, your organization can adopt complementary dbt Core and dbt Cloud workflows and seamlessly integrate these workflows by automatically uploading dbt Core artifacts into dbt Cloud. [Hybrid Projects](/docs/deploy/hybrid-projects) is now available as a preview to [<Constant name="cloud" /> Enterprise accounts](https://www.getdbt.com/pricing). 
- **New**: [System for Cross-Domain Identity Management (SCIM)](/docs/cloud/manage-access/scim) through Okta is now GA.
- **New**: dbt now acts as a [Model Context Protocol](/docs/dbt-ai/about-mcp) (MCP) server, allowing seamless integration of AI tools with data warehouses through a standardized framework.
- **New**: The [quickstart guide for data analysts](/guides/analyze-your-data) is now available. With dbt, data analysts can use built-in, AI-powered tools to build governed data models, explore how they’re built, and run their own analysis.
- **New**: You can view your [usage metering and limiting in dbt Copilot](/docs/cloud/billing#dbt-copilot-usage-metering-and-limiting) on the billing page of your dbt Cloud account.
- **New**: You can use Copilot to create a `dbt-styleguide.md` for dbt projects. The generated style guide template includes SQL style guidelines, model organization and naming conventions, model configurations and testing practices, and recommendations to enforce style rules. For more information, see [Copilot style guide](/docs/cloud/copilot-styleguide).
- **New**: Copilot chat is an interactive interface within the Studio IDE where you can generate SQL code from natural language prompts and ask analytics-related questions. It integrates contextual understanding of your dbt project and assists in streamlining SQL development. For more information, see [Copilot chat](/docs/cloud/copilot-chat-in-studio).
- **New**: Leverage dbt Copilot to generate SQL queries in [Insights](/docs/explore/dbt-insights) from natural language prompts, enabling efficient data exploration within a context-aware interface.
- **New**: The dbt platform Cost management dashboard is now available as a preview for Snowflake users on Enterprise and Enteprise Plus plans. Gain valuable insights into your warehouse spend with the comprehensive and interactive dashboard. Read more [about it](/docs/cloud/cost-management) to get started with your cost savings analysis today!
- **New**: Apache Iceberg catalog integration support is now available on Snowflake and BigQuery! This is essential to making your dbt Mesh interoperable across platforms, built on Iceberg. Read more about [Iceberg](/docs/mesh/iceberg/apache-iceberg-support) to begin creating Iceberg tables. 
- **Update**: Product renaming and other changes. For more information, refer to [Updated names for dbt platform and features](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features).
  <Expandable alt_header="Product names key">
  * Canvas (previously Visual Editor)
  * Catalog (previously Explorer)
  * Copilot
  * Cost Management
  * dbt Fusion engine
  * Insights
  * Mesh
  * Orchestrator
  * Studio IDE (previously Cloud IDE)
  * Semantic Layer
  * Pricing plan changes. For more information, refer to [One dbt](https://www.getdbt.com/product/one-dbt).
  </Expandable>


## April 2025

- **Enhancement**: The [Python SDK](/docs/dbt-cloud-apis/sl-python) now supports lazy loading for large fields for `dimensions`, `entities`, and `measures` on `Metric` objects. For more information, see [Lazy loading for large fields](/docs/dbt-cloud-apis/sl-python#lazy-loading-for-large-fields).
- **Enhancement**: The <Constant name="semantic_layer" /> now supports [SSH tunneling for Postgres or Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) connections. Refer to [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) for more information.
- **Behavior change**: Users assigned the [`job admin` permission set](/docs/cloud/manage-access/enterprise-permissions#job-admin) now have access to set up integrations for projects, including the [Tableau](/docs/cloud-integrations/downstream-exposures-tableau) integration to populate downstream exposures.

## March 2025

- **Behavior change**: As of March 31st, 2025, <Constant name="core" /> versions 1.0, 1.1, and 1.2 have been deprecated from <Constant name="cloud" />. They are no longer available to select as versions for dbt projects. Workloads currently on these versions will be automatically upgraded to v1.3, which may cause new failures.
- **Enhancement**: [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) users on single-tenant configurations no longer need to contact their account representative to enable this feature. Setup is now self-service and available across all tenant configurations.
- **New**: The <Constant name="semantic_layer" /> now supports Postgres as a data platform. For more details on how to set up the <Constant name="semantic_layer" /> for Postgres, see [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- **New**: New [environment variable default](/docs/build/environment-variables#dbt-cloud-context) `DBT_CLOUD_INVOCATION_CONTEXT`. 
- **Enhancement**: Users assigned [read-only licenses](/docs/cloud/manage-access/about-user-access#licenses) are now able to view the [Deploy](/docs/deploy/deployments) section of their <Constant name="cloud" /> account and click into the individual sections but not edit or otherwise make any changes. 

#### dbt Developer day

The following features are new or enhanced as part of our [dbt Developer day](https://www.getdbt.com/resources/webinars/dbt-developer-day) on March 19th and 20th, 2025:

- **New**: The [`--sample` flag](/docs/build/sample-flag), now available for the `run` and `build` commands, helps reduce build times and warehouse costs by running dbt in sample mode. It generates filtered refs and sources using time-based sampling, allowing developers to validate outputs without building entire models.
- **New**: <Constant name="copilot" />, an AI-powered assistant, is now generally available in the Cloud IDE for all <Constant name="cloud" /> Enterprise accounts. Check out [<Constant name="copilot" />](/docs/cloud/dbt-copilot) for more information.   

#### Also available this month

- **New**: Bringing your own [Azure OpenAI key](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok) for [<Constant name="copilot" />](/docs/cloud/dbt-copilot) is now generally available. Your organization can configure <Constant name="copilot" /> to use your own Azure OpenAI keys, giving you more control over data governance and billing.
- **New**: The <Constant name="semantic_layer" /> supports Power BI as a [partner integration](/docs/cloud-integrations/avail-sl-integrations), available in private beta. To join the private beta, please reach out to your account representative. Check out the [Power BI](/docs/cloud-integrations/semantic-layer/power-bi) integration for more information.
- **New**: [<Constant name="cloud" /> release tracks](/docs/dbt-versions/cloud-release-tracks) are Generally Available. Depending on their plan, customers may select among the Latest, Compatible, or Extended tracks to manage the update cadences for development and deployment environments.
- **New:** The <Constant name="cloud" />-native integration with Azure DevOps now supports [Entra ID service principals](/docs/cloud/git/setup-service-principal). Unlike a services user, which represents a real user object in Entra ID, the service principal is a secure identity associated with your <Constant name="cloud" /> app to access resources in Azure unattended. Please [migrate your service user](/docs/cloud/git/setup-service-principal#migrate-to-service-principal) to a service principal for Azure DevOps  as soon as possible.


## February 2025

- **Enhancement**: The [Python SDK](/docs/dbt-cloud-apis/sl-python) added a new timeout parameter to Semantic Layer client and to underlying GraphQL clients to specify timeouts. Set a timeout number or use the `total_timeout` parameter in the global `TimeoutOptions` to control connect, execute and close timeouts granularly. `ExponentialBackoff.timeout_ms` is now deprecated.
- **New**: The [Azure DevOps](/docs/cloud/git/connect-azure-devops) integration for <Constant name="git" /> now supports [Entra service principal apps](/docs/cloud/git/setup-service-principal) on <Constant name="cloud" /> Enterprise accounts. Microsoft is enforcing MFA across user accounts, including service users, which will impact existing app integrations. This is a phased rollout, and dbt Labs recommends [migrating to a service principal](/docs/cloud/git/setup-service-principal#migrate-to-service-principal) on existing integrations once the option becomes available in your account.
- **New**: Added the `dbt invocation` command to the [dbt CLI](/docs/cloud/cloud-cli-installation). This command allows you to view and manage active invocations, which are long-running sessions in the dbt CLI. For more information, see [dbt invocation](/reference/commands/invocation).
- **New**: Users can now switch themes directly from the user menu, available [in Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). We have added support for **Light mode** (default), **Dark mode**, and automatic theme switching based on system preferences. The selected theme is stored in the user profile and will follow users across all devices.
  - Dark mode is currently available on the Developer plan and will be available for all [plans](https://www.getdbt.com/pricing) in the future. We’ll be rolling it out gradually, so stay tuned for updates. For more information, refer to [Change your <Constant name="cloud" /> theme](/docs/cloud/about-cloud/change-your-dbt-cloud-theme).
- **Fix**: <Constant name="semantic_layer" /> errors in the Cloud IDE are now displayed with proper formatting, fixing an issue where newlines appeared broken or difficult to read. This fix ensures error messages are more user-friendly and easier to parse.
- **Fix**: Fixed an issue where [saved queries](/docs/build/saved-queries) with no [exports](/docs/build/saved-queries#configure-exports) would fail with an `UnboundLocalError`. Previously, attempting to process a saved query without any exports would cause an error due to an undefined relation variable. Exports are optional, and this fix ensures saved queries without exports don't fail.
- **New**: You can now query metric alias in <Constant name="semantic_layer" /> [GraphQL](/docs/dbt-cloud-apis/sl-graphql) and [JDBC](/docs/dbt-cloud-apis/sl-jdbc) APIs. 
  - For the JDBC API, refer to [Query metric alias](/docs/dbt-cloud-apis/sl-jdbc#query-metric-alias) for more information.
  - For the GraphQL API, refer to [Query metric alias](/docs/dbt-cloud-apis/sl-graphql#query-metric-alias) for more information.
- **Enhancement**: Added support to automatically refresh access tokens when Snowflake's SSO connection expires. Previously, users would get the following error: `Connection is not available, request timed out after 30000ms` and would have to wait 10 minutes to try again.
- **Enhancement**: The [`dbt_version` format](/reference/commands/version#versioning) in dbt Cloud now better aligns with [semantic versioning rules](https://semver.org/). Leading zeroes have been removed from the month and day (`YYYY.M.D+<suffix>`). For example:
  - New format: `2024.10.8+996c6a8`
  - Previous format: `2024.10.08+996c6a8`
