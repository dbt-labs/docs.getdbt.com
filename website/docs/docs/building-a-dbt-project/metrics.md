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

## About metrics 

A metric is a timeseries aggregation over a table that supports zero or more dimensions. Some examples of metrics include:
- active users
- churn rate
- mrr (monthly recurring revenue)

In v1.0, dbt supports metric definitions as a new node type. Like [exposures](exposures), metrics participate in the dbt DAG and can be expressed in YAML files. By defining metrics in dbt projects, you encode crucial business logic in tested, version-controlled code. Further, you can expose these metrics definitions to downstream tooling, which drives consistency and precision in metric reporting.

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
        value: true

    meta: {team: Finance}
```

</File>

### Metrics properties

You can see how these properties are used in the [example YAML file](#declaring-a-metric).

| Field       | Description                                               | Example                           | Required? |
|-------------|-----------------------------------------------------------|-----------------------------------|-----------|
| name        | Unique identifier for the metric                          | new_customers                     | Yes       |
| model       | The dbt model that powers this metric                     | dim_customers                     | Yes       |
| label       | A short name / label for the metric                       | New Customers                     | No        |
| description | Long form, human-readable description for the metric      | "The number of paid customers..." | No        |
| type        | Type of calculation to perform when evaluating a metric   | count_distinct                    | Yes       |
| sql         | Expression to aggregate or calculate over                 | user_id                           | Yes       |
| timestamp   | Time-based component of the metric                        | signup_date                       | Yes       |
| time_grains | One or more "grains" at which the metric can be evaluated | [day, week, month]                | Yes       |
| dimensions  | List of dimensions to group or filter the metric by       | plan <br/> country                | No        |
| filters     | List of filters to apply before calculating the metric    | field: is_paying<br/>value: true  | No        |
| meta        | Arbitrary key/value store                                 | {team: Finance}                   | No        |

## Ongoing discussions

- Should metrics be defined on top of more strongly typed **attributes**, rather than columns? [dbt-core#4090](https://github.com/dbt-labs/dbt-core/issues/4090)
- Should metrics include support for joins? How should dbt know about foreign-key relationships between models? [dbt-core#4125](https://github.com/dbt-labs/dbt-core/issues/4125)
- Should metrics inherit configurations from the models on which they are defined? Should it be possible to define metrics directly on models/columns, like tests?

These are just a start! We welcome you to check out open issues on GitHub, and join the conversation.

