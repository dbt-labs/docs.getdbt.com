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

- **Enhancement**: Added support to automatically refresh access tokens when Snowflake's SSO connection expires. Previously, users would get the following error: `Connection is not available, request timed out after 30000ms` and would have to wait 10 minutes to try again.
- **Enhancement**: The [`dbt_version` format](/reference/commands/version#versioning) in dbt Cloud now better aligns with [semantic versioning rules](https://semver.org/). Leading zeroes have been removed from the month and day (`YYYY.M.D+<suffix>`). For example:
  - New format: `2024.10.8+996c6a8`
  - Previous format: `2024.10.08+996c6a8`
