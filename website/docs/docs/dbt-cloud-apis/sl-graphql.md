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

### Metadata calls

**Fetch Data Platform Dialect** 

In some cases in your application, it may be useful to know the dialect/data platform that's being used under the hood for the dbt Semantic Layer connection (e.g., if you are building where filters from a GUI rather than user-inputted SQL) The GraphQL API has an easy way to fetch this via the following query: 

```graphql
{
    environmentInfo(environmentId: BigInt!) {
            dialect
    }
}
```

**Fetch available metrics**

```graphql
metrics(environmentId: BigInt!): [Metric!]!
```

**Fetch available dimensions for metrics**

```graphql
dimensions(
  environmentId: BigInt!
  metrics: [String!]!
): [Dimension!]!
```

**Fetch available granularities given metrics**

Note: This call for `queryableGranularities` returns only queryable granularities for metric time - the primary time dimension across all metrics selected.

```graphql
queryableGranularities(
  environmentId: BigInt!
  metrics: [String!]!
): [TimeGranularity!]!
```

You can also get queryable granularities for dimensions using the `dimensions` call:

```graphql
{
  dimensions(environmentId: BigInt!, metrics:["order_total"]) {
    name
    queryableGranularities # --> ["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"]
  }
}
```

You can also optionally access it from the metrics endpoint:

```graphql
{
  metrics(environmentId: BigInt!) {
    name
    dimensions {
      name
      queryableGranularities
    }
  }
```

**Fetch available metrics given a set of a dimensions**

```graphql
metricsForDimensions(
  environmentId: BigInt!
  dimensions: [String!]!
): [Metric!]!
```

**Create Dimension Values query**

```graphql

mutation createDimensionValuesQuery(
  environmentId: BigInt!
  metrics: [String!]
  groupBy: [String!]!
): CreateDimensionValuesQueryResult!

```

**Create Metric query**

```graphql
createQuery(
environmentId: BigInt!
metrics: [String!]!
group_by: [String!] = null
limit: Int = null
where: [String] = null
order: [String!] = null
): CreateQueryResult
```

**Fetch query result**
```graphql
query(
  environmentId: BigInt!
  queryId: String!
): QueryResult!
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
  queryableGranularities: [TimeGranularity!]!
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


**Dimension Types**
todo: add info on granularity when we expose it

```graphql
Dimension {
	name: String!
	description: String
	type: DimensionType!
	typeParams: DimensionTypeParams
	isPartition: Boolean!
	expr: String
  queryableGranularities: [TimeGranularity!]!
}
```

```
DimensionType = [CATEGORICAL, TIME]
```

### Creating Query Examples 

**Query two metrics grouped by time**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "food_order_amount"}]
    groupBy: [{name: "metric_time}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Query with a time grain** 

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: "month"}] 
  ) {
    queryId
  }
}
```

**Query two metrics with a categorical Dimension**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name: "metric_time, grain: "month"}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Query with a Where Filter** 

The where filter takes a list argument (or a string for a single input). Depending on the object you are filtering on, there are a couple of parameters:
 
 - `Dimension()` - This is used for any categorical or time dimensions. If used for a time dimension, granularity is required -  `Dimension('metric_time').grain('week')` or `Dimension('customer__country')`
- `Entity()` - used for entities like primary and foreign keys - `Entity('order_id')`

Note: If you prefer more strongly typed `where` clause, you can optionally use `TimeDimension()` to separate out categorical dimensions from time ones. The `TimeDimension` input takes the time dimension name and also requires granularity - an example is `TimeDimension('metric_time', 'MONTH')`.

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics:[{name: "order_total"}]
    groupBy:[{name: "customer__customer_type"}, {name: "metric_time", grain: "month"}]
    where:["{{ Dimension('customer__customer_type') }} = 'new'", "{{ Dimension('metric_time').grain('month') }} > '2022-10-01'"]
    ) {
     queryId
    }
}
```

**Query with Order**
```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: "month"}] 
    orderBy: [{metric: {name: "order_total"}}, {groupBy: {name: "metric_time", grain: "month"}, descending:true}]
  ) {
    queryId
  }
}
```


**Query with Limit**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name:"food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name:"metric_time, grain: "month"}, {name: "customer__customer_type"}]
    limit: 10	
  ) {
    queryId
  }
}
```

**Query with Explain** 

This takes the same inputs as the `createQuery` mutation.

```graphql
mutation {
  compileSql(
    environmentId: BigInt!
    metrics: [{name:"food_order_amount"} {name:"order_gross_profit"}]
    groupBy: [{name:"metric_time, grain:"month"}, {name:"customer__customer_type"}]
  ) {
    sql
  }
}
```

### Output Format & Pagination

**Output Format**

By default, output provided is in Arrow format. You can use the following parameter to convert to JSON. Due to performance limitations, we recommend the JSON parameter be only used for testing and validation. The JSON returned is a base64 encoded string. This means to access the JSON you must run it through a base64 decoder then you should receive the results in JSON. This is a JSON generated from pandas, this means you can either parse this back into a dataframe via pandas.read_json(json, orient="table") or just use the data directly with json["data"] and get the table schema with json["schema"]["fields"]


```graphql
{
  query(environmentId: BigInt!, queryId: Int!, pageNum: Int {
    sql
    status
    error
    totalPages
    arrowResult
    jsonResult (orient: table)
  }
}
```
The results default to table but you can change it to any [pandas](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html) supported value. 

**Pagination**

By default, we return 1024 rows per page. If your result set exceeds this, you will have to increment the page by using the pageNum argument 

