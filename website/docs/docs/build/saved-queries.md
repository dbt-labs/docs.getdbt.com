---
title: Saved queries
id: saved-queries
description: "Saved queries are a way to save commonly used queries in MetricFlow. They can be used to save time and avoid writing the same query over and over again."
sidebar_label: "Saved queries"
tags: [Metrics, Semantic Layer]
---

Saved queries are a way to save commonly used queries in MetricFlow. You can group metrics, dimensions, and filters that are logically related into a saved query. Saved queries are nodes and visible in the dbt <Term id="dag" />.

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
| `config`     | String      |  Optional     |  Use the [`config`](/reference/resource-properties/config) property to specify configurations for your saved query. Supports `cache`, [`enabled`](/reference/resource-configs/enabled), `export_as`, [`group`](/reference/resource-configs/group), [`meta`](/reference/resource-configs/meta), and [`schema`](/reference/resource-configs/schema)  configurations.   |
| `config::cache::enabled`     | Object      | Optional     |  An object with a sub-key used to specify if a saved query should populate the [cache](/docs/use-dbt-semantic-layer/sl-cache). Accepts sub-key `true` or `false`. Defaults to `false` |
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

If you use multiple metrics in a saved query, then you will only be able to reference the common dimensions these metrics share in the `group_by` or `where` clauses. Use the entity name prefix with the Dimension object, like `Dimension('user__ds')`.

## Configure saved query

Use saved queries to define and manage common Semantic Layer queries in YAML, including metrics and dimensions. Saved queries enable you to organize and reuse common MetricFlow queries within dbt projects. For example, you can group related metrics together for better organization, and include commonly used dimensions and filters.

In your saved query config, you can also leverage [caching](/docs/use-dbt-semantic-layer/sl-cache) with the dbt Cloud job scheduler to cache common queries, speed up performance, and reduce compute costs.

<!-- For versions 1.8 and higher -->

<VersionBlock firstVersion="1.8">

In the following example, you can set the saved query in the `semantic_model.yml` file:

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

Note, that you can set `export_as` to both the saved query and the exports [config](/reference/resource-properties/config), with the exports config value taking precedence. If a key isn't set in the exports config, it will inherit the saved query config value.

#### Where clause

Use the following syntax to reference entities, dimensions, time dimensions, or metrics in filters and refer to [Metrics as dimensions](/docs/build/ref-metrics-in-filters) for details on how to use metrics as dimensions with metric filters:

```yaml
filter: | 
  {{ Entity('entity_name') }}

filter: |  
  {{ Dimension('primary_entity__dimension_name') }}

filter: |  
  {{ TimeDimension('time_dimension', 'granularity') }}

filter: |  
  {{ Metric('metric_name', group_by=['entity_name']) }}
```

</VersionBlock>

<!-- For versions 1.7 and lower-->
<VersionBlock lastVersion="1.7">

In the following example, you can set the saved query in the `semantic_model.yml` file:

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

#### Project-level saved queries

To enable saved queries at the project level, you can set the `saved-queries` configuration in the [`dbt_project.yml` file](/reference/dbt_project.yml). This saves you time in configuring saved queries in each file:

<File name='dbt_project.yml'>

```yaml
saved-queries:
  my_saved_query:
    +cache:
      enabled: true
```
</File>

For more information on `dbt_project.yml` and config naming conventions, see the [dbt_project.yml reference page](/reference/dbt_project.yml#naming-convention).

To build `saved_queries`, use the [`--resource-type` flag](/reference/global-configs/resource-type) and run the command `dbt build --resource-type saved_query`.

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

## FAQs

<DetailsToggle alt_header="Can I have multiple exports in a single saved query?">

Yes, this is possible. However, the difference would be the name, schema, and materialization strategy of the export.
</DetailsToggle>

<DetailsToggle alt_header="How can I select saved_queries by their resource type?">

To include all saved queries in the dbt build run, use the [`--resource-type` flag](/reference/global-configs/resource-type) and run the command `dbt build --resource-type saved_query`.

</DetailsToggle>

## Related docs
- [Validate semantic nodes in a CI job](/docs/deploy/ci-jobs#semantic-validations-in-ci)
- Configure [caching](/docs/use-dbt-semantic-layer/sl-cache)
