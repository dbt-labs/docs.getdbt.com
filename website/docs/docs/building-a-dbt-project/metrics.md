---
title: "Metrics"
id: "metrics"
description: "When you define metrics in dbt projects, you encode crucial business logic in tested, version-controlled code. The dbt metrics layer helps you standardize metrics within your organization."
keywords:
  - dbt metrics layer
---

<Changelog>

* **v1.0.0**: Metrics are new and experimental

</Changelog>


:::info Metrics are new
v1.0.0 includes an initial version of metrics, following a [vibrant community discussion](https://github.com/dbt-labs/dbt-core/issues/4071). Try them out, and let us know what you think!
:::

:::caution Metrics are experimental
v1.0 includes metrics, but they should be considered an _unstable_ API because they are experimental and subject to change. We reserve the right to make breaking changes to the metrics schema in future **minor** versions, but will aim for backwards compatibility when possible.
:::

## About Metrics 

A metric is a timeseries aggregation over a <Term id="table" /> that supports zero or more dimensions. Some examples of metrics include:
- active users
- mrr (monthly recurring revenue)

In v1.0, dbt supports metric definitions as a new node type. Like [exposures](exposures), metrics participate in the dbt DAG and can be expressed in YAML files. By defining metrics in dbt projects, you encode crucial business logic in tested, version-controlled code. Further, you can expose these metrics definitions to downstream tooling, which drives consistency and precision in metric reporting.

For more information on query the metrics that are defined, please reference the [dbt_metrics package.](https://github.com/dbt-labs/dbt_metrics)

### Benefits of defining metrics

**Use metric specifications in downstream tools**  
dbt's compilation context can access metrics via the [`graph.metrics` variable](graph). The [manifest artifact](manifest-json) includes metrics for downstream metadata consumption.

**See and select dependencies**   
As with Exposures, you can see everything that rolls up into a metric (`dbt ls -s +metric:*`), and visualize them in [dbt documentation](documentation). For more information, see "[The `metric:` selection method](node-selection/methods#the-metric-method)."

<Lightbox src="/img/docs/building-a-dbt-project/dag-metrics.png" title="Metrics appear as pink nodes in the DAG (for now)"/>

## Declaring a metric

You can define metrics in `.yml` files nested under a `metrics:` key.

<File name='models/<filename>.yml'>

```yaml
# models/marts/product/schema.yml

version: 2

models:
 - name: dim_customers
   ...

metrics:
  - name: new_customers
    label: New Customers
    model: ref('dim_customers')
    description: "The number of paid customers using the product"

    type: count
    sql: user_id # superfluous here, but shown as an example

    timestamp: signup_date
    time_grains: [day, week, month]

    dimensions:
      - plan
      - country
    
    filters:
      - field: is_paying
        operator: 'is'
        value: 'true'
      - field: lifetime_value
        operator: '>='
        value: '100'
      - field: company_name
        operator: '!='
        value: "'Acme, Inc'"
      - field: signup_date
        operator: '>='
        value: "'2020-01-01'"


    meta: {team: Finance}
```

</File>

<VersionBlock firstVersion="1.2">

### Available properties

| Field       | Description                                                 | Example                         | Required? |
|-------------|-------------------------------------------------------------|---------------------------------|-----------|
| name        | A unique identifier for the metric                          | new_customers                   | yes       |
| model       | The dbt model that powers this metric                       | dim_customers                   |     yes (no for `expression` metrics)    |
| label       | A short for name / label for the metric                     | New Customers                   | no        |
| description | Long form, human-readable description for the metric        | The number of customers who.... | no        |
| type        | The type of calculation to perform when evaluating a metric | count_distinct                  | yes       |
| sql         | The expression to aggregate/calculate over                  | user_id                         | yes       |
| timestamp   | The time-based component of the metric                      | signup_date                     | yes       |
| time_grains | One or more "grains" at which the metric can be evaluated   | [day, week, month]              | yes       |
| dimensions  | A list of dimensions to group or filter the metric by       | [plan, country]                 | no        |
| filters     | A list of filters to apply before calculating the metric    | See below                       | no        |
| meta        | Arbitrary key/value store                                   | {team: Finance}                 | no        |

</VersionBlock>

<VersionBlock firstVersion="1.2">

### Available types

| Metric Type    |  Description                                                               |
|----------------|----------------------------------------------------------------------------|
| count          | This metric type will apply the `count` aggregation to the specified field |
| count_distinct | This metric type will apply the `count` aggregation to the specified field, with an additional distinct statement inside the aggregation |
| sum            | This metric type will apply the `sum` aggregation to the specified field |
| average        | This metric type will apply the `average` aggregation to the specified field |
| min            | This metric type will apply the `min` aggregation to the specified field |
| max            | This metric type will apply the `max` aggregation to the specified field |
| expression     | This metric type is defined as any **non-aggregating** calculation of 1 or more metrics |

</VersionBlock>

<VersionBlock firstVersion="1.2">

### Expression Metrics
In v1.2, support was added for `expression` metrics, which are defined as non-aggregating calculations of 1 or more metrics. By defining these metrics, you are able to create metrics like:
- ratios
- subtractions 
- any arbitrary calculation

As long as the two+ base metrics (the metrics that comprise the `expression` metric) share the specified `time_grains` and `dimensions`, those attributes can be used in any downstream metrics macro.

An example definition of an `expression` metric is:
</VersionBlock>

<VersionBlock firstVersion="1.2">

```yaml
# models/marts/product/schema.yml
version: 2

models:
 - name: dim_customers
   ...

metrics:
  - name: average_revenue_per_customer
    label: Average Revenue Per Customer
    description: "The average revenue received per customer"

    type: expression
    sql: "{{metric('total_revenue')}} / {{metric('count_of_customers')}}"

    timestamp: order_date
    time_grains: [day, week, month]
    dimensions:
      - had_discount
      - order_country

```
</VersionBlock>


<VersionBlock lastVersion="1.1">

### Available properties

| Field       | Description                                                 | Example                         | Required? |
|-------------|-------------------------------------------------------------|---------------------------------|-----------|
| name        | A unique identifier for the metric                          | new_customers                   | yes       |
| model       | The dbt model that powers this metric                       | dim_customers                   | yes       |
| label       | A short for name / label for the metric                     | New Customers                   | no        |
| description | Long form, human-readable description for the metric        | The number of customers who.... | no        |
| type        | The type of calculation to perform when evaluating a metric | count_distinct                  | yes       |
| sql         | The expression to aggregate/calculate over                  | user_id                         | yes       |
| timestamp   | The time-based component of the metric                      | signup_date                     | yes       |
| time_grains | One or more "grains" at which the metric can be evaluated   | [day, week, month]              | yes       |
| dimensions  | A list of dimensions to group or filter the metric by       | [plan, country]                 | no        |
| filters     | A list of filters to apply before calculating the metric    | See below                       | no        |
| meta        | Arbitrary key/value store                                   | {team: Finance}                 | no        |

</VersionBlock>

### Filters
Filters should be defined as a list of dictionaries that define predicates for the metric. Filters are combined using AND clauses. For more control, users can (and should) include the complex logic in the model powering the metric. 

All three properties (`field`, `operator`, `value`) are required for each defined filter.

Note that `value` must be defined as a string in YAML, because it will be compiled into queries as part of a string. If your filter's value needs to be surrounded in quotes inside the query (e.g. text or dates), use `"'nested'"` quotes:

```yml
    filters:
      - field: is_paying
        operator: 'is'
        value: 'true'
      - field: lifetime_value
        operator: '>='
        value: '100'
      - field: company_name
        operator: '!='
        value: "'Acme, Inc'"
      - field: signup_date
        operator: '>='
        value: "'2020-01-01'"
```

## Ongoing discussions

- Should metrics be defined on top of more strongly typed **attributes**, rather than columns? [dbt-core#4090](https://github.com/dbt-labs/dbt-core/issues/4090)
- Should metrics include support for joins? How should dbt know about foreign-key relationships between models? [dbt-core#4125](https://github.com/dbt-labs/dbt-core/issues/4125)
- Should metrics inherit configurations from the models on which they are defined? Should it be possible to define metrics directly on models/columns, like tests?

These are just a start! We welcome you to check out open issues on GitHub, and join the conversation.

