---
title: "About Snowflake Native App for dbt"
id: "snowflake-native-app"
sidebar_label: "About Snowflake Native App"
description: "An overview of the Snowflake Native App for dbt Cloud"
pagination_prev: null
pagination_next: "docs/cloud-integrations/set-up-snowflake-native-app"
---

# About Snowflake Native App for dbt <Lifecycle status='public preview' />

The Snowflake Native App for dbt, powered by the Snowflake Native App Framework and Snowpark Container Services, extends your dbt Cloud experience into the Snowflake user interface. With their Snowflake login, users will be able to access these three experiences: 

- **dbt Explorer** &mdash; An embedded version of [dbt Explorer](/docs/collaborate/explore-projects) 
- **Ask dbt** &mdash; A [dbt-assisted](/docs/cloud/dbt-assist) chatbot powered by the dbt Semantic Layer and Snowflake Cortex
- **Orchestration observability** &mdash; A [view into the job run history](/docs/deploy/run-visibility)

These experiences enable you to extend what you have built with dbt Cloud to new users who have traditionally been dependencies downstream from the dbt project. This includes BI analysts and technical stakeholders. 


## Architecure

There are three tools connected to operate the dbt for Snowflake Native App:

| Tool                               | Description |
|------------------------------------|-------------|
| Consumer’s Snowflake account       | This is where the Native app is installed, powered by Snowpark Container Services. <br /><br /> The Native app can make calls to the dbt Cloud APIs and Datadog (for logging) via [Snowflake External Access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview). <br /><br />To power **Ask dbt**, the dbt Semantic Layer accesses the Cortex LLM to execute queries and generate text based on the prompt. This is configured when the user sets up the Semantic Layer environment. | 
| dbt Labs Product Snowflake account | This is where the Native app application package is hosted and then installed into the consumer account. <br /><br />This is where the Consumer’s event table is shared to for application monitoring and logging. |
| Consumer’s dbt Cloud account       | The Native app interacts with the dbt Cloud APIs for metadata and processing Semantic Layer queries to power the Native app experiences. <br /> <br /> The dbt Cloud account also calls the Consumer Snowflake account to utilize the warehouse to execute dbt queries for orchestration and the Cortex LLM to power Ask dbt. |

The following diagram provides an illustration of the architecure:

<Lightbox src="/img/docs/cloud-integrations/architecture-dbt-snowflake-native-app.png" title="Architecture of dbt Cloud and Snowflake integration"/>


## Access
Users can log in to the Native App using their normal Snowflake login authentication method. During this [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud), users will not need a dbt Cloud seat to access the application but this is subject to change. This means users will not need to provide their dbt Cloud credentials to access the application. 

App users are able to access all information that's available to the service token.

## Procurement
The Native App is available from the Snowflake Marketplace with a dbt Cloud Enterprise contract. If you're interested, please [contact us](matilto:sales_snowflake_marketplace@dbtlabs.com) for more information. 

## Support
If you have any questions about your Snowflake Native App for dbt, you may [contact our Support team](mailto:dbt-snowflake-marketplace@dbtlabs.com) for help. Please provide information about your installation of the Native App, including your dbt Cloud account ID and Snowflake account identifier. 
