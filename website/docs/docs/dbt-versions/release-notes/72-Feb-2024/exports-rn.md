---
title: "New: Materialize saved queries with Exports"
description: "February 2024: Use Exports to schedule saved queries with with dbt Cloud and integration with additional tools."
sidebar_label: "New: Materialize saved queries with Exports"
sidebar_position: 09
tags: [Feb-2024]
date: 2024-02-08
---

You can now use [Exports](/docs/use-dbt-semantic-layer/exports) to materialize saved queries in your data platform, on a schedule. It uses the dbt Cloud job scheduler to execute saved queries for reliable and fast data reporting.

Exports enable custom integration with additional tools that don't natively connect with the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), such as PowerBI.

Exports are available on dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) plans and dbt versions 1.7 or higher.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Adding --include-saved-query to the dbt build command in your job execution settings." />
