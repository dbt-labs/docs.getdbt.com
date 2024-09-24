---
title: "GraphQL"
id: sl-graphql
description: "Integrate and use the GraphQL API to query your metrics."
tags: [Semantic Layer, APIs]
---

[GraphQL](https://graphql.org/) (GQL) is an open-source query language for APIs. It offers a more efficient and flexible approach compared to traditional RESTful APIs. 

With GraphQL, users can request specific data using a single query, reducing the need for many server round trips. This improves performance and minimizes network overhead.

GraphQL has several advantages, such as self-documenting, having a strong typing system, supporting versioning and evolution, enabling rapid development, and having a robust ecosystem. These features make GraphQL a powerful choice for APIs prioritizing flexibility, performance, and developer productivity.

## dbt Semantic Layer GraphQL API

The dbt Semantic Layer GraphQL API allows you to explore and query metrics and dimensions. Due to its self-documenting nature, you can explore the calls conveniently through a schema explorer. 

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

dbt Partners can use the Semantic Layer GraphQL API to build an integration with the dbt Semantic Layer.

Note that the dbt Semantic Layer API doesn't support `ref` to call dbt objects. Instead, use the complete qualified table name. If you're using dbt macros at query time to calculate your metrics, you should move those calculations into your Semantic Layer metric definitions as code.

## Requirements to use the GraphQL API
- A dbt Cloud project on dbt v1.6 or higher
- Metrics are defined and configured
- A dbt Cloud [service token](/docs/dbt-cloud-apis/service-tokens) with "Semantic Layer Only” and "Metadata Only" permissions
- Your dbt project is configured and connected to a data platform


## Using the GraphQL API

If you're a dbt user or partner with access to dbt Cloud and the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), you can [setup](/docs/use-dbt-semantic-layer/setup-sl) and test this API with data from your own instance by configuring the Semantic Layer and obtaining the right GQL connection parameters described in this document. 

Refer to [Get started with the dbt Semantic Layer](/guides/sl-snowflake-qs) for more info.


### Authentication 

Authentication uses a dbt Cloud [service account tokens](/docs/dbt-cloud-apis/service-tokens) passed through a header as follows. To explore the schema, you can enter this information in the "header" section.

```
{"Authorization": "Bearer <SERVICE TOKEN>"}
```

Each GQL request also requires a dbt Cloud `environmentId`. The API uses both the service token in the header and `environmentId` for authentication.

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

**List saved queries**
  
  ```graphql
  {
  savedQueries(environmentId: 200532) {
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

When querying for data, _either_ a `groupBy` _or_ a `metrics` selection is required. 

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

### Additional Create Query examples 

The following section provides query examples for the GraphQL API, such as how to query metrics, dimensions, where filters, and more.

**Query two metrics grouped by time**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "food_order_amount"}]
    groupBy: [{name: "metric_time"}, {name: "customer__customer_type"}]
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
    groupBy: [{name: "metric_time", grain: MONTH}] 
  ) {
    queryId
  }
}
```

Note that when using granularity in the query, the output of a time dimension with a time grain applied to it always takes the form of a dimension name appended with a double underscore and the granularity level - `{time_dimension_name}__{DAY|WEEK|MONTH|QUARTER|YEAR}`. Even if no granularity is specified, it will also always have a granularity appended to it and will default to the lowest available (usually daily for most data sources). It is encouraged to specify a granularity when using time dimensions so that there won't be any unexpected results with the output data.

**Query two metrics with a categorical dimension**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name: "metric_time", grain: MONTH}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Query a categorical dimension on its own**

```graphql
mutation {
  createQuery(
    environmentId: 123456
    groupBy: [{name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Query with a where filter** 

The `where` filter takes a list argument (or a string for a single input). Depending on the object you are filtering, there are a couple of parameters:
 
 - `Dimension()` &mdash; Used for any categorical or time dimensions. For example, `Dimension('metric_time').grain('week')` or `Dimension('customer__country')`.
  
- `Entity()` &mdash; Used for entities like primary and foreign keys, such as `Entity('order_id')`.

Note: If you prefer a `where` clause with a more explicit path, you can optionally use `TimeDimension()` to separate categorical dimensions from time ones. The `TimeDimension` input takes the time dimension and optionally the granularity level. `TimeDimension('metric_time', 'month')`.

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics:[{name: "order_total"}]
    groupBy:[{name: "customer__customer_type"}, {name: "metric_time", grain: month}]
    where:[{sql: "{{ Dimension('customer__customer_type') }} = 'new'"}, {sql:"{{ Dimension('metric_time').grain('month') }} > '2022-10-01'"}]
    ) {
     queryId
    }
}
```

For both `TimeDimension()`, the grain is only required in the WHERE filter if the aggregation time dimensions for the measures and metrics associated with the where filter have different grains. 

For example, consider this Semantic model and Metric configuration, which contains two metrics that are aggregated across different time grains. This example shows a single semantic model, but the same goes for metrics across more than one semantic model.

```yaml
semantic_model:
  name: my_model_source

defaults:
  agg_time_dimension: created_month
  measures:
    - name: measure_0
      agg: sum
    - name: measure_1
      agg: sum
      agg_time_dimension: order_year
  dimensions:
    - name: created_month
      type: time
      type_params:
        time_granularity: month
    - name: order_year
      type: time
      type_params:
        time_granularity: year

metrics:
  - name: metric_0
    description: A metric with a month grain.
    type: simple
    type_params:
      measure: measure_0
  - name: metric_1
    description: A metric with a year grain.
    type: simple
    type_params:
      measure: measure_1
```

Assuming the user is querying `metric_0` and `metric_1` together, a valid filter would be:

  * `"{{ TimeDimension('metric_time', 'year') }} > '2020-01-01'"`

Invalid filters would be:
 
  * ` "{{ TimeDimension('metric_time') }} > '2020-01-01'"` &mdash; metrics in the query are defined based on measures with different grains.

  * `"{{ TimeDimension('metric_time', 'month') }} > '2020-01-01'"` &mdash; `metric_1` is not available at a month grain.

**Query with Order**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
    orderBy: [{metric: {name: "order_total"}}, {groupBy: {name: "metric_time", grain: MONTH}, descending:true}]
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
    groupBy: [{name:"metric_time", grain: MONTH}, {name: "customer__customer_type"}]
    limit: 10 
  ) {
    queryId
  }
}
```

**Query with just compiling SQL** 

This takes the same inputs as the `createQuery` mutation.

```graphql
mutation {
  compileSql(
    environmentId: BigInt!
    metrics: [{name:"food_order_amount"} {name:"order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name:"customer__customer_type"}]
  ) {
    sql
  }
}
```

**Querying compile SQL with saved queries** 

This query includes the field `savedQuery` and generates the SQL based on a predefined [saved query](/docs/build/saved-queries),rather than dynamically building it from a list of metrics and groupings. You can use this for frequently used queries.

```graphql
mutation {
  compileSql(
    environmentId: 200532
    savedQuery: "new_customer_orders" # new field
  ) {
    queryId
    sql
  }
}
```

:::info A note on querying saved queries
When querying [saved queries](/docs/build/saved-queries),you can use parameters such as `where`, `limit`, `order`, `compile`, and so on. However, keep in mind that you can't access `metric` or `group_by` parameters in this context. This is because they are predetermined and fixed parameters for saved queries, and you can't change them at query time. If you would like to query more metrics or dimensions, you can build the query using the standard format.
:::

**Create query with saved queries** 

This takes the same inputs as the `createQuery` mutation, but includes the field `savedQuery`. You can use this for frequently used queries.

```graphql
mutation {
  createQuery(
    environmentId: 200532
    savedQuery: "new_customer_orders"  # new field
  ) {
    queryId
  }
}
```

### Multi-hop joins

In cases where you need to query across multiple related tables (multi-hop joins), use the `entity_path` argument to specify the path between related entities. The following are examples of how you can define these joins:

- In this example, you're querying the `location_name` dimension but specifying that it should be joined using the `order_id` field.
	```sql
	{{Dimension('location__location_name', entity_path=['order_id'])}}
	```
- In this example, the `salesforce_account_owner` dimension is joined to the `region` field, with the path going through `salesforce_account`.
	```sql
	{{ Dimension('salesforce_account_owner__region',['salesforce_account']) }}
	```
