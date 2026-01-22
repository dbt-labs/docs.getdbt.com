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

## January 2026

- **Enhancement**: <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory (the folder you `cd` into and run commands from in your terminal), if one exists. This provides a simple way to manage credentials and configuration without hardcoding them in your `profiles.yml`. The [dbt VS Code extension](/docs/about-dbt-extension) also supports `.env` files as well as <Term id="lsp" />-powered features. For more information, refer to [Install <Constant name="fusion"/> CLI](/docs/fusion/install-fusion-cli#environment-variables). 
- **New**: The new <Constant name="semantic_layer"/>  YAML specification in the <Constant name="fusion_engine" /> creates an open standard for defining metrics and dimensions that works across multiple platforms. 
  
  Key changes:
  - Semantic models are now embedded within model YAML entries. This removes the need to manage YAML entries across multiple files.
  - Measures are now simple metrics. 
  - Frequently used options are now top-level keys, reducing YAML nesting depth.

  For an overview of the changes and steps how to migrate to the latest YAML spec, see [Migrate to the latest YAML spec](/docs/build/metrics-spec-fusion).
- **Fix:** Debug logs in the **Run summary** tab are now properly truncated to improve performance and user interface responsiveness. Previously, debug logs were not truncated correctly, causing slower page loads. You can access the full debug logs by clicking **Download > Download all debug logs**. For more information, see [Run visibility](/docs/deploy/run-visibility#run-summary-tab).
- **New:** The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="query_page" /> is now generally available (GA), enabling you to build SQL queries against the Semantic Layer without writing SQL code.
- **Enhancement**: Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/cloud-integrations/downstream-exposures). 
