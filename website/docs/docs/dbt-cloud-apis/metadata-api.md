---
title: "Metadata API"
id: "metadata-api"
---

The dbt Cloud Metadata API helps organizations analyze and improve their data. You can use the API to:
 - Power downstream integrations so users discover and understand data for analysis
 - Ensure data quality 
 - Increase the efficiency of dbt operations

Metadata is data that provides information about other data and it's generated every time dbt Cloud runs a project. The metadata contains information on the accuracy, recency, configuration, and structure of the <Term id="view">views</Term> and tables in the warehouse.

<!-- reworded original: Every time that dbt Cloud runs a dbt project, it generates metadata which pertains to the accuracy, recency, configuration, and structure of the views and tables in the warehouse. -->

 dbt Cloud serves a [GraphQL API](https://metadata.cloud.getdbt.com/graphql) which supports arbitrary queries over this metadata. This API is an incredibly rich resource for evaluating data health long-term or at a moment-in-time. 
 
 The endpoint for this API is `https://metadata.YOUR_ACCESS_URL/graphql`. Replace `YOUR_ACCESS_URL` with the appropriate [Access URL](/docs/deploy/regions-ip-addresses) for your region and plan. For example, if your region is North America multi tenant, your endpoint is `https://metadata.cloud.getdbt.com/graphql`. 

## Prerequisites

The Metadata API is available to:
- [Multi tenant](/docs/deploy/regions-ip-addresses) accounts on the [Team or Enterprise plans](https://www.getdbt.com/pricing/), 
- Projects on dbt version v0.19.0 or higher. 
    * Artifacts generated on dbt version lower tha v0.19.0 will not be accessible via the Metadata API. Refer to [Version migration guides](https://docs.getdbt.com/guides/migration/versions) to upgrade. 
    
## Use cases

Use the Metadata API to solve the following use cases:

- **Discovery*** &mdash; Find and understand dbt assets to analyze in integrated tools using information like model and metric definitions, column info, and lineage. Refer to [dbt Semantic Layer integration](/guides/dbt-ecosystem/sl-partner-integration-guide) for more info. 
- **Quality*** &mdash; Make sure users have correct and up-to-date data for their analyses by monitoring tests, source freshness, run status, exposures, and dependencies.
- **Operations*** &mdash;  Help data teams run dbt efficiently and effectively to reduce costs by using historical run data.

*_Integration guides coming soon_

## How to browse the API

We also provide a [graphical explorer](https://metadata.cloud.getdbt.com/graphiql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is an accurate representation of the graph and fields available to query on at any point in time.

## Retention limits for data

You can use the metadata API to query data from the previous 3 months. For example, if today was April 1, you could query data back to January 1st.

*We are continuously expanding the capabilities of the metadata API and we welcome your feedback and suggestions at metadata@dbtlabs.com.*
