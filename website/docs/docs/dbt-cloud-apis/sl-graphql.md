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


[GraphQL](https://graphql.org/) is an open-source query language for APIs. It offers a more efficient and flexible approach compared to traditional RESTful APIs. 

With GraphQL, users can request specific data using a single query, reducing the need for many server round trips. This improves performance and minimizes network overhead.

GraphQL has several advantages, such as self-documenting, having a strong typing system, supporting versioning and evolution, enabling rapid development, and having a robust ecosystem. These features make GraphQL a powerful choice for APIs that prioritize flexibility, performance, and developer productivity.

## dbt Semantic Layer GraphQL API

The dbt Semantic Layer GraphQL API offers capabilities like the JDBC API. It allows you to explore and execute commands conveniently through its self-documenting nature using the schema explorer (need link from roxi). 

### Metric metadata calls

Use the following example calls to provide you with an idea of the types of commands you can use:

**Fetch available metrics**

```graphql
metrics(environmentId: Int!): [Metric!]!
```

**Fetch available dimensions for metrics**

```graphql
dimensions(
environmentId: Int!
metrics: [String!]!
): [Dimension!]!
```

**Fetch available time granularities given metrics**

```graphql
queryableGranularities(
environmentId: Int!
metrics: [String!]!
): [TimeGranularity!]!
```

**Fetch available metrics given a set of a dimensions**

```graphql
metricsForDimensions(
environmentId: Int!
dimensions: [String!]!
): [Metric!]!
```

**Fetch dimension values for metrics and a given dimension**

```graphql
dimensionValues(
environmentId: Int!
metrics: [String!]!
dimension: String!
```

### Metric value query parameters

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

