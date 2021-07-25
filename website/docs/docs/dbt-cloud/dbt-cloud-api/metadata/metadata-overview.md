---
title: "Metadata API Overview"
id: "metadata-overview"
---

Every time that dbt Cloud runs a dbt project, it generates metadata which pertains to the accuracy, recency, configuration, and structure of the views and tables in the warehouse. dbt Cloud serves a GraphQL API which supports arbitrary queries over this metadata; the endpoint for this API is `https://metadata.cloud.getdbt.com/graphql`. This API is an incredibly rich resource for evaluating data health longitudinally or at a point in time.

We also provide a [graphical explorer](https://metadata.cloud.getdbt.com/graphiql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is an accurate representation of the graph and fields available to query on at any point in time.

The metadata API is available to accounts on the _Team_ and _Enterprise_ plans, for any version >= dbt v0.19.0. Please note that artifacts generated with a version of dbt _less than_ v0.19.0 will not be accessible via the dbt Cloud Metadata API.

*Please note that at present, queries to the Metadata API exclusively return metadata about the most recent Run for a given dbt Cloud Job. We are continuously expanding the capabilities of the metadata API and we welcome your feedback and suggestions at metadata@dbtlabs.com.*
