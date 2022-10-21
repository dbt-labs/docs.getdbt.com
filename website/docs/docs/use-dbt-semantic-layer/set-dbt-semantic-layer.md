---
title: "Set up the dbt Semantic Layer"
id: setup-dbt-semantic-layer
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

<VersionBlock firstVersion="1.3">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api">Metadata API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br /> 
- Have both your production and development environments running dbt version 1.2 (latest) <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=0.3.0", "<0.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api">Metadata API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>


:::caution Considerations

Some important considerations to know about during the Public Preview:

- Support for Snowflake data platform only (_additional data platforms coming soon_)
- Support for the deployment environment only (_development experience coming soon_)
- No support for jobs/environments using environment variables (_coming soon_)

:::


## Set up dbt Semantic Layer

Before you continue with the following steps, you **must** have a multi-tenant dbt Cloud account hosted in North America. 
 * Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud-apis/metadata-api) in the integrated partner tool to import metric definition. 
 * Developer accounts will be able to query the Proxy Server using SQL but will not be able to browse dbt metrics in external tools, which requires access to the Metadata API.


You can set up the dbt Semantic Layer in dbt Cloud at the environment level by following these steps:

1. Login to your dbt Cloud account

2. Go to **Account Settings**, create a [service account API token](docs/dbt-cloud-apis/service-tokens) and save your token somewhere safe

3. Go to your **Environment** and select your **Deployment** environment

4. Click on **Settings** on the top right side of the page

5. Click **Edit** on the top right side of the page

6. Select dbt version 1.2 (latest) or higher

7. Toggle the Semantic Layer **On**

8. Copy the full proxy server URL (like `https://eagle-hqya7.proxy.cloud.getdbt.com`) to connect to your [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations). 

9. Use the URL in the data source configuration of the integrated partner tool

10. Use the data platform login credentials that make sense for how the data is consumed

:::info📌 

Note  - It is _not_ recommended that you use your dbt Cloud credentials due to elevated permissions. Instead, you can use your specific integration tool permissions.

:::

11. Set up the [Metadata API](docs/dbt-cloud-apis/metadata-api) (Team and Enterprise accounts only) in the integrated partner tool to import the metric definitions. The [integrated parnter tool](https://www.getdbt.com/product/semantic-layer-integrations) will treat the dbt Server as another data source (like a data platform). This requires:

- The account ID, environment ID, and job ID (visible in the job URL)
- An [API service token](/docs/dbt-cloud-apis/service-tokens) with job admin and metadata permissions
- Add the items above to the relevant fields in your integration tool

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" /><br />

 
## Related docs

- [Integrated partner tools](https://www.getdbt.com/product/semantic-layer-integrations) for info on the different integration partners and their documentation
- [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) page for more information on plan availability
- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
