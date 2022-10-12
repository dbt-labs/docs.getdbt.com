---
title: "Set up the dbt Semantic Layer"
id: setup-dbt-semantic-layer
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

<VersionBlock firstVersion=“1.3” lastVersion=“1.3">
                                                  
<span>&#8226;</span> Have a multi-tenant <a href=“https://cloud.getdbt.com/”>dbt Cloud</a> account.  <br /b>
   * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br /b>
<span>&#8226;</span> Have both your production and development environments running dbt version 1.3 or higher <br /b>
<span>&#8226;</span> Use Snowflake data platform <br /b>
<span>&#8226;</span> Install the <a href=“https://hub.getdbt.com/dbt-labs/metrics/latest/”>dbt metrics package</a> version “>=1.3.0”, “<1.4.0" in your dbt project <br /b>
<span>&#8226;</span> Set up the <a href”/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview”>Metadata API</a> in the integrated tool to import metric definitions <br /b>
<span>&#8226;</span> Recommended - Review the <a href=“/docs/building-a-dbt-project/metrics”>dbt metrics page</a> and <a href=“https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer”>Getting started with the dbt Semantic Layer</a> blog <br /b>
</VersionBlock>

<VersionBlock firstVersion=“1.2” lastVersion=“1.2">
                                                  
<span>&#8226;</span>Have a multi-tenant <a href=“https://cloud.getdbt.com/”>dbt Cloud</a> account.  <br /b>
   * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br /b>
<span>&#8226;</span> Have both your production and development environments running dbt version 1.2 (latest)  <br /b>
<span>&#8226;</span>Use Snowflake data platform  <br /b>
<span>&#8226;</span>Install the <a href=“https://hub.getdbt.com/dbt-labs/metrics/latest/”>dbt metrics package</a> version “>=0.3.0”, “<0.4.0" in your dbt project <br /b>
<span>&#8226;</span> Set up the <a href=“/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview”>Metadata API</a> in the integrated tool to import metric definitions <br /b>
<span>&#8226;</span>Recommended - Review the <a href=“/docs/building-a-dbt-project/metrics”>dbt metrics page</a> and  <a href=“https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer”>Getting started with the dbt Semantic Layer</a> blog <br /b>

</VersionBlock>

<---!
<Snippet src="sl-prerequisites" />
--->

:::caution Considerations

Some important considerations to know about during the Public Preview:

- Support for Snowflake data platform only (_additional data platforms coming soon_)
- Support for the deployment environment only (_development experience coming soon_)
- Do not use environment variables for the job/environment (_coming soon_)

:::


## Set up dbt Semantic Layer

Before you continue with the following steps, you **must** have a multi-tenant dbt Cloud account. Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated partner tool to import metric definition. Developer accounts will be able to query the Proxy Server using SQL but will not be able to browse dbt metrics in external tools, which requires access to the Metadata API.


You can set up the dbt Semantic Layer in dbt Cloud at the environment level by following these steps:

1. Login to dbt Cloud and make sure you are using the new user interface (UI) (see example below)

2. Go to **Account Settings**, create a [service account API token](/docs/dbt-cloud/dbt-cloud-api/service-tokens) and save your token somewhere safe

3. Go to your **Environment** and select your **Deployment** environment

4. Click on **Settings** on the top right side of the page

5. Click **Edit** on the top right side of the page

6. Select dbt version 1.2 (latest) or higher

7. Toggle the Semantic Layer **On.**

8. Copy the full proxy server URL (like `https://eagle-hqya7.proxy.cloud.getdbt.com`) to connect to your [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations). 

9. Use the URL in the data source configuration of the integrated partner tool

10. Use the data platform login credentials that make sense for how the data is consumed

:::info📌 

Note  - It is *not* recommended that you use your dbt Cloud credentials due to elevated permissions. Instead, you can use your specific integration tool permissions.

:::

11. You need to set up the [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) (Team and Enterprise accounts only) in the integrated partner tool to import the metric definitions. The integrated parnter tool will treat the dbt Server as another data source (like a data platform). This requires:

- The account ID, environment ID, and job ID (visible in the job URL)
- An [API service token](/docs/dbt-cloud/dbt-cloud-api/service-tokens) with job admin and metadata permissions
- Add the items above to the relevant fields in your integration tool

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" />
