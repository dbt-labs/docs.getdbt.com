---
title: "About the dbt Snowflake Native App"
id: "snowflake-native-app"
description: "An overview of the dbt Snowflake Native App for dbt accounts"
pagination_prev: null
pagination_next: "docs/platform-integrations/set-up-snowflake-native-app"
unlisted: true

---

# About the dbt Snowflake Native App <Lifecycle status='preview' />

The dbt Snowflake Native App &mdash; powered by the Snowflake Native App Framework and Snowpark Container Services &mdash; extends your <Constant name="dbt" /> experience into the Snowflake user interface. You'll be able to access these three experiences with your Snowflake login: 

- **<Constant name="catalog" />** &mdash; An embedded version of [<Constant name="catalog" />](/docs/explore/explore-projects) 
- **Copilot** &mdash; A dbt-assisted chatbot, powered by [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), OpenAI, and Snowflake Cortex
- **Orchestration observability** &mdash; A view into the [job run history](/docs/deploy/run-visibility) and sample code to create Snowflake tasks that trigger [deploy jobs](/docs/deploy/deploy-jobs). 

These experiences enable you to extend what's been built with <Constant name="dbt" /> to users who have traditionally worked downstream from the dbt project, such as BI analysts and technical stakeholders. 

For installation instructions, refer to [Set up the dbt Snowflake Native App](/docs/platform-integrations/set-up-snowflake-native-app).

## Architecture

There are three tools connected to the operation of the dbt Snowflake Native App:

| Tool                               | Description |
|------------------------------------|-------------|
| Consumer’s Snowflake account       | The location of where the Native App is installed, powered by Snowpark Container Services. <br /><br /> The Native App makes calls to the <Constant name="dbt" /> APIs and Datadog APIs (for logging) using [Snowflake's external network access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview). <br /><br />To power the **Copilot** chatbot, the <Constant name="semantic_layer" /> accesses the Cortex LLM to execute queries and generate text based on the prompt. This is configured when the user sets up the <Constant name="semantic_layer" /> environment. | 
| dbt product Snowflake account | The location of where the Native App application package is hosted and then distributed into the consumer account. <br /><br />The consumer's event table is shared to this account for application monitoring and logging. |
| Consumer’s <Constant name="dbt" /> account       | The Native App interacts with the <Constant name="dbt" /> APIs for metadata and processing <Constant name="semantic_layer" /> queries to power the Native App experiences. <br /> <br /> The <Constant name="dbt" /> account also calls the consumer Snowflake account to utilize the warehouse to execute dbt queries for orchestration and the Cortex LLM Arctic to power the **Copilot** chatbot. |

The following diagram provides an illustration of the architecture:

<Lightbox src="/img/docs/platform-integrations/architecture-dbt-snowflake-native-app.png" title="Architecture of dbt and Snowflake integration"/>


## Access

Log in to the dbt Snowflake Native App using your regular Snowflake login authentication method. The Snowflake user must have a corresponding <Constant name="dbt" /> user with a _[developer license](/docs/platform/manage-access/seats-and-users)_. Previously, this wasn't a requirement during the feature [Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). 

If your Snowflake Native App is already configured, you will be prompted to [link credentials](#link-credentials) the next time you access <Constant name="dbt" /> from the app. This is a one-time process.

## Procurement
The dbt Snowflake Native App is available on the [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2UA/dbt-labs-dbt). Purchasing it includes access to the Native App and a <Constant name="dbt" /> account that's on the Enterprise-tier plan. Existing <Constant name="dbt" /> Enterprise customers can also access it. If interested, contact your Enterprise account manager.

If you're interested, please [contact us](mailto:sales_snowflake_marketplace@dbtlabs.com) for more information.

## Support
If you have any questions about the dbt Snowflake Native App, you may [contact our Support team](mailto:dbt-snowflake-marketplace@dbtlabs.com) for help. Please provide information about your installation of the Native App, including your <Constant name="dbt" /> account ID and Snowflake account identifier. 

## Limitations
- The Native app does not support <Constant name="dbt" /> accounts with [IP Restrictions](/docs/platform/secure/ip-restrictions) enabled. 

## Link credentials

Every Snowflake user accessing the Native app must also have <Constant name="dbt" /> account access with a [developer or read-only license](/docs/platform/manage-access/seats-and-users). Feature access will be dependent on their <Constant name="dbt" /> license type.

For existing accounts with the Snowflake Native App configured, users will be prompted to authenticate with <Constant name="dbt" /> the next time they log in. This is a one-time process if they have a user in <Constant name="dbt" />. If they don’t have a <Constant name="dbt" /> user, they will be denied access, and an admin will need to [create one](/docs/platform/manage-access/invite-users). 

1. When you attempt to access the <Constant name="dbt" /> platform from the Snowflake Native App, you will be prompted to link your account.

2. Click **Link account** and you will be prompted for your <Constant name="dbt" /> credentials. 
