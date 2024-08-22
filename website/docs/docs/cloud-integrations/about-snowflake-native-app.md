---
title: "About the dbt Snowflake Native App"
id: "snowflake-native-app"
description: "An overview of the dbt Snowflake Native App for dbt Cloud accounts"
pagination_prev: null
pagination_next: "docs/cloud-integrations/set-up-snowflake-native-app"
---

# About the dbt Snowflake Native App <Lifecycle status='preview' />

The dbt Snowflake Native App &mdash; powered by the Snowflake Native App Framework and Snowpark Container Services &mdash; extends your dbt Cloud experience into the Snowflake user interface. You'll be able to access these three experiences with your Snowflake login: 

- **dbt Explorer** &mdash; An embedded version of [dbt Explorer](/docs/collaborate/explore-projects) 
- **Ask dbt** &mdash; A dbt-assisted chatbot, powered by [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), OpenAI, and Snowflake Cortex
- **Orchestration observability** &mdash; A view into the [job run history](/docs/deploy/run-visibility) and sample code to create Snowflake tasks that trigger [deploy jobs](/docs/deploy/deploy-jobs). 

These experiences enable you to extend what's been built with dbt Cloud to users who have traditionally worked downstream from the dbt project, such as BI analysts and technical stakeholders. 

For installation instructions, refer to [Set up the dbt Snowflake Native App](/docs/cloud-integrations/set-up-snowflake-native-app).

## Architecture

There are three tools connected to the operation of the dbt Snowflake Native App:

| Tool                               | Description |
|------------------------------------|-------------|
| Consumer’s Snowflake account       | The location of where the Native App is installed, powered by Snowpark Container Services. <br /><br /> The Native App makes calls to the dbt Cloud APIs and Datadog APIs (for logging) using [Snowflake's external network access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview). <br /><br />To power the **Ask dbt** chatbot, the dbt Semantic Layer accesses the Cortex LLM to execute queries and generate text based on the prompt. This is configured when the user sets up the Semantic Layer environment. | 
| dbt product Snowflake account | The location of where the Native App application package is hosted and then distributed into the consumer account. <br /><br />The consumer's event table is shared to this account for application monitoring and logging. |
| Consumer’s dbt Cloud account       | The Native App interacts with the dbt Cloud APIs for metadata and processing Semantic Layer queries to power the Native App experiences. <br /> <br /> The dbt Cloud account also calls the consumer Snowflake account to utilize the warehouse to execute dbt queries for orchestration and the Cortex LLM Arctic to power the **Ask dbt** chatbot. |

The following diagram provides an illustration of the architecture:

<Lightbox src="/img/docs/cloud-integrations/architecture-dbt-snowflake-native-app.png" title="Architecture of dbt Cloud and Snowflake integration"/>


## Access
You can log in to the dbt Snowflake Native App using your regular Snowflake login authentication method. During this [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud), you do not need dbt Cloud credentials (a dbt Cloud seat) to access the application but this is subject to change. 

App users are able to access all information that's available to the API service token.

## Procurement
The dbt Snowflake Native App is available on the [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3). With the purchase of the listing, users will have access to the Native App and a dbt Cloud account that's on the Enterprise plan. 

If you're interested, please [contact us](matilto:sales_snowflake_marketplace@dbtlabs.com) for more information. 

## Support
If you have any questions about the dbt Snowflake Native App, you may [contact our Support team](mailto:dbt-snowflake-marketplace@dbtlabs.com) for help. Please provide information about your installation of the Native App, including your dbt Cloud account ID and Snowflake account identifier. 

## Limitations
- The Native app does not support dbt Cloud accounts with [IP Restrictions](/docs/cloud/secure/ip-restrictions] enabled. 
