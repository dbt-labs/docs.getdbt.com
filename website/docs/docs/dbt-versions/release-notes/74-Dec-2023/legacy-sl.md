---
title: "Deprecation: dbt Metrics and the legacy dbt Semantic Layer is now deprecated"
description: "December 2023: For users on dbt v1.5 and lower, dbt Metrics and the legacy dbt Semantic Layer has been deprecated. Use the migration guide to migrate to and access the latest dbt Semantic Layer. "
sidebar_label: "Deprecation: dbt Metrics and Legacy dbt Semantic Layer"
sidebar_position: 09
date: 2023-12-15
---

dbt Labs has deprecated dbt Metrics and the legacy dbt Semantic Layer, both supported on dbt version 1.5 or lower. These changes will be in effect on _December 15th, 2023_.

This deprecation means dbt Metrics and the legacy Semantic Layer will no longer be supported. We will also remove the product from the dbt Cloud user interface and [documentation site](https://docs.getdbt.com/).

### Why this change?

We understand that changes of this nature can be disruptive and we believe in the potential of the new direction. The [re-released dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), powered by MetricFlow, is a significantly improved foundation that enables more flexible query generation, faster performance, and a more dynamic consumption experience. It’s a step towards a brighter future for dbt and its community.

### Key changes

- Legacy Semantic Layer and dbt Metrics will officially be deprecated on December 15th, 2023.
- MetricFlow has replaced dbt Metrics for the construction of semantic logic. The `dbt_metrics` package will no longer be supported.
- Exports replaces Materializations. Exports will be available in December or January in dbt Cloud and replaces the previous materializations functionality.

### Actions 

- If you're using the legacy dbt Semantic Layer or dbt Metrics, use the [dbt Semantic Layer migration guide](/guides/sl-migration?step=1) to migrate over to the re-released dbt Semantic Layer.
- Engage and share feedback with the dbt Labs team and dbt Community slack using channels like [#dbt-cloud-semantic-layer](https://getdbt.slack.com/archives/C046L0VTVR6) and [#dbt-metricflow](https://getdbt.slack.com/archives/C02CCBBBR1D). Or reach out to your dbt Cloud account representative.
- Refer to some additional info and resources to help you upgrade your dbt version:

  - [Upgrade version in dbt Cloud](/docs/dbt-versions/upgrade-core-in-cloud)
  - [Version migration guides](/docs/dbt-versions/core-upgrade)
