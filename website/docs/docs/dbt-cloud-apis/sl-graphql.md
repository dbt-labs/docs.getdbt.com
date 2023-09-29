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

The dbt Semantic Layer GraphQL API allows you to explore and query metrics and dimensions. Due to it's self-documenting nature, you can explore the calls conveniently through the [schema explorer](https://semantic-layer.cloud.getdbt.com/api/graphql).

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

**Fetch data platform dialect** 

In some cases in your application, it may be useful to know the dialect or data platform that's internally used for the dbt Semantic Layer connection (such as if you are building `where` filters from a user interface rather than user-inputted SQL). 

The GraphQL API has an easy way to fetch this with the following query: 

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
  metrics: [MetricInput!]!
): [Dimension!]!
```

**Fetch available granularities given metrics**

Note: This call for `queryableGranularities` returns only queryable granularities for metric time - the primary time dimension across all metrics selected.

```graphql
queryableGranularities(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [TimeGranularity!]!
```

You can also get queryable granularities for all other dimensions using the `dimensions` call:

```graphql
{
  dimensions(environmentId: BigInt!, metrics:[{name:"order_total"}]) {
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
}
```

**Fetch measures**

```graphql
{
  measures(environmentId: BigInt!, metrics: [{name:"order_total"}]) {
    name
    aggTimeDimension
  }
}
```

`aggTimeDimension` tells you the name of the dimension that maps to `metric_time` for a given measure. You can also query `measures` from the `metrics` endpoint, which allows you to see what dimensions map to `metric_time` for a given metric:

```graphql
{
  metrics(environmentId: BigInt!) {
    measures {
      name
      aggTimeDimension
    }
  }
}
```

**Fetch available metrics given a set of dimensions**

```graphql
metricsForDimensions(
  environmentId: BigInt!
  dimensions: [GroupByInput!]!
): [Metric!]!
```

**Create Dimension Values query**

```graphql

mutation createDimensionValuesQuery(
  environmentId: BigInt!
  metrics: [MetricInput!]
  groupBy: [GroupByInput!]!
): CreateDimensionValuesQueryResult!

```

**Create Metric query**

```graphql
createQuery(
  environmentId: BigInt!
  metrics: [MetricInput!]!
  groupBy: [GroupByInput!] = null
  limit: Int = null
  where: [WhereInput!] = null
  order: [OrderByInput!] = null
): CreateQueryResult
```

```graphql
MetricInput {
  name: String!
}

GroupByInput {
  name: String!
  grain: TimeGranularity = null
}

WhereInput {
  sql: String!
}

OrderByinput { # -- pass one and only one of metric or groupBy
  metric: MetricInput = null
  groupBy: GroupByInput = null
  descending: Boolean! = false
}
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

**Metric Type parameters**

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

### Create Query examples 

The following section provides query examples for the GraphQL API, such as how to query metrics, dimensions, where filters, and more.

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

Note that when using granularity in the query, the output of a time dimension with a time grain applied to it always takes form of dimension name appended with a double underscore and the granularity level - `{time_dimension_name}__{DAY|WEEK|MONTH|QUARTER|YEAR}`. Even if no granularity is specified, it will also always have a granularity appended to it and will default to the lowest available (usually daily for most data sources). It is encouraged to specify a granularity when using time dimensions so that there won't be any unexpected results with the output data.

**Query two metrics with a categorical dimension**

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

**Query with a where filter** 

The `where` filter takes a list argument (or a string for a single input). Depending on the object you are filtering on, there are a couple of parameters:
 
 - `Dimension()` &mdash; Used for any categorical or time dimensions. If used for a time dimension, granularity is required. For example, `Dimension('metric_time').grain('week')` or `Dimension('customer__country')`.
  
- `Entity()` &mdash; Used for entities like primary and foreign keys, such as `Entity('order_id')`.

Note: If you prefer a more strongly typed `where` clause, you can optionally use `TimeDimension()` to separate out categorical dimensions from time ones. The `TimeDimension` input takes the time dimension name and also requires granularity. For example, `TimeDimension('metric_time', 'MONTH')`.

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics:[{name: "order_total"}]
    groupBy:[{name: "customer__customer_type"}, {name: "metric_time", grain: "month"}]
    where:[{sql: "{{ Dimension('customer__customer_type') }} = 'new'"}, {sql:"{{ Dimension('metric_time').grain('month') }} > '2022-10-01'"}]
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

### Output format and pagination

**Output format**

By default, the output is in Arrow format. You can switch to JSON format using the following parameter. However, due to performance limitations, we recommend using the JSON parameter for testing and validation. The JSON received is a base64 encoded string. To access it, you can decode it using a base64 decoder. The JSON is created from pandas, which means you can change it back to a dataframe using `pandas.read_json(json, orient="table")`. Or you can work with the data directly using `json["data"]`, and find the table schema using `json["schema"]["fields"]`. Alternatively, you can pass `encoded:false` to the jsonResult field to get a raw JSON string directly.


```graphql
{
  query(environmentId: BigInt!, queryId: Int!, pageNum: Int! = 1) {
    sql
    status
    error
    totalPages
    arrowResult
    jsonResult(orient: PandasJsonOrient! = TABLE, encoded: Boolean! = true)
  }
}
```

The results default to the table but you can change it to any [pandas](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html) supported value. 

**Pagination**

By default, we return 1024 rows per page. If your result set exceeds this, you need to increase the page number using the `pageNum` option.

### Execute a Query through Python

The `arrowResult` from the GraphQL query response isn't all that useful visually as it's a byte dump. You can utilize any language that supports Arrow to convert that byte into a Arrow table. Here is an example of querying and decoding the arrow result in Python.

```python
import base64
import pyarrow as pa

headers = {"Authorization":"Bearer <token>"}
query_result_request = """
{
  query(environmentId: 70, queryId: "12345678") {
    sql
    status
    error
    arrowResult
  }
}
"""

gql_response = requests.post(
  "http://localhost:8000/graphql",
  json={"query": query_result_request},
  headers=headers,
)

"""
gql_response.json() => 
{
  "data": {
    "query": {
      "sql": "SELECT\n  ordered_at AS metric_time__day\n  , SUM(order_total) AS order_total\nFROM semantic_layer.orders orders_src_1\nGROUP BY\n  ordered_at",
      "status": "SUCCESSFUL",
      "error": null,
      "arrowResult": "arrow-byte-data"
    }
  }
}
"""

def to_arrow_table(byte_string: str) -> pa.Table:
  """Get a raw base64 string and convert to an Arrow Table."""
  with pa.ipc.open_stream(base64.b64decode(res)) as reader:
    return pa.Table.from_batches(reader, reader.schema)


arrow_table = to_arrow_table(gql_response.json()["data"]["query"]["arrowResult"])

# Perform whatever functionality is available e.g.,
print(arrow_table.to_pandas())
"""
order_total  ordered_at
          3  2023-08-07
        112  2023-08-08
         12  2023-08-09
       5123  2023-08-10
"""
```