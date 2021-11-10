---
title: "Metrics"
id: "metrics"
---

<Changelog>

* **v1.0.0**: Metrics are new and experimental

</Changelog>

:::info Metrics are new
An initial version of `metrics` was introduced in v1.0.0, following [vibrant community discusion](https://github.com/dbt-labs/dbt-core/issues/4071). Try them out, and let us know what you think!
:::

:::caution Metrics are experimental
`metrics` will be released in v1.0, but they should _not_ be considered a stable API. We reserve the right to make breaking changes to their schema in future **minor** versions. We will aim for backwards compatibility whenever possible.
:::

## Related documentation
* [`metric:` selection method](node-selection/methods#the-metric-method)

## Getting started

A metric is a timeseries aggregation over a table that supports zero or more dimensions. Some examples of metrics include:

- active users
- churn rate
- mrr (monthly recurring revenue)

Starting in v1.0, dbt supports metric definitions as a new node type. Like [exposures](exposures), metrics participate in the dbt DAG and can be expressed in yaml files. By defining metrics in dbt projects, analytics engineers can encode crucial business logic in tested, version controlled code. Further, these metrics definitions can be exposed to downstream tooling to drive consistency and precision in metric reporting.

### Declaring a metric

Exposures are defined in `.yml` files nested under an `metrics:` key.

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
    description: "The number of paid customers who are using the product"

    type: count
    sql: user_id # superflous here, but shown as an example

    timestamp: signup_date
    time_grains: [day, week, month]

    dimensions:
      - plan
      - country
    
    filters:
      - field: is_paying
        value: true

    meta: {}
```

</File>

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

### Why define metrics?

**Use metric specifications in downstream tools.** Metrics are available to dbt's compilation context via the [`graph.metrics` variable](graph). They are included in [the manifest artifact](manifest-json) for downstream metadata consumption.

**See and select dependencies.** As with exposures, it's possible to see everything that rolls up into a metric (`dbt ls -s +metric:*`), and visualize them in [dbt documentation](documentation).

<Lightbox src="/img/docs/building-a-dbt-project/dag-metrics.png" title="Metrics appear as pink nodes in the DAG (for now)"/>

### Open questions

- Should metrics be defined on top of more strongly typed **attributes**, rather than columns? [dbt-core#4090](https://github.com/dbt-labs/dbt-core/issues/4090)
- Should metrics include support for joins? How should dbt know about foreign-key relationships between models? [dbt-core#4125](https://github.com/dbt-labs/dbt-core/issues/4125)
- Should metrics inherit configurations from the models on which they are defined? Should it be possible to define metrics directly on models/columns, like tests?

These are just a start! We welcome you to check out open issues on GitHub, and join the conversation.
