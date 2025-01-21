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

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

## January 2025

- **New**: Users can now switch themes directly from the user menu. We have added support for **Light mode** (default), **Dark mode**, and automatic theme switching based on system preferences. The selected theme is stored in the user profile and will follow users across all devices.
  - Dark mode is currently available on the Developer plan and will be available for all [plans](https://www.getdbt.com/pricing) in the future. We’ll be rolling it out gradually, so stay tuned for updates. For more information, refer to [dbt Cloud dark mode](/docs/cloud/about-cloud/dark-mode).
- **Fix**: Fixed an issue where [saved queries](/docs/build/saved-queries) with no [exports](/docs/build/saved-queries#configure-exports) would fail with an `UnboundLocalError`. Previously, attempting to process a saved query without any exports would cause an error due to an undefined relation variable. Exports are optional, and this fix ensures saved queries without exports don't fail.
- **New**: You can now query metric alias in dbt Semantic Layer [GraphQL](/docs/dbt-cloud-apis/sl-graphql) and [JDBC](/docs/dbt-cloud-apis/sl-jdbc) APIs. 
  - For the JDBC API, refer to [Query metric alias](/docs/dbt-cloud-apis/sl-jdbc#query-metric-alias) for more information.
  - For the GraphQL API, refer to [Query metric alias](/docs/dbt-cloud-apis/sl-graphql#query-metric-alias) for more information.
- **Enhancement**: Added support to automatically refresh access tokens when Snowflake's SSO connection expires. Previously, users would get the following error: `Connection is not available, request timed out after 30000ms` and would have to wait 10 minutes to try again.
- **Enhancement**: The [`dbt_version` format](/reference/commands/version#versioning) in dbt Cloud now better aligns with [semantic versioning rules](https://semver.org/). Leading zeroes have been removed from the month and day (`YYYY.M.D+<suffix>`). For example:
  - New format: `2024.10.8+996c6a8`
  - Previous format: `2024.10.08+996c6a8`
