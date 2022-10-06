---
title: "Set up the dbt Semantic Layer"
id: setup-dbt-semantic-layer
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

# Set up dbt Semantic Layer

After defining your metrics, configure the dbt Semantic Layer in dbt Cloud to connect with your integration tool. 

### Prerequisites

To use the dbt Semantic Layer, make sure you meet the following:

- Multi-tenant [dbt Cloud](https://cloud.getdbt.com/) Teams or Enterprise account
- Set up the [Metadata API](/docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated tool to import metric definitions
- [dbt metrics](/docs.getdbt.com/docs/building-a-dbt-project/metrics) defined in a project using dbt version 1.2 (latest) or higher with a production job run
- [Install](/docs.getdbt.com/docs/building-a-dbt-project/package-management#how-do-i-add-a-package-to-my-project) the [metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) version 0.3.2 or higher in your dbt project
- Use a Snowflake data warehouse (additional warehouses coming soon)
- Do not environment variables for the job/environment (coming soon)

### Set up dbt Semantic Layer

You can set up the dbt Semantic Layer in dbt Cloud at the Environment level by following the below steps:

1. Login to dbt Cloud and make sure you are using the new/beta UI *(see example below)*
2. Go to **Account Settings**, create a [service account API token](/docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens) and save your token somewhere safe
3. Go to your **Environment** and select your **Deployment** environment
4. Click on **Settings** on the top right side of the page
5. Click **Edit** on the top right side of the page
6. Select dbt version 1.2 (latest) or higher
7. Toggle the Semantic Layer on
8. Copy the full proxy server URL for example, `https://eagle-hqya7.proxy.cloud.getdbt.com`
9. Use the URL in the data source configuration of the integrated tool
10. Use the warehouse login credentials that make sense for how the data is consumed

:::
📌 Note  - It is *not* recommended that you use your dbt Cloud credentials due to elevated permissions. Instead, you can use your specific BI permissions.

:::

You need to set up the **[Metadata API](/docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview)** in the integrated tool to import the metric definitions. The integrated tool will treat the dbt Server as another data source, like a warehouse. This will require:

- The account ID, environment ID, and job ID (visible in the job URL)
- An [API service token](/docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens) with job admin and metadata permissions
- Add the items above to the relevant fields in your integration tool

[https://lh5.googleusercontent.com/I3NH_B-JKxD6Xr-mDL3YGtJC5-iWbq9Xt3NFzgvaZH5rIHkMSx91abT7WWrcwa7UFsTkzurlAh_qZZYmyaNVJrLIaI1UQOEz0mngFWcHzm1_JHlwiC5kifxVzbhjU4cdc1OjlFi_k0rEZNGD4Vh0F6E](https://lh5.googleusercontent.com/I3NH_B-JKxD6Xr-mDL3YGtJC5-iWbq9Xt3NFzgvaZH5rIHkMSx91abT7WWrcwa7UFsTkzurlAh_qZZYmyaNVJrLIaI1UQOEz0mngFWcHzm1_JHlwiC5kifxVzbhjU4cdc1OjlFi_k0rEZNGD4Vh0F6E)

