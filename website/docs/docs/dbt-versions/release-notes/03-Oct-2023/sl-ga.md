---
title: "Update: dbt Cloud Semantic Layer is Generally Available"
description: "October 2023: dbt Cloud Semantic Layer is Generally Available for all users"
sidebar_label: "Update: dbt Cloud Semantic Layer is GA"
sidebar_position: 05
date: 2023-10-17
tags: [Oct-2023]
---

:::important
If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher and [migrate](/guides/migration/sl-migration) to the latest Semantic Layer.
:::

dbt Labs is thrilled to announce that the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is now generally available. It offers consistent data organization, improved governance, reduced costs, enhanced efficiency, and accessible data for better decision-making and collaboration across organizations.

It aims to bring the best of modeling and semantics to downstream applications by introducing:

- Brand new [integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) such as Tableau, Google Sheets, Hex, Mode, and Lightdash.
- New [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) using GraphQL and JDBC to query metrics and build integrations.
- dbt Cloud [multi-tenant regional](/docs/cloud/about-cloud/regions-ip-addresses) support for North America, EMEA, and APAC. Single-tenant support coming soon.
- Use the APIs to call an export (a way to build tables in your data platform), then access them in your preferred BI tool.  Starting from dbt v1.7 or higher, you will be able to schedule exports as part of your dbt job.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="80%" title="Use the universal dbt Semantic Layer to define and queried metrics in integration tools."/>

The dbt Semantic Layer is available to [dbt Cloud Team or Enterprise](https://www.getdbt.com/) multi-tenant plans on dbt v1.6 or higher. 
- Team and Enterprise customers can use 1,000 Queried Metrics per month for no additional cost on a limited trial basis, subject to reasonable use limitations. Refer to [Billing](/docs/cloud/billing#what-counts-as-a-queried-metric) for more information.
- dbt Cloud Developer plans and dbt Core users can define metrics but won't be able to query them with integrated tools.
