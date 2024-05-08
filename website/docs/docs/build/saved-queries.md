---
title: Saved queries
id: saved-queries
description: "Saved queries are a way to save commonly used queries in MetricFlow. They can be used to save time and avoid writing the same query over and over again."
sidebar_label: "Saved queries"
tags: [Metrics, Semantic Layer]
---

Saved queries are a way to save commonly used queries in MetricFlow. You can group metrics, dimensions, and filters that are logically related into a saved query. Saved queries is a node and visible in the dbt <Term id="dag" />.

Saved queries serve as the foundational building block, allowing you to [configure exports](#configure-exports) in your saved query configuration. Exports takes this functionality a step further by enabling you to [schedule and write saved queries](/docs/use-dbt-semantic-layer/exports) directly within your data platform using [dbt Cloud's job scheduler](/docs/deploy/job-scheduler).

## Parameters

To create a saved query, refer to the following table parameters.

:::tip
Note that we use the double colon (::) to indicate whether a parameter is nested within another parameter. So for example, `query_params::metrics` means the `metrics` parameter is nested under `query_params`.
:::
<!-- For versions 1.8 and higher -->
<VersionBlock firstVersion="1.8">

| Parameter | Type    | Required | Description    |
|-------|---------|----------|----------------|
| `name`       | String    | Required     | Name of the saved query object.          |
| `description`     | String      | Required     | A description of the saved query.     |
| `label`     | String      | Required     | The display name for your saved query. This value will be shown in downstream tools.    |
| `config`     | String      | Required     | A config section for any parameters specifying the saved query.   |
| `config::cache`     | String      | Optional     |  A boolean to specify if a saved query should be used to populate the cache. Accepts `true` or `false`. Defaults to `false` |
| `query_params`       | Structure   | Required     | Contains the query parameters. |
| `query_params::metrics`   | List or String   | Optional    | A list of the metrics to be used in the query as specified in the command line interface. |
| `query_params::group_by`    | List or String          | Optional    | A list of the Entities and Dimensions to be used in the query, which include the `Dimension` or `TimeDimension`. |
| `query_params::where`        | List or String | Optional  | A list of strings that may include the `Dimension` or `TimeDimension` objects. |
| `exports`     | List or Structure | Optional    | A list of exports to be specified within the exports structure.     |
| `exports::name`       | String               | Required     | Name of the export object.      |
| `exports::config`     | List or Structure     | Required     | A config section for any parameters specifying the export.  |
| `exports::config::export_as` | String    | Required     | The type of export to run. Options include table or view currently and cache in the near future.   |
| `exports::config::schema`   | String   | Optional    | The schema for creating the table or view. This option cannot be used for caching.   |
| `exports::config::alias`  | String     | Optional    | The table alias used to write to the table or view.  This option cannot be used for caching.  |

</VersionBlock> 

<!-- For versions 1.7 and lower-->
<VersionBlock lastVersion="1.7">

| Parameter | Type    | Required | Description    |
|-------|---------|----------|----------------|
| `name`       | String    | Required     | Name of the saved query object.          |
| `description`     | String      | Required     | A description of the saved query.     |
| `label`     | String      | Required     | The display name for your saved query. This value will be shown in downstream tools.    |
| `query_params`       | Structure   | Required     | Contains the query parameters. |
| `query_params::metrics`   | List or String   | Optional    | Metrics nested with the `query_params`: a list of the metrics to be used in the query as specified in the command line interface. |
| `query_params::group_by`    | List or String          | Optional    | Grouping nested with the `query_params`: a list of the Entities and Dimensions to be used in the query, which include the `Dimension` or `TimeDimension`. |
| `query_params::where`        | List or String | Optional  | Conditions nested with the `query_params`: a list of strings that may include the `Dimension` or `TimeDimension` objects. |
| `exports`     | List or Structure | Optional    | A list of exports to be specified within the exports structure.     |
| `exports::name`       | String               | Required     | Name of export object, nested within `exports`.   |
| `exports::config`     | List or Structure     | Required     | A config section for any parameters specifying the export, nested within `exports`.  |
| `exports::config::export_as` | String    | Required     |  Specifies the type of export: table, view, or upcoming cache options. Nested within `exports` and `config`.   |
| `exports::config::schema`   | String   | Optional    | Schema for creating the table or view, not applicable for caching. Nested within `exports` and `config`.   |
| `exports::config::alias`  | String     | Optional    | Table alias used to write to the table or view.  This option can't be used for caching. Nested within `exports` and `config`.  |

</VersionBlock>

All metrics in a saved query need to use the same dimensions in the `group_by` or `where` clauses.
Use the semantic model name prefix with the Dimension object, like `Dimension('user__ds')`.

## Configure saved query

Use saved queries to define and manage common Semantic Layer queries in YAML, including metrics and dimensions. Saved queries enable you to organize and reuse common MetricFlow queries within dbt projects. For example, you can group related metrics together for better organization, and include commonly used dimensions and filters.

All metrics in a saved query need to use the same dimensions in the `group_by` or `where` clauses. The following is an example of a saved query:

<!-- For versions 1.8 and higher -->
<VersionBlock firstVersion="1.8">

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Test saved query
    config:
      cache:
        enabled: true  # Or false if you want it disabled by default
    query_params:
      metrics:
        - simple_metric
      group_by:
        - "Dimension('user__ds')"
      where:
        - "{{ Dimension('user__ds', 'DAY') }} <= now()"
        - "{{ Dimension('user__ds', 'DAY') }} >= '2023-01-01'"
    exports:
      - name: my_export
        config:
          alias: my_export_alias
          export_as: table
          schema: my_export_schema_name
```
</File>

</VersionBlock> 

<!-- For versions 1.7 and lower-->
<VersionBlock lastVersion="1.7">

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Test saved query
    query_params:
      metrics:
        - simple_metric
      group_by:
        - "Dimension('user__ds')"
      where:
        - "{{ Dimension('user__ds', 'DAY') }} <= now()"
        - "{{ Dimension('user__ds', 'DAY') }} >= '2023-01-01'"
    exports:
      - name: my_export
        config:
          alias: my_export_alias
          export_as: table
          schema: my_export_schema_name
```
</File>
</VersionBlock>

## Configure exports

Exports are an additional configuration added to a saved query. They define _how_ to write a saved query, along with the schema and table name.

Once you've configured your saved query and set the foundation block, you can now configure exports in the `saved_queries` YAML configuration file (the same file as your metric definitions). This will also allow you to [run exports](#run-exports) automatically within your data platform using [dbt Cloud's job scheduler](/docs/deploy/job-scheduler).

The following is an example of a saved query with an export:

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: order_metrics
    description: Relevant order metrics
    query_params:
      metrics:
        - orders
        - large_order
        - food_orders
        - order_total
      group_by:
        - Entity('order_id')
        - TimeDimension('metric_time', 'day')
        - Dimension('customer__customer_name')
        - ... # Additional group_by
      where:
        - "{{TimeDimension('metric_time')}} > current_timestamp - interval '1 week'"
         - ... # Additional where clauses
    exports:
      - name: order_metrics
        config:
          export_as: table # Options available: table, view
          schema: YOUR_SCHEMA # Optional - defaults to deployment schema
          alias: SOME_TABLE_NAME # Optional - defaults to Export name
```
</File>

## Run exports

Once you've configured exports, you can now take things a step further by running exports to automatically write saved queries within your data platform using [dbt Cloud's job scheduler](/docs/deploy/job-scheduler). This feature is only available with the [dbt Cloud's Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl).

For more information on how to run exports, refer to the [Exports](/docs/use-dbt-semantic-layer/exports) documentation.

## Related docs

- [Exports](/docs/use-dbt-semantic-layer/exports)
- [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl)
