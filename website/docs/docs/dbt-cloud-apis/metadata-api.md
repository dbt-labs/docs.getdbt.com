---
title: "Metadata API"
id: "metadata-api"
---


The dbt Cloud Metadata API helps organizations analyze and improve their data using the outputs of dbt execution. You can use the API and power downstream integrations so users:
 - Discover and understand data for analysis
 - Ensure data quality based on models, tests, and sources
 - Increase the efficiency of dbt operations

Every time dbt Cloud runs a project, it generates and stores information about the dbt project, how it's executed, and the accuracy, recency, configuration, and structure of the <Term id="view">views</Term> and tables in the warehouse. 

dbt Cloud serves a GraphQL API which supports arbitrary queries over this metadata. You can use this API to evaluate data health in the long-term or at a moment-in-time. 

The endpoint to access this API is `https://metadata.YOUR_ACCESS_URL/graphql`. Replace `YOUR_ACCESS_URL` with the appropriate [Access URL](/docs/deploy/regions-ip-addresses) for your region and plan. For example, if your region is North America using multi tenant, your endpoint is `https://metadata.cloud.getdbt.com/graphql`.

## Prerequisites

The Metadata API is available to:
- [Multi-tenant](/docs/deploy/regions-ip-addresses) accounts on the [Team or Enterprise plans](https://www.getdbt.com/pricing/). 
- Projects on dbt version v0.19.0 or higher. Refer to [Version migration guides](https://docs.getdbt.com/guides/migration/versions) to upgrade.
    
## Use cases

Use the Metadata API to solve the following use cases:

- **Discovery*** &mdash; Find and understand dbt assets to analyze in integrated tools using information like model and metric definitions, column info, and lineage. One example of this is the [dbt Semantic Layer integration](/guides/dbt-ecosystem/sl-partner-integration-guide). 
- **Quality*** &mdash; Make sure users have correct and up-to-date data for their analyses by monitoring test failures, source freshness, run status, exposures, and dependencies.
- **Operations*** &mdash;  Help data teams run dbt efficiently and effectively to reduce costs by using historical run data including information like model build time and run counts.

Customers may use the API directly or within an integrated tool. It also powers some experiences in dbt Cloud itself. Many Metadata API use cases also benefit from [webhooks](/docs/deploy/webhooks) to access the most up-to-date project and run information. 

*_More detailed use case and integration guides coming soon_

## Browse the API

We provide [a graphical explorer](https://metadata.cloud.getdbt.com/graphql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is an accurate representation of the graph and fields available to query. To learn how to use GraphiQL, refer to [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying.md).

## Retention limits

You can use the metadata API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.

*We are continuously expanding the capabilities of the metadata API and we welcome your feedback and suggestions at cloudAPIs@dbtlabs.com.*
