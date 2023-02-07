---
title: "Metadata API"
id: "metadata-api"
---

The dbt Cloud Metadata API helps organizations analyze and improve their data. You can use the API to:
 - power downstream integrations so users discover and understand data for analysis, 
 - ensure data quality, and 
 - increase the efficiency of dbt operations.

dbt Cloud generates metadata every time it runs a dbt project. The metadata pertains to the accuracy, recency, configuration, and structure of the <Term id="view">views</Term> and tables in the warehouse. dbt Cloud serves a GraphQL API which supports arbitrary queries over this metadata; the endpoint for this API is `https://metadata.cloud.getdbt.com/graphql`. This API is an incredibly rich resource for evaluating data health long-term or at a moment-in-time.

## Prerequisites

The metadata API is available to accounts on the _Team_ and _Enterprise_ plans, for any version >= dbt v0.19.0. Please note that artifacts generated with a version of dbt _less than_ v0.19.0 will not be accessible via the dbt Cloud metadata API. For information on upgrading, see "[Version migration guides](https://docs.getdbt.com/guides/migration/versions)."

## How to browse the API

We also provide a [graphical explorer](https://metadata.cloud.getdbt.com/graphiql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is an accurate representation of the graph and fields available to query on at any point in time.

## Retention limits for data

You can use the metadata API to query data from the previous 3 months. For example, if today was April 1, you could query data back to January 1st.

*We are continuously expanding the capabilities of the metadata API and we welcome your feedback and suggestions at metadata@dbtlabs.com.*
