---
title: "Set up the dbt Semantic Layer"
id: setup-sl
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

<VersionBlock firstVersion="1.6">

:::info Upgrade your dbt version to access the dbt Semantic Layer

The dbt Semantic Layer has undergone a [significant revamp](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), making it more efficient to define and query metrics.

**What’s changed?** The dbt_metrics package has been [deprecated](https://docs.getdbt.com/blog/deprecating-dbt-metrics) and replaced with [MetricFlow](/docs/build/about-metricflow?version=1.6), one of the Semantic Layer's key component and a new way framework for defining metrics in dbt.

:::

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp />


<Snippet src="sl-considerations-banner" />


## Set up dbt Semantic Layer

Before you continue with the following steps, you **must** have a multi-tenant dbt Cloud account hosted in North America. 
 * Team and Enterprise accounts can set up the Semantic Layer and [Discovery API](/docs/dbt-cloud-apis/discovery-api) in the integrated partner tool to import metric definitions. 
 * Developer accounts can query the Proxy Server using SQL but won't be able to browse dbt metrics in external tools, which requires access to the Discovery API.

You can set up the dbt Semantic Layer in dbt Cloud at the environment level by following these steps:

1. Login to your dbt Cloud account
2. Go to **Account Settings**, and then **Service Tokens** to create a new [service account API token](/docs/dbt-cloud-apis/service-tokens). Save your token somewhere safe. 
3. Assign permissions to service account tokens depending on the integration tool you choose. You can review the [integration partner documentation](https://www.getdbt.com/product/semantic-layer-integrations) to determine the permission sets you need to assign.
4. Go to **Deploy** and then **Environment**, and select your **Deployment** environment.
5. Click on **Settings** on the top right side of the page.
6. Click **Edit** on the top right side of the page.
7. Select dbt version 1.2 or higher.
8. Toggle the Semantic Layer **On**.
9. Copy the full proxy server URL (like `https://eagle-hqya7.proxy.cloud.getdbt.com`) to connect to your [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations). 
10. Use the URL in the data source configuration of the integrated partner tool.
11. Use the data platform login credentials that make sense for how the data is consumed.

:::info📌 

Note  - It is _not_ recommended that you use your dbt Cloud credentials due to elevated permissions. Instead, you can use your specific integration tool permissions.

:::

12. Set up the [Discovery API](/docs/dbt-cloud-apis/discovery-api) (Team and Enterprise accounts only) in the integrated partner tool to import the metric definitions. The [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations) will treat the dbt Server as another data source (like a data platform). This requires:

- The account ID, environment ID, and job ID (visible in the job URL)
- An [API service token](/docs/dbt-cloud-apis/service-tokens) with job admin and metadata permissions
- Add the items above to the relevant fields in your integration tool

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" /><br />

 
## Related docs

- [Integrated partner tools](https://www.getdbt.com/product/semantic-layer-integrations) for info on the different integration partners and their documentation
- [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) page for more information on plan availability
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

<Snippet src="sl-prerequisites" />


<Snippet src="sl-considerations-banner" />


## Set up dbt Semantic Layer

<Snippet src="sl-set-up-steps" />

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" /><br />

 
## Related docs

- [Integrated partner tools](https://www.getdbt.com/product/semantic-layer-integrations) for info on the different integration partners and their documentation
- [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) page for more information on plan availability
- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations

</VersionBlock>
