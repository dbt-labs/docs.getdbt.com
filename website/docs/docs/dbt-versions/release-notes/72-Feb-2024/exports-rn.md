---
title: "New: Use exports to write saved queries"
description: "February 2024: Use the exports feature to write and schedule saved queries with dbt Cloud, and integrate with additional tools."
sidebar_label: "New: Use exports to write saved queries"
sidebar_position: 09
tags: [Feb-2024]
date: 2024-02-07
---

You can now use the [exports](/docs/use-dbt-semantic-layer/exports) feature with [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), allowing you to query reliable metrics and fast data reporting. Exports enhance the saved queries feature, allowing you to write commonly used queries directly within your data platform using dbt Cloud's job scheduler.

By exposing tables of metrics and dimensions, exports enable you to integrate with additional tools that don't natively connect with the dbt Semantic Layer, such as PowerBI.

Exports are available for dbt Cloud multi-tenant [Team or Enterprise](https://www.getdbt.com/pricing/) plans on dbt versions 1.7 or newer. Refer to the [exports blog](https://www.getdbt.com/blog/announcing-exports-for-the-dbt-semantic-layer) for more details.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />
