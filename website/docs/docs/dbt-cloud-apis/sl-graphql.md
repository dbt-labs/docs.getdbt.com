---
title: "GraphQL"
id: sl-graphql
description: "Integrate and use the GraphQL API to query your metrics."
tags: ["semantic-layer, apis"]
---

<VersionBlock lastVersion="1.5">

import UpgradeSL from '/snippets/_upgrade-new-sl.md';

<UpgradeSL />

</VersionBlock>




GraphQL is an open-source query language for APIs (Application Programming Interfaces). It provides a more efficient and flexible alternative to traditional RESTful APIs. 

With GraphQL, clients can request specific data requirements using a single query. GraphQL allows clients to retrieve all the needed data in a single request. This reduces the number of round trips to the server, minimizing network overhead and improving performance.

Overall, GraphQL offers benefits such as being self-documenting, a strong typing system, versioning and evolution support, enabling rapid development, and a robust ecosystem. These advantages make GraphQL a powerful choice for building APIs that prioritize flexibility, performance, and developer productivity.


### dbt Semantic Layer GraphQL API

The dbt Semantic Layer GraphQL API has the following capabilities and has similarities to the calls available in our JDBC API.

One benefit of GraphQL is its self documenting nature, so you can explore using our schema explorer(todolink). To give you an idea of the types of commands you can execute, we provide some available calls below.


**Metric Metadata Calls**

Fetch available metrics
```graphql
metrics(environmentId: Int!): [Metric!]!
```

Fetch available dimensions for metrics

```graphql
dimensions(
environmentId: Int!
metrics: [String!]!
): [Dimension!]!
```

Fetch available time granularities given metrics

```graphql
queryableGranularities(
environmentId: Int!
metrics: [String!]!
): [TimeGranularity!]!
```

Fetch available metrics given a set of a dimensions

```graphql
metricsForDimensions(
environmentId: Int!
dimensions: [String!]!
): [Metric!]!
```

Fetch dimension values for metrics and a given dimension

```graphql
dimensionValues(
environmentId: Int!
metrics: [String!]!
dimension: String!
```

**Metric Value Query Parameters**

The mutation is `createQuery`. The parameters are as follows:

```graphql
createQuery(
environmentId: Int!
metrics: [String!]!
dimensions: [String!] = null
limit: Int = null
startTime: String = null
endTime: String = null
where: String = null
order: [String!] = null
): String
```

