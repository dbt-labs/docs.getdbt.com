---
title: "Update: dbt Cloud Semantic Layer is Generally Available"
description: "October 2023: dbt Cloud Semantic Layer is Generally Available for all users"
sidebar_label: "Update: dbt Cloud Semantic Layer is GA"
sidebar_position: 05
date: 2023-10-17
tags: [Oct-2023]
---

:::important
If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher and [migrate](/guides/migration/sl-migration) to the re-released Semantic Layer.
:::

dbt Labs is thrilled to announce that the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is now generally available to the public. It offers consistent data organization, improved governance, reduced costs, enhanced efficiency, and accessible data for better decision-making and collaboration across organizations.

It aims to bring the best of modeling and semantics to downstream applications by introducing:

- Brand new [integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) with Tableau, Google Sheets, Hex, Mode, and Lightdash.
- New [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) using GraphQL and JDBC to query metrics and build integrations.
- dbt Cloud [multi-tenant regional](/docs/cloud/about-cloud/regions-ip-addresses) support for North American, EMEA, and APAC (Single-Tenant support coming soon).
- Use the APIs to call an export (a way for you to build tables in your data platform), then access them in your preferred BI tool. (Support for scheduling exports as part of your dbt job is coming on db v1.7 or higher.)

The dbt Semantic Layer is available to [dbt Cloud Team or Enterprise](https://www.getdbt.com/) multi-tenant plans on dbt v1.6 or higher. dbt Cloud Developer plans and dbt Core users can use the dbt Cloud IDE or MetricFlow CLI to define metrics, but won't be able to query them with integrated tools.


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="75%" title="The universal dbt Semantic Layer connecting to integration tools."/>



