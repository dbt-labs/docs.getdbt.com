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

- **Enhancement:** State-aware orchestration now detects and rebuilds models when a model's table is deleted in the warehouse, even if there are no code or data changes. Previously, externally deleted tables were not detected and rebuilt if there were no code or data changes. For more information, see [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables).
- **Fix:** Debug logs in the **Run summary** tab are now properly truncated to improve performance and user interface responsiveness. Previously, debug logs were not truncated correctly, causing slower page loads. You can access the full debug logs by clicking **Download > Download all debug logs**. For more information, see [Run visibility](/docs/deploy/run-visibility#run-summary-tab).
- **New:** The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="query_page" /> is now generally available (GA), enabling you to build SQL queries against the Semantic Layer without writing SQL code.
- **Enhancement**: Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/cloud-integrations/downstream-exposures). 
