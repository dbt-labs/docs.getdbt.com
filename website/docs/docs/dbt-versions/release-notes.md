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

## February 2026
- **Documentation clarification**: Cumulative log size limits on run endpoints were introduced in [October 2025](/docs/dbt-versions/2025-release-notes#october-2025) but the change was not documented at that time. When logs exceed the cumulative size limit, they are omitted and a banner is displayed. For more information, see [Run visibility](/docs/deploy/run-visibility#log-size-limits). No functional changes were made in February 2026.
- **New**: The `immutable_where` configuration is now supported for Snowflake dynamic tables. For more information, see [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where).

## January 2026

- **Beta:** The [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) in dbt <Constant name="query_page" /> is now in beta. 
  - dbt <Constant name="copilot" />'s AI assistant in <Constant name="query_page" /> now uses a dropdown menu to select between **Agent** and **Generate SQL**, replacing the previous tab interface.
- **Enhancement:** The [Studio IDE](/docs/cloud/studio-ide/ide-user-interface#search-your-project) now includes search and replace functionality and a command palette, enabling you to quickly find and replace text across your project, navigate files, jump to symbols, and run IDE configuration commands. This feature is being rolled out in phases and will become available to all <Constant name="dbt_platform" /> accounts by mid-February. 
- **Enhancement:** [State-aware orchestration](/docs/deploy/state-aware-about) improvements:
  - When a model fails a data test, state-aware orchestration rebuilds it on subsequent runs instead of reusing it from prior state to ensure dbt reevaluates data quality issues.
  - State-aware orchestration now detects and rebuilds models whose tables are deleted from the warehouse, even when there are no code or data changes. Previously, tables deleted externally were not detected, and therefore not rebuilt, unless code or data had changed. For more information, see [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables). 

  State-aware orchestration is in private preview. See the [prerequisites for using the feature](/docs/deploy/state-aware-setup#prerequisites).
- **Enhancement:** [dbt <Constant name="copilot" />](/docs/cloud/dbt-copilot) correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.
- **Enhancement**: The <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory (the folder you `cd` into and run dbt commands from in your terminal), if one exists. This provides a simple way to manage credentials and configuration without hardcoding them in your `profiles.yml`. The [dbt VS Code extension](/docs/about-dbt-extension) also supports `.env` files as well as <Term id="lsp" />-powered features. For more information, refer to [Install <Constant name="fusion"/> CLI](/docs/fusion/install-fusion-cli#environment-variables). 
- **New**: The new <Constant name="semantic_layer"/>  YAML specification creates an open standard for defining metrics and dimensions that works across multiple platforms. The new spec is now live in the <Constant name="fusion_engine" />.
  
  Key changes:
  - Semantic models are now embedded within model YAML entries. This removes the need to manage YAML entries across multiple files.
  - Measures are now simple metrics. 
  - Frequently used options are now top-level keys, reducing YAML nesting depth.

  For an overview of the changes and steps how to migrate to the latest YAML spec, see [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).
- **Fix:** Debug logs in the **Run summary** tab are now properly truncated to improve performance and user interface responsiveness. Previously, debug logs were not truncated correctly, causing slower page loads. You can access the full debug logs by clicking **Download > Download all debug logs**. For more information, see [Run visibility](/docs/deploy/run-visibility#run-summary-tab).
- **New:** The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="query_page" /> is now generally available (GA), enabling you to build SQL queries against the Semantic Layer without writing SQL code.
- **Enhancement**: Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/cloud-integrations/downstream-exposures). 
