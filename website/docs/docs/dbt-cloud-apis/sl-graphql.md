---
title: "GraphQL"
id: sl-graphql
description: "Integrate and use the GraphQL API to query your metrics."
tags: [Semantic Layer, APIs]
---

# GraphQL <Lifecycle status="self_service,managed,managed_plus" />

[GraphQL](https://graphql.org/) (GQL) is an open-source query language for APIs. It offers a more efficient and flexible approach compared to traditional RESTful APIs. 

With GraphQL, users can request specific data using a single query, reducing the need for many server round trips. This improves performance and minimizes network overhead.

GraphQL has several advantages, such as self-documenting, having a strong typing system, supporting versioning and evolution, enabling rapid development, and having a robust ecosystem. These features make GraphQL a powerful choice for APIs prioritizing flexibility, performance, and developer productivity.

## dbt Semantic Layer GraphQL API

The <Constant name="semantic_layer" /> GraphQL API allows you to explore and query metrics and dimensions. Due to its self-documenting nature, you can explore the calls conveniently through a schema explorer. 

The schema explorer URLs vary depending on your [deployment region](/docs/cloud/about-cloud/access-regions-ip-addresses). Use the following table to find the right link for your region:

| Deployment type |	Schema explorer URL |
| --------------- | ------------------- |
| North America multi-tenant	|	https://semantic-layer.cloud.getdbt.com/api/graphql |
| EMEA multi-tenant	|	https://semantic-layer.emea.dbt.com/api/graphql |
| APAC multi-tenant	|	https://semantic-layer.au.dbt.com/api/graphql |
| Single tenant | `https://semantic-layer.YOUR_ACCESS_URL/api/graphql`<br /><br />  Replace `YOUR_ACCESS_URL` with your specific account prefix followed by the appropriate Access URL for your region and plan.|
| Multi-cell	| `https://YOUR_ACCOUNT_PREFIX.semantic-layer.REGION.dbt.com/api/graphql`<br /><br />  Replace `YOUR_ACCOUNT_PREFIX` with your specific account identifier and `REGION` with your location, which could be `us1.dbt.com`. |<br />

**Example**
- If your Single tenant access URL is `ABC123.getdbt.com`, your schema explorer URL will be `https://semantic-layer.ABC123.getdbt.com/api/graphql`.

dbt Partners can use the <Constant name="semantic_layer" /> GraphQL API to build an integration with the <Constant name="semantic_layer" />.

Note that the <Constant name="semantic_layer" /> GraphQL API doesn't support `ref` to call dbt objects. Instead, use the complete qualified table name. If you're using dbt macros at query time to calculate your metrics, you should move those calculations into your <Constant name="semantic_layer" /> metric definitions as code.

## Requirements to use the GraphQL API

- A <Constant name="cloud" /> project on dbt v1.6 or higher
- Metrics are defined and configured
- A <Constant name="cloud" /> [service token](/docs/dbt-cloud-apis/service-tokens) with "<Constant name="semantic_layer" /> Only” and "Metadata Only" permissions or a [personal access token](/docs/dbt-cloud-apis/user-tokens)

## Using the GraphQL API

If you're a dbt user or partner with access to <Constant name="cloud" /> and the [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), you can [set up](/docs/use-dbt-semantic-layer/setup-sl) and test this API with data from your own instance by configuring the <Constant name="semantic_layer" /> and obtaining the right GQL connection parameters described in this document. 

Refer to [Get started with the <Constant name="semantic_layer" />](/guides/sl-snowflake-qs) for more info.


Authentication uses either a <Constant name="cloud" /> [service account token](/docs/dbt-cloud-apis/service-tokens) or a [personal access token](/docs/dbt-cloud-apis/user-tokens) passed through a header as follows. To explore the schema, you can enter this information in the "header" section.

```shell
{"Authorization": "Bearer <AUTHENTICATION TOKEN>"}
```

Each GQL request also requires a <Constant name="cloud" /> `environmentId`. The API uses both the service or personal token in the header and `environmentId` for authentication.

### Metadata calls

#### Fetch data platform dialect

In some cases in your application, it may be useful to know the dialect or data platform that's internally used for the <Constant name="semantic_layer" /> connection (such as if you are building `where` filters from a user interface rather than user-inputted SQL). 

The GraphQL API has an easy way to fetch this with the following query: 

```graphql
{
  environmentInfo(environmentId: BigInt!) {
    dialect
  }
}
```

#### Fetch available metrics

<!-- removing non-paginated sample
```graphql
metrics(environmentId: BigInt!): [Metric!]!
```-->

```graphql
metricsPaginated(
  environmentId: BigInt!
  search: String = null
  groupBy: [GroupByInput!] = null
  pageNum: Int! = 1
  pageSize: Int = null
): MetricResultPage! {
  items: [Metric!]!
  pageNum: Int!
  pageSize: Int
  totalItems: Int!
  totalPages: Int!
}
```

#### Fetch available dimensions for metrics

<!-- removing non-paginated sample
```graphql
dimensions(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [Dimension!]!
```-->

```graphql
dimensionsPaginated(
    environmentId: BigInt!
    metrics: [MetricInput!]!
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): DimensionResultPage! {
    items: [Dimension!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### Fetch available granularities given metrics

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
  dimensionsPaginated(environmentId: BigInt!, metrics:[{name:"order_total"}]) {
    items {
      name
      queryableGranularities # --> ["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"]
    }
  }
}
```

You can also optionally access it from the metrics endpoint:

```graphql
{
  metricsPaginated(environmentId: BigInt!) {
    items {
      name
      dimensions {
        name
        queryableGranularities
      }
    }
  }
}
```

<VersionBlock lastVersion="1.9">
#### Fetch measures

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
  metricsPaginated(environmentId: BigInt!) {
    items {
      measures {
        name
        aggTimeDimension
      }
    }
  }
}
```
</VersionBlock>

#### Fetch entities

```graphql
entitiesPaginated(
    environmentId: BigInt!
    metrics: [MetricInput!] = null
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): EntityResultPage! {
    items: [Entity!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### Fetch entities and dimensions to group metrics

```graphql
groupBysPaginated(
    environmentId: BigInt!
    metrics: [MetricInput!] = null
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): EntityDimensionResultPage! {
    items: [EntityDimension!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### Metric types

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

#### Metric type parameters
<VersionBlock firstVersion="2.0">
```graphql
MetricTypeParams {
  numerator: MetricInput
  denominator: MetricInput
  expr: String
  window: MetricTimeWindow
  grainToDate: TimeGranularity
  metrics: [MetricInput!]
}
```
</VersionBlock>
<VersionBlock lastVersion="1.9">

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

</VersionBlock>

#### Dimension types

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

#### List saved queries

List all saved queries for the specified environment:

<!-- removing non-paginated sample
```graphql
{
savedQueries(environmentId: "123") {
  name
  description
  label
  queryParams {
    metrics {
      name
    }
    groupBy {
      name
      grain
      datePart
    }
    where {
      whereSqlTemplate
    }
  }
}
}
```-->

```graphql
savedQueriesPaginated(
    environmentId: BigInt!
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): SavedQueryResultPage! {
    items: [SavedQuery!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### List a saved query

List a single saved query using environment ID and query name:

```graphql

{
savedQuery(environmentId: "123", savedQueryName: "query_name") {
  name
  description
  label
  queryParams {
    metrics {
      name
    }
    groupBy {
      name
      grain
      datePart
    }
    where {
      whereSqlTemplate
    }
  }
}
}
```

### Querying

When querying for data, _either_ a `groupBy` _or_ a `metrics` selection is required. The following section provides examples of how to query metrics:

- [Create query](#create-metric-query)
- [Fetch query result](#fetch-query-result)

#### Create query

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
  alias: String!
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

#### Fetch query result

```graphql
query(
  environmentId: BigInt!
  queryId: String!
): QueryResult!
```

The GraphQL API uses a polling process for querying since queries can be long-running in some cases. It works by first creating a query with a mutation, `createQuery, which returns a query ID. This ID is then used to continuously check (poll) for the results and status of your query. The typical flow would look as follows:

1. Kick off a query
```graphql
mutation {
  createQuery(
    environmentId: 123456
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time"}]
  ) {
    queryId  # => Returns 'QueryID_12345678'
  }
}
```
2. Poll for results
```graphql
{
  query(environmentId: 123456, queryId: "QueryID_12345678") {
    sql
    status
    error
    totalPages
    jsonResult
    arrowResult
  }
}
```
3. Keep querying 2. at an appropriate interval until status is `FAILED` or `SUCCESSFUL`

### Output format and pagination

#### Output format

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

#### Pagination

By default, we return 1024 rows per page. If your result set exceeds this, you need to increase the page number using the `pageNum` option.

### Run a Python query

The `arrowResult` in the GraphQL query response is a byte dump, which isn't visually useful. You can convert this byte data into an Arrow table using any Arrow-supported language. Refer to the following Python example explaining how to query and decode the arrow result:


```python
import base64
import pyarrow as pa
import time

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

while True:
  gql_response = requests.post(
    "https://semantic-layer.cloud.getdbt.com/api/graphql",
    json={"query": query_result_request},
    headers=headers,
  )
  if gql_response.json()["data"]["status"] in ["FAILED", "SUCCESSFUL"]:
    break
  # Set an appropriate interval between polling requests
  time.sleep(1)

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
  with pa.ipc.open_stream(base64.b64decode(byte_string)) as reader:
    return pa.Table.from_batches(reader, reader.schema)


arrow_table = to_arrow_table(gql_response.json()["data"]["query"]["arrowResult"])

# Perform whatever functionality is available, like convert to a pandas table.
print(arrow_table.to_pandas())
"""
order_total  ordered_at
          3  2023-08-07
        112  2023-08-08
         12  2023-08-09
       5123  2023-08-10
"""
```

### Additional create query examples 

The following section provides query examples for the GraphQL API, such as how to query metrics, dimensions, where filters, and more:

<!-- no toc -->
- [Query metric alias](#query-metric-alias) &mdash; Query with metric alias, which allows you to use simpler or more intuitive names for metrics instead of their full definitions.
- [Query with a time grain](#query-with-a-time-grain)  &mdash; Fetch multiple metrics with a change in time dimension granularities.
- [Query multiple metrics and multiple dimensions](#query-multiple-metrics-and-multiple-dimensions) &mdash; Select common dimensions for multiple metrics.
- [Query a categorical dimension on its own](#query-a-categorical-dimension-on-its-own) &mdash; Group by a categorical dimension.
- [Query with a where filter](#query-with-a-where-filter)  &mdash; Use the `where` parameter to filter on dimensions and entities using parameters.
- [Query with order](#query-with-order) &mdash; Query with `orderBy`, accepts basic string that's a Dimension, Metric, or Entity. Defaults to ascending order.
- [Query with limit](#query-with-limit) &mdash; Query using a `limit` clause.
- [Query saved queries](#query-saved-queries) &mdash; Query using a saved query using the `savedQuery` parameter for frequently used queries.
- [Query with just compiling SQL](#query-with-just-compiling-sql) &mdash; Query using a compile keyword using the `compileSql` mutation.
- [Query records](#query-records) &mdash; View all the queries made in your project.


#### Query metric alias

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "metric_name", alias: "metric_alias"}]
  ) {
    ...
  }
}
```

#### Query with a time grain

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
  ) {
    queryId
  }
}
```

Note that when using granularity in the query, the output of a time dimension with a time grain applied to it always takes the form of a dimension name appended with a double underscore and the granularity level - `{time_dimension_name}__{DAY|WEEK|MONTH|QUARTER|YEAR}`. Even if no granularity is specified, it will also always have a granularity appended to it and will default to the lowest available (usually daily for most data sources). It is encouraged to specify a granularity when using time dimensions so that there won't be any unexpected results with the output data.

#### Query multiple metrics and multiple dimensions

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name: "metric_time", grain: MONTH}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

#### Query a categorical dimension on its own

```graphql
mutation {
  createQuery(
    environmentId: "123"
    groupBy: [{name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

#### Query with a where filter

The `where` filter takes a list argument (or a string for a single input). Depending on the object you are filtering, there are a couple of parameters:
 
 - `Dimension()` &mdash; Used for any categorical or time dimensions. For example, `Dimension('metric_time').grain('week')` or `Dimension('customer__country')`.
  
- `Entity()` &mdash; Used for entities like primary and foreign keys, such as `Entity('order_id')`.

Note: If you prefer a `where` clause with a more explicit path, you can optionally use `TimeDimension()` to separate categorical dimensions from time ones. The `TimeDimension` input takes the time dimension and optionally the granularity level. `TimeDimension('metric_time', 'month')`.

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics:[{name: "order_total"}]
    groupBy:[{name: "customer__customer_type"}, {name: "metric_time", grain: month}]
    where:[{sql: "{{ Dimension('customer__customer_type') }} = 'new'"}, {sql:"{{ Dimension('metric_time').grain('month') }} > '2022-10-01'"}]
    ) {
     queryId
    }
}
```

#### Multi-hop joins

In cases where you need to query across multiple related tables (multi-hop joins), use the `entity_path` argument to specify the path between related entities. The following are examples of how you can define these joins:

- In this example, you're querying the `location_name` dimension but specifying that it should be joined using the `order_id` field.
	```sql
	{{Dimension('location__location_name', entity_path=['order_id'])}}
	```
- In this example, the `salesforce_account_owner` dimension is joined to the `region` field, with the path going through `salesforce_account`.
	```sql
	{{ Dimension('salesforce_account_owner__region',['salesforce_account']) }}
	```


#### Query with order

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
    orderBy: [{metric: {name: "order_total"}}, {groupBy: {name: "metric_time", grain: MONTH}, descending:true}]
  ) {
    queryId
  }
}
```

#### Query with limit

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name:"food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name: "customer__customer_type"}]
    limit: 10 
  ) {
    queryId
  }
}
```

#### Query saved queries

This takes the same inputs as the `createQuery` mutation, but includes the field `savedQuery`. You can use this for frequently used queries.

```graphql
mutation {
  createQuery(
    environmentId: "123"
    savedQuery: "new_customer_orders"
  ) {
    queryId
  }
}
```

:::info A note on querying saved queries
When querying [saved queries](/docs/build/saved-queries),you can use parameters such as `where`, `limit`, `order`, `compile`, and so on. However, keep in mind that you can't access `metric` or `group_by` parameters in this context. This is because they are predetermined and fixed parameters for saved queries, and you can't change them at query time. If you would like to query more metrics or dimensions, you can build the query using the standard format.
:::

#### Query with just compiling SQL

This takes the same inputs as the `createQuery` mutation.

```graphql
mutation {
  compileSql(
    environmentId: "123"
    metrics: [{name:"food_order_amount"} {name:"order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name:"customer__customer_type"}]
  ) {
    sql
  }
}
```

#### Query records

Use this endpoint to view all the queries made in your project. This covers both Insights and <Constant name="semantic_layer" /> queries.

```graphql
{
  queryRecords(
    environmentId:123
  ) {
    items {
      queryId
      status
      startTime
      endTime
      connectionDetails
      sqlDialect
      connectionSchema
      error
      queryDetails {
        ... on SemanticLayerQueryDetails {
          params {
            type
            metrics {
              name
            }
            groupBy {
              name
              grain
            }
            limit
            where {
              sql
            }
            orderBy {
              groupBy {
                name
                grain
              }
              metric {
                name
              }
              descending
            }
            savedQuery
          }
        }
        ... on RawSqlQueryDetails {
          queryStr
          compiledSql
          numCols
          queryDescription
          queryTitle
        }
      }
    }
    totalItems
    pageNum
    pageSize
  }
}
```
