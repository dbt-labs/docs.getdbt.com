---
title: "Deprecation: dbt Metrics and the legacy dbt Semantic Layer is now deprecated"
description: "December 2023: For users on dbt v1.5 and lower, dbt Metrics and the legacy dbt Semantic Layer has been deprecated. Use the migration guide to migrate to and access the latest dbt Semantic Layer. "
sidebar_label: "Deprecation: dbt Metrics and Legacy dbt Semantic Layer"
sidebar_position: 09
date: 2023-12-15
---

dbt Labs has deprecated dbt Metrics and the legacy dbt Semantic Layer, both supported on dbt version 1.5 or lower. These changes will be in effect on _December 15th, 2023_.

This deprecation means dbt Metrics and the legacy Semantic Layer will no longer be supported. We will also remove the feature from the dbt Cloud user interface and documentation site.

### Why this change?

The [re-released dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), powered by MetricFlow, offers enhanced flexibility, performance, and user experience, marking a significant advancement for the dbt community.

### Key changes and impact

- **Deprecation date** &mdash; The legacy Semantic Layer and dbt Metrics will be officially deprecated on December 15th, 2023.
- **Replacement** &mdash; [MetricFlow](/docs/build/build-metrics-intro) replaces dbt Metrics for defining semantic logic. The `dbt_metrics` package will no longer be supported post-deprecation.
- **New feature** &mdash; Exports replaces the materializations functionality and will be available in dbt Cloud in December or January.


### Breaking changes and recommendations

- For users on dbt version 1.6 and lower with dbt Metrics and Snowflake proxy:
  - **Impact**: Post-deprecation, queries using the proxy _will not_ run.
  - **Action required:** _Immediate_ migration is necessary. Refer to the [dbt Semantic Layer migration guide](/guides/sl-migration?step=1)

- For users on dbt version 1.6 and lower using dbt Metrics without Snowflake proxy:
  - **Impact**: No immediate disruption, but the package will not receive updates or support after deprecation
  - **Recommendation**: Plan migration to the re-released Semantic Layer for compatibility with dbt version 1.6 and higher.

### Engage and support

- Feedback and community support &mdash; Engage and share feedback with the dbt Labs team and dbt Community slack using channels like [#dbt-cloud-semantic-layer](https://getdbt.slack.com/archives/C046L0VTVR6) and [#dbt-metricflow](https://getdbt.slack.com/archives/C02CCBBBR1D). Or reach out to your dbt Cloud account representative.
- Resources for upgrading &mdash;Refer to some additional info and resources to help you upgrade your dbt version:
  - [Upgrade version in dbt Cloud](/docs/dbt-versions/upgrade-core-in-cloud)
  - [Version migration guides](/docs/dbt-versions/core-upgrade)
