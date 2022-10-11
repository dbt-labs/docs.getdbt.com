---
title: "Set up the dbt Semantic Layer"
id: setup-dbt-semantic-layer
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

With the dbt Semantic Layer, you'll be able to centrally define business metrics, remove code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integration tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

- Have a multi-tenant [dbt Cloud](https://cloud.getdbt.com/) Teams or Enterprise account. 
   * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API.
- Have both your production and development environments running dbt version 1.2 (latest) or higher
- Use Snowflake data platfrom 
- Install the [dbt metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) version 0.3.2 or higher in your dbt project
- Set up the [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated tool to import metric definitions
- Recommended - Review the [dbt metrics page](/docs/building-a-dbt-project/metrics) and [Getting started with the dbt Semantic Layer](https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog

:::caution Considerations

Some important considerations to know about during the public preview:

- Support for Snowflake data platform only (_additional data platforms coming soon_)
- Support for the deployment environment only (_development experience coming soon_)
- Do not use environment variables for the job/environment (_coming soon_)

:::


## Set up dbt Semantic Layer

Before you continue with the following steps, you **must** have a multi-tenant dbt Cloud Team or Enterprise plan. Developer accounts will be able to query the Proxy Server using SQL but will not be able to browse dbt metrics in external tools, which requires access to the Metadata API.


You can set up the dbt Semantic Layer in dbt Cloud at the environment level by following these steps:

1. Login to dbt Cloud and make sure you are using the new user interface (UI) (see example below)

2. Go to **Account Settings**, create a [service account API token](/docs/dbt-cloud/dbt-cloud-api/service-tokens) and save your token somewhere safe

3. Go to your **Environment** and select your **Deployment** environment

4. Click on **Settings** on the top right side of the page

5. Click **Edit** on the top right side of the page

6. Select dbt version 1.2 (latest) or higher

7. Toggle the Semantic Layer **On.**

8. Copy the full proxy server URL (like `https://eagle-hqya7.proxy.cloud.getdbt.com`) to connect to your [integrated tool](https://www.getdbt.com/product/semantic-layer-integrations). 

9. Use the URL in the data source configuration of the integrated tool

10. Use the warehouse login credentials that make sense for how the data is consumed

:::info📌 

Note  - It is *not* recommended that you use your dbt Cloud credentials due to elevated permissions. Instead, you can use your specific integration tool permissions.

:::

11. You need to set up the [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated tool to import the metric definitions. The integrated tool will treat the dbt Server as another data source (like a data platform). This requires:

- The account ID, environment ID, and job ID (visible in the job URL)
- An [API service token](/docs/dbt-cloud/dbt-cloud-api/service-tokens) with job admin and metadata permissions
- Add the items above to the relevant fields in your integration tool

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" />
