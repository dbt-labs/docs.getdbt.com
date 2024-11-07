---
title: "JDBC"
id: sl-jdbc
description: "Integrate and use the JDBC API to query your metrics."
tags: [Semantic Layer, API]
---

The dbt Semantic Layer Java Database Connectivity (JDBC) API enables users to query metrics and dimensions using the JDBC protocol, while also providing standard metadata functionality. 

A JDBC driver is a software component enabling a Java application to interact with a data platform. Here's some more information about our JDBC API:

- The Semantic Layer JDBC API utilizes the open-source JDBC driver with ArrowFlight SQL protocol.
- You can download the JDBC driver from [Maven](https://search.maven.org/remotecontent?filepath=org/apache/arrow/flight-sql-jdbc-driver/12.0.0/flight-sql-jdbc-driver-12.0.0.jar). 
- The dbt Semantic Layer supports ArrowFlight SQL driver version 12.0.0 and higher. 
- You can embed the driver into your application stack as needed, and you can use dbt Labs' [example project](https://github.com/dbt-labs/example-semantic-layer-clients) for reference.
- If you’re a partner or user building a homegrown application, you’ll need to install an AWS root CA to the Java Trust [documentation](https://www.amazontrust.com/repository/) (specific to Java and JDBC call).

dbt Labs partners can use the JDBC API to build integrations in their tools with the dbt Semantic Layer

## Using the JDBC API

If you are a dbt user or partner with access to dbt Cloud and the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), you can [setup](/docs/use-dbt-semantic-layer/setup-sl) and test this API with data from your own instance by configuring the Semantic Layer and obtaining the right JDBC connection parameters described in this document.

You *may* be able to use our JDBC API with tools that do not have an official integration with the dbt Semantic Layer. If the tool you use allows you to write SQL and either supports a generic JDBC driver option (such as DataGrip) or supports Dremio and uses ArrowFlightSQL driver version 12.0.0 or higher, you can access the Semantic Layer API.

Refer to [Get started with the dbt Semantic Layer](/guides/sl-snowflake-qs) for more info.

Note that the dbt Semantic Layer API doesn't support `ref` to call dbt objects. Instead, use the complete qualified table name. If you're using dbt macros at query time to calculate your metrics, you should move those calculations into your Semantic Layer metric definitions as code.

## Authentication

dbt Cloud authorizes requests to the dbt Semantic Layer API. You need to provide an environment ID, host, and [service account tokens](/docs/dbt-cloud-apis/service-tokens).

## Connection parameters

The JDBC connection requires a few different connection parameters. 

This is an example of a URL connection string and the individual components: 

```
jdbc:arrow-flight-sql://semantic-layer.cloud.getdbt.com:443?&environmentId=202339&token=SERVICE_TOKEN
```

| JDBC parameter | Description | Example |
| -------------- | ----------- | ------- |
| `jdbc:arrow-flight-sql://` | The protocol for the JDBC driver.  | `jdbc:arrow-flight-sql://` |
| `semantic-layer.cloud.getdbt.com` | The [access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your account's dbt Cloud region. You must always add the `semantic-layer` prefix before the access URL.  | For dbt Cloud deployment hosted in North America, use `semantic-layer.cloud.getdbt.com`  |
| `environmentId` | The unique identifier for the dbt production environment, you can retrieve this from the dbt Cloud URL <br /> when you navigate to **Environments** under **Deploy**. | If your URL ends with `.../environments/222222`, your `environmentId` is `222222`<br /><br />   |
| `SERVICE_TOKEN` | dbt Cloud [service token](/docs/dbt-cloud-apis/service-tokens) with “Semantic Layer Only” and "Metadata Only" permissions. Create a new service token on the **Account Settings** page. | `token=SERVICE_TOKEN` |

*Note &mdash; If you're testing locally on a tool like DataGrip, you may also have to provide the following variable at the end or beginning of the JDBC URL `&disableCertificateVerification=true`.

## Querying the API for metric metadata

The Semantic Layer JDBC API has built-in metadata calls which can provide a user with information about their metrics and dimensions.

Expand the following toggles for examples and metadata commands:

<Expandable alt_header="Fetch defined metrics">

You can use this query to fetch all defined metrics in your dbt project:

```bash
select * from {{ 
	semantic_layer.metrics() 
}}
```
</Expandable>

<Expandable alt_header="Fetch dimension for a metric">

You can use this query to fetch all dimensions for a metric.

Note, metrics is a required argument that lists one or multiple metrics in it.

```bash
select * from {{ 
    semantic_layer.dimensions(metrics=['food_order_amount'])}}
```
</Expandable>

<Expandable alt_header="Fetch dimension values">

You can use this query to fetch dimension values for one or multiple metrics and a single dimension.

Note, metrics is a required argument that lists one or multiple metrics, and a single dimension.

```bash
select * from {{ 
semantic_layer.dimension_values(metrics=['food_order_amount'], group_by=['customer__customer_name'])}}
```
</Expandable>

<Expandable alt_header="Fetch granularities for metrics">

You can use this query to fetch queryable granularities for a list of metrics. 

This API request allows you to only show the time granularities that make sense for the primary time dimension of the metrics (such as metric_time), but if you want queryable granularities for other time dimensions, you can use the dimensions() call, and find the column queryable_granularities.

Note, metrics is a required argument that lists one or multiple metrics.
```bash
select * from {{
    semantic_layer.queryable_granularities(metrics=['food_order_amount', 'order_gross_profit'])}}
```

</Expandable>

<Expandable alt_header="Fetch available metrics given dimensions">

You can use this query to fetch available metrics given dimensions. This command is essentially the opposite of getting dimensions given a list of metrics.

Note, group_by is a required argument that lists one or multiple dimensions.

```bash
select * from {{
    semantic_layer.metrics_for_dimensions(group_by=['customer__customer_type'])
}}
```

</Expandable>

<Expandable alt_header="Fetch granularities for all time dimensions">

You can use this example query to fetch available granularities for all time dimensions (the similar queryable granularities API call only returns granularities for the primary time dimensions for metrics).

The following call is a derivative of the dimensions() call and specifically selects the granularity field.

```bash
select NAME, QUERYABLE_GRANULARITIES from {{
    semantic_layer.dimensions(
        metrics=["order_total"]
    )
}}
```

</Expandable>

<Expandable alt_header="Fetch primary time dimension names">

It may be useful in your application to expose the names of the time dimensions that represent metric_time or the common thread across all metrics.

You can first query the metrics() argument to fetch a list of measures, then use the measures() call which will return the name(s) of the time dimensions that make up metric time.

```bash
select * from {{
    semantic_layer.measures(metrics=['orders'])
}}
```

</Expandable>

<Expandable alt_header="Fetch metrics by substring search">

You can filter your metrics to include only those that contain a specific substring (sequence of characters contained within a larger string (text)). Use the `search` argument to specify the substring you want to match.

```sql
select * from {{ semantic_layer.metrics(search='order') }}
```

If no substring is provided, the query returns all metrics.

</Expandable> 

<Expandable alt_header="Paginate metadata calls">

In the case when you don't want to return the full result set from a metadata call, you can paginate the results for both `semantic_layer.metrics()` and `semantic_layer.dimensions()` calls using the `page_size` and `page_number` parameters.

- `page_size`: This is an optional variable which sets the number of records per page. If left as None, there is no page limit.
- `page_number`: This is an optional variable which specifies the page number to retrieve. Defaults to `1` (first page) if not specified.

Examples:

```sql
-- Retrieves the 5th page with a page size of 10 metrics
select * from {{ semantic_layer.metrics(page_size=10, page_number=5) }}

-- Retrieves the 1st page with a page size of 10 metrics
select * from {{ semantic_layer.metrics(page_size=10) }}

-- Retrieves all metrics without pagination
select * from {{ semantic_layer.metrics() }}
```

You can use the same pagination parameters for `semantic_layer.dimensions(...)`.
</Expandable> 

<Expandable alt_header="List saved queries">

You can use this example query to list all available saved queries in your dbt project.

**Command**

```bash
select * from semantic_layer.saved_queries()
```

**Output**

```bash
| NAME | DESCRIPTION | LABEL | METRICS | GROUP_BY | WHERE_FILTER |
```

</Expandable>

<!--
<Tabs>

<TabItem value="allmetrics" label="Defined metrics">

Use this query to fetch all defined metrics in your dbt project:

```bash
select * from {{ 
	semantic_layer.metrics() 
}}
```
</TabItem>

<TabItem value="alldimensions" label="Dimensions for a metric">

Use this query to fetch all dimensions for a metric. 

Note, `metrics` is a required argument that lists one or multiple metrics in it.

```bash
select * from {{ 
	semantic_layer.dimensions(metrics=['food_order_amount'])}}
```

</TabItem>

<TabItem value="dimensionvalueformetrics" label="Dimension values">

Use this query to fetch dimension values for one or multiple metrics and a single dimension. 

Note, `metrics` is a required argument that lists one or multiple metrics, and a single dimension. 

```bash
select * from {{ 
semantic_layer.dimension_values(metrics=['food_order_amount'], group_by=['customer__customer_name'])}}
```

</TabItem>

<TabItem value="queryablegranularitiesformetrics" label="Granularities for metrics">

You can use this query to fetch queryable granularities for a list of metrics. 

This API request allows you to only show the time granularities that make sense for the primary time dimension of the metrics (such as `metric_time`), but if you want queryable granularities for other time dimensions, you can use the `dimensions()` call, and find the column queryable_granularities.

Note, `metrics` is a required argument that lists one or multiple metrics.

```bash
select * from {{
    semantic_layer.queryable_granularities(metrics=['food_order_amount', 'order_gross_profit'])}}
```

</TabItem>

</Tabs>

<Tabs>

<TabItem value="metricsfordimensions" label="Available metrics given dimensions">

Use this query to fetch available metrics given dimensions. This command is essentially the opposite of getting dimensions given a list of metrics.

Note, `group_by` is a required argument that lists one or multiple dimensions.

```bash
select * from {{
    semantic_layer.metrics_for_dimensions(group_by=['customer__customer_type'])

}}
```

</TabItem>

<TabItem value="queryablegranularitiesalltimedimensions" label="Granularities for all time dimensions">

You can use this example query to fetch available granularities for all time dimensions (the similar queryable granularities API call only returns granularities for the primary time dimensions for metrics). 

The following call is a derivative of the `dimensions()` call and specifically selects the granularity field.

```bash
select NAME, QUERYABLE_GRANULARITIES from {{
    semantic_layer.dimensions(
        metrics=["order_total"]
    )
}}

```

</TabItem>

<TabItem value="fetchprimarytimedimensionnames" label="Primary time dimension names">

It may be useful in your application to expose the names of the time dimensions that represent `metric_time` or the common thread across all metrics.

You can first query the `metrics()` argument to fetch a list of measures, then use the `measures()` call which will return the name(s) of the time dimensions that make up metric time. 

```bash
select * from {{
    semantic_layer.measures(metrics=['orders'])
}}
```
</TabItem>
</Tabs>

-->

## Querying the API for metric values

To query metric values, here are the following parameters that are available. Your query must have _either_ a `metric` **or** a `group_by` parameter to be valid. 

| Parameter | <div style={{width:'400px'}}>Description</div>  | <div style={{width:'100px'}}>Example</div>  | 
| --------- | -----------| ------------ |
| `metrics`   | The metric name as defined in your dbt metric configuration   | `metrics=['revenue']` | 
| `group_by`  | Dimension names or entities to group by. We require a reference to the entity of the dimension (other than for the primary time dimension), which is pre-appended to the front of the dimension name with a double underscore. | `group_by=['user__country', 'metric_time']`    |
| `grain`   | A parameter specific to any time dimension and changes the grain of the data from the default for the metric. | `group_by=[Dimension('metric_time')` <br/> `grain('week\|day\|month\|quarter\|year')]` | 
| `where`     | A where clause that allows you to filter on dimensions and entities using parameters. This takes a filter list OR string. Inputs come with `Dimension`, and `Entity` objects. Granularity is required if the `Dimension` is a time dimension | `"{{ where=Dimension('customer__country') }} = 'US')"`   | 
| `limit`   | Limit the data returned    | `limit=10` | 
|`order`  | Order the data returned by a particular field     | `order_by=['order_gross_profit']`, use `-` for descending, or full object notation if the object is operated on: `order_by=[Metric('order_gross_profit').descending(True)`]   | 
| `compile`   | If true, returns generated SQL for the data platform but does not execute | `compile=True`  |
| `saved_query` | A saved query you can use for frequently used queries. | `select * from {{ semantic_layer.query(saved_query="new_customer_orders"` |

## Note on time dimensions and `metric_time`

You will notice that in the list of dimensions for all metrics, there is a dimension called `metric_time`. `Metric_time` is a reserved keyword for the measure-specific aggregation time dimensions. For any time-series metric, the `metric_time` keyword should always be available for use in queries. This is a common dimension across *all* metrics in a semantic graph. 

You can look at a single metric or hundreds of metrics, and if you group by `metric_time`, it will always give you the correct time series.

Additionally, when performing granularity calculations that are global (not specific to a particular time dimension), we recommend you always operate on `metric_time` and you will get the correct answer. 

Note that `metric_time` should be available in addition to any other time dimensions that are available for the metric(s). In the case where you are looking at one metric (or multiple metrics from the same data source), the values in the series for the primary time dimension and `metric_time` are equivalent.


## Examples

Refer to the following examples to help you get started with the JDBC API.

### Fetch metadata for metrics

You can filter/add any SQL outside of the templating syntax. For example, you can use the following query to fetch the name and dimensions for a metric: 

```bash
select name, dimensions from {{ 
	semantic_layer.metrics() 
	}}
	WHERE name='food_order_amount'
``` 

### Query common dimensions

You can select common dimensions for multiple metrics. Use the following query to fetch the name and dimensions for multiple metrics: 

```bash
select * from {{ 
	semantic_layer.dimensions(metrics=['food_order_amount', 'order_gross_profit'])
	}}
``` 

### Query grouped by time

The following example query uses the [shorthand method](#faqs) to fetch revenue and new customers grouped by time:

```bash
select * from {{
	semantic_layer.query(metrics=['food_order_amount','order_gross_profit'], 
	group_by=['metric_time'])
	}}
``` 

### Query with a time grain

Use the following example query to fetch multiple metrics with a change in time dimension granularities:

```bash
select * from {{
	semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'], 
	group_by=[Dimension('metric_time').grain('month')])
	}}
```

### Group by categorical dimension

Use the following query to group by a categorical dimension:

```bash
select * from {{
	semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'], 
	group_by=[Dimension('metric_time').grain('month'), 'customer__customer_type'])
	}}
``` 

### Query only a dimension

In this case, you'll get the full list of dimension values for the chosen dimension.

```bash
select * from {{
    semantic_layer.query(group_by=['customer__customer_type'])
                  }}
```

### Query with where filters

Where filters in API allow for a filter list or string. We recommend using the filter list for production applications as this format will realize all benefits from the <Term id="predicate-pushdown"  /> where possible. 

Where Filters have a few objects that you can use:

- `Dimension()` &mdash; Used for any categorical or time dimensions. `Dimension('metric_time').grain('week')` or `Dimension('customer__country')`.

- `TimeDimension()` &mdash;  Used as a more explicit definition for time dimensions, optionally takes in a granularity `TimeDimension('metric_time', 'month')`.

- `Entity()` &mdash;  Used for entities like primary and foreign keys - `Entity('order_id')`.


For `TimeDimension()`, the grain is only required in the `WHERE` filter if the aggregation time dimensions for the measures and metrics associated with the where filter have different grains. 

For example, consider this Semantic model and Metric config, which contains two metrics that are aggregated across different time grains. This example shows a single semantic model, but the same goes for metrics across more than one semantic model.

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

Assuming the user is querying `metric_0` and `metric_1` together in a single request, a valid `WHERE` filter would be:

  * `"{{ TimeDimension('metric_time', 'year') }} > '2020-01-01'"`

Invalid filters would be:

  * `"{{ TimeDimension('metric_time') }} > '2020-01-01'"` &mdash; metrics in the query are defined based on measures with different grains.

  * `"{{ TimeDimension('metric_time', 'month') }} > '2020-01-01'"` &mdash; `metric_1` is not available at a month grain.


- Use the following example to query using a `where` filter with the string format:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
where="{{ Dimension('metric_time').grain('month')  }} >= '2017-03-09' AND {{ Dimension('customer__customer_type' }} in ('new') AND {{ Entity('order_id') }} = 10")
}}
```

- (Recommended for better performance) Use the following example to query using a `where` filter with a filter list format:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
where=["{{ Dimension('metric_time').grain('month') }} >= '2017-03-09'", "{{ Dimension('customer__customer_type') }} in ('new')", "{{ Entity('order_id') }} = 10"])
}}
```

### Query with a limit

Use the following example to query using a `limit` or `order_by` clause:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10)
  }}
```

### Query with Order By Examples 

Order By can take a basic string that's a Dimension, Metric, or Entity, and this will default to ascending order

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10,
  order_by=['order_gross_profit'])
  }}
``` 

For descending order, you can add a `-` sign in front of the object. However, you can only use this short-hand notation if you aren't operating on the object or using the full object notation. 

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10,
  order_by=['-order_gross_profit'])
  }}
```

If you are ordering by an object that's been operated on (for example, you changed the granularity of the time dimension), or you are using the full object notation, descending order must look like:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time').grain('week')],
  limit=10,
  order_by=[Metric('order_gross_profit').descending(True), Dimension('metric_time').grain('week').descending(True) ])
  }}
``` 

Similarly, this will yield ascending order: 

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time').grain('week')],
  limit=10,
  order_by=[Metric('order_gross_profit'), Dimension('metric_time').grain('week')])
  }}
``` 


### Query with compile keyword

- Use the following example to query using a `compile` keyword:
  ```sql
  select * from {{
  semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
      group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
      compile=True)
      }}
  ```

- Use the following example to compile SQL with a [saved query](/docs/build/saved-queries). You can use this for frequently used queries.

  ```sql
  select * from {{ semantic_layer.query(saved_query="new_customer_orders", limit=5, compile=True}}
  ```

:::info A note on querying saved queries
When querying [saved queries](/docs/build/saved-queries),you can use parameters such as `where`, `limit`, `order`, `compile`, and so on. However, keep in mind that you can't access `metric` or `group_by` parameters in this context. This is because they are predetermined and fixed parameters for saved queries, and you can't change them at query time. If you would like to query more metrics or dimensions, you can build the query using the standard format.
:::

### Query a saved query

Use the following example to query a [saved query](/docs/build/saved-queries):

```sql
select * from {{ semantic_layer.query(saved_query="new_customer_orders", limit=5}}
```

The JDBC API will use the saved query (`new_customer_orders`) as defined and apply a limit of 5 records.

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

## FAQs

<FAQ path="Troubleshooting/sl-alpn-error" />

<DetailsToggle alt_header="Why do some dimensions use different syntax, like `metric_time` versus `Dimension('metric_time')`?">
When you select a dimension on its own, such as `metric_time` you can use the shorthand method which doesn't need the “Dimension” syntax. 

However, when you perform operations on the dimension, such as adding granularity, the object syntax `[Dimension('metric_time')` is required.
</DetailsToggle>

<DetailsToggle alt_header="What does the double underscore `'__'` syntax in dimensions mean?">

The double underscore `"__"` syntax indicates a mapping from an entity to a dimension, as well as where the dimension is located. For example, `user__country` means someone is looking at the `country` dimension from the `user` table.
</DetailsToggle>

<DetailsToggle alt_header="What is the default output when adding granularity?">

The default output follows the format `{{time_dimension_name}__{granularity_level}}`. 

So for example, if the `time_dimension_name` is `ds` and the granularity level is yearly, the output is `ds__year`.

</DetailsToggle>

## Related docs

- [dbt Semantic Layer integration best practices](/guides/sl-partner-integration-guide)

