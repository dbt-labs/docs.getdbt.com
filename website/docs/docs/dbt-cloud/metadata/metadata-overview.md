---
title: "Metadata API Overview"
id: "metadata-overview"
---

Every time that dbt Cloud runs a dbt project, it generates metadata which pertains to the accuracy, recency, configuration, and structure of the views and tables in the warehouse. dbt Cloud serves a GraphQL API which supports arbitrary queries over this metadata; the endpoint for this API is `https://metadata.cloud.getdbt.com/graphql`. This API is an incredibly rich resource for evaluating data health longitudinally or at a point in time.

We also provide a [graphical explorer](https://metadata.cloud.getdbt.com/graphiql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is a 100% accurate representation of the graph and fields available to query on at any point in time.

#### Enabling the Metadata API

To enable the Metadata API, navigate to the Metadata page in Account Settings on dbt Cloud. From this page, you can enable the API. Note that you must have a service account token to access the Metadata API.
