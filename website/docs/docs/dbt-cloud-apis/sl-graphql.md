---
title: "GraphQL"
id: sl-graphql
description: "Integrate and use the GraphQL API to query your metrics."
tags: [Semantic Layer, APIs]
---

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

</VersionBlock>


[GraphQL](https://graphql.org/) (GQL) is an open-source query language for APIs. It offers a more efficient and flexible approach compared to traditional RESTful APIs. 

With GraphQL, users can request specific data using a single query, reducing the need for many server round trips. This improves performance and minimizes network overhead.

GraphQL has several advantages, such as self-documenting, having a strong typing system, supporting versioning and evolution, enabling rapid development, and having a robust ecosystem. These features make GraphQL a powerful choice for APIs that prioritize flexibility, performance, and developer productivity.

## dbt Semantic Layer GraphQL API

The dbt Semantic Layer GraphQL API allows you to explore and query metrics and dimensions. Due to it's self-documenting nature, you can explore the calls conveniently through the [schema explorer](https://cloud.getdbt.com/semantic-layer/api/graphql). 

dbt Partners can use the Semantic Layer GraphQL API to build and integration with the dbt Semantic Layer.

## Requirements to use the GraphQL API
- A dbt cloud project on dbt v1.6 or higher
- Metrics are defined and configured
- A dbt Cloud [service token](/docs/dbt-cloud-apis/service-tokens) that has Semantic Layer access
- Your dbt project is configured and connected to a data platform


## Using the GraphQL API

If you're a dbt user or partner with access to dbt Cloud and the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), you can [setup](/docs/use-dbt-semantic-layer/setup-sl) and test this API with data from your own instance by configuring the Semantic Layer and obtaining the right GQL connection parameters described in this document. 

Refer to [Get started with the dbt Semantic Layer](docs/use-dbt-semantic-layer/quickstart-sl) for more info.


### Authentication 

Authentication uses a dbt Cloud [service account tokens](/docs/dbt-cloud-apis/service-tokens) passed through a header as follows. To explore the schema, you can enter this information in the "header" section.

```
{"Authorization": "Bearer <SERVICE TOKEN>"}
```

Each GQL request also requires a dbt Cloud `environmentId`. The API uses both the service token in the header and environmentId for authentication.

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

### Metric query

```graphql
query(
		environmentId: BigInt!
		queryId: String!
): QueryResult!
```


**Create query**

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

**Compile from Jinja**

```graphql
compileSqlFromJinja(
		environmentId: BigIn!
		query: String!
): CompileSqlFromJinjaResult!
```

**Metric Types**

```graphql
Metric {
		name: String!
		description: String
		type: MetricType!
		typeParams: MetricTypeParams!
		filter: WhereFilter
		dimensions: [Dimension!]!
}
```

```
MetricType = [SIMPLE, RATIO, CUMULATIVE, DERIVED]
```

**Metric Type Parameters**

```graphql
MetricTypeParams {
		measure: MetricInputMeasure
		inputMeasures: [MetricInputMeasure!]!
		numerator: MetricInput
		denominator: MetricInput
		expr: String
		window: MetricTimeWindow
		grainToDate: TimeGranularity
		metrics: [MetricInput!]
}
```

**Where filter**

```graphql
WhereFilter {
		whereSqlTemplate: String!
}
```

**Dimension Types**

```graphql
Dimension {
		name: String!
		qualifiedName: String!
		description: String
		type: DimensionType!
		typeParams: DimensionTypeParams
		isPartition: Boolean!
		expr: String
}
```
```
DimensionType = [CATEGORICAL, TIME]
```
