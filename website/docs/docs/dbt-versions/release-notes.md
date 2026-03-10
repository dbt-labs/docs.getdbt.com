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

## March 2026

- **New**: The new <Constant name="semantic_layer"/> YAML specification is now available on the <Constant name="dbt_platform" /> **Latest** release track. For an overview of the changes and steps how to migrate to the latest YAML spec, see [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).

## February 2026

- **New**: Advanced CI (dbt compare in orchestration) is now supported in the <Constant name="fusion_engine" />. For more information, see [Advanced CI](/docs/deploy/advanced-ci).
- **Beta**: The `dbt-salesforce` adapter available in the <Constant name="fusion_engine" /> CLI is now in beta. For more information, see [Salesforce Data 360 setup](/docs/fusion/connect-data-platform-fusion/salesforce-data-cloud-setup).
- **Enhancement:** The Analyst permission now has the project-level access to read repositories. See [Project access for project permissions](/docs/cloud/manage-access/enterprise-permissions#project-access-for-project-permissions) for more information.
- **Enhancement:** After a user accepts an email [invite](/docs/cloud/manage-access/invite-users) to access an [SSO-protected](/docs/cloud/manage-access/sso-overview) <Constant name="dbt_platform"/> account, the UI now prompts them to log in with SSO to complete the process. This replaces the previous "Joined successfully" message, helping avoid confusion when users accept an invite but do not complete the SSO login flow.
- **New:** [Profiles](/docs/cloud/about-profiles) let you define and manage connections, credentials, and attributes for deployment environments at the project level. dbt automatically creates profiles for existing projects and environments based on the current configurations, so you don't need to take any action. This is being rolled out in phases during the coming weeks.
- **New**: [Python UDFs](/docs/build/udfs) are now supported and available in <Constant name="fusion_engine" /> when using Snowflake or BigQuery.
- **Enhancement:** Minor enhancements and UI updates to the <Constant name="cloud_ide" />, file explorer that replicate the VS Code IDE experience.
- **Enhancement:** Profile creation now displays specific validation error messages (such as "Profile keys cannot contain spaces or special characters") instead of generic error text, making it easier to identify and fix configuration issues.
- **Private beta**: [Cost Insights](/docs/explore/cost-insights) shows estimated warehouse compute costs and run times for your dbt projects and models, directly in the <Constant name="dbt_platform" />. It highlights cost reductions and efficiency gains from optimizations like [state-aware orchestration](/docs/deploy/state-aware-about) across your project dashboard, model pages, and job details. See [Set up Cost Insights](/docs/explore/set-up-cost-insights) and [Explore cost data](/docs/explore/explore-cost-data) to learn more.
- **New**: The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) now supports [Omni](https://docs.omni.co/integrations/dbt/semantic-layer) as a partner integration. For more info, see [Available integrations](/docs/cloud-integrations/avail-sl-integrations).
- **Enhancement**: We clarified documentation for cumulative log size limits on run endpoints, originally introduced in [October 2025](/docs/dbt-versions/2025-release-notes#october-2025). When logs exceed the cumulative size limit, dbt omits them and displays a banner. No functional changes were made in February 2026. For more information, see [Run visibility](/docs/deploy/run-visibility#log-size-limits).
- **New**: The `immutable_where` configuration is now supported for Snowflake dynamic tables. For more information, see [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where).
- **Fix**: The user invite details now show more information in invite status, giving admins visibility into users who accepted an invite to an SSO-protected account but haven't yet logged in via SSO. Previously, these invites were hidden, making it appear as if the user hadn't been invited. 
The Invites endpoints of the dbt platform Admin v2 API now include these additional statuses:
  - `4` (PENDINGEMAIL_VERIFICATION)
  - `5` (EMAIL_VERIFIED_SSO).
- **Enhancement**: Improved performance on Runs endpoint for Admin V2 API and run details in dbt platform when connecting with GCP.

## January 2026

- **Enhancement:** The `defer-env-id` setting for choosing which deployment environment to defer to is [now available](/docs/cloud/about-cloud-develop-defer#defer-environment) in the <Constant name="cloud_ide" />. Previously, this configuration only worked for the <Constant name="cloud_cli" />
- **Beta:** The [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) in dbt <Constant name="query_page" /> is now in beta. 
  - dbt <Constant name="copilot" />'s AI assistant in <Constant name="query_page" /> now uses a dropdown menu to select between **Agent** and **Generate SQL**, replacing the previous tab interface.
- **Enhancement:** The [Studio IDE](/docs/cloud/studio-ide/ide-user-interface#search-your-project) now includes search and replace functionality and a command palette, enabling you to quickly find and replace text across your project, navigate files, jump to symbols, and run IDE configuration commands. This feature is being rolled out in phases and will become available to all <Constant name="dbt_platform" /> accounts by mid-February. 
- **Enhancement:** [State-aware orchestration](/docs/deploy/state-aware-about) improvements:
  - When a model fails a data test, state-aware orchestration rebuilds it on subsequent runs instead of reusing it from prior state to ensure dbt reevaluates data quality issues.
  - State-aware orchestration now detects and rebuilds models whose tables are deleted from the warehouse, even when there are no code or data changes. Previously, tables deleted externally were not detected, and therefore not rebuilt, unless code or data had changed. For more information, see [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables). 

  State-aware orchestration is in private preview. See the [prerequisites for using the feature](/docs/deploy/state-aware-setup#prerequisites).
- **Enhancement:** [dbt <Constant name="copilot" />](/docs/cloud/dbt-copilot) correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.
- **Enhancement**: The <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory (the folder you `cd` into and run dbt commands from in your terminal), if one exists. This provides a simple way to manage credentials and configuration without hardcoding them in your `profiles.yml`. The [dbt VS Code extension](/docs/about-dbt-extension) also supports `.env` files as well as <Term id="lsp" />-powered features. For more information, refer to [Install <Constant name="fusion"/> CLI](/docs/local/install-dbt?version=2#get-started#environment-variables). 
- **New**: The new <Constant name="semantic_layer"/>  YAML specification creates an open standard for defining metrics and dimensions that works across multiple platforms. The new spec is now live in the <Constant name="fusion_engine" />.
  
  Key changes:
  - Semantic models are now embedded within model YAML entries. This removes the need to manage YAML entries across multiple files.
  - Measures are now simple metrics. 
  - Frequently used options are now top-level keys, reducing YAML nesting depth.

  For an overview of the changes and steps how to migrate to the latest YAML spec, see [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).
- **Fix:** Debug logs in the **Run summary** tab are now properly truncated to improve performance and user interface responsiveness. Previously, debug logs were not truncated correctly, causing slower page loads. You can access the full debug logs by clicking **Download > Download all debug logs**. For more information, see [Run visibility](/docs/deploy/run-visibility#run-summary-tab).
- **New:** The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="query_page" /> is now generally available (GA), enabling you to build SQL queries against the Semantic Layer without writing SQL code.
- **Enhancement**: Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/cloud-integrations/downstream-exposures). 
