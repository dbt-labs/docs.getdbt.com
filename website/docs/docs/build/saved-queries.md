---
title: Saved queries
id: saved-queries
description: "Saved queries are a way to save commonly used queries in MetricFlow. They can be used to save time and avoid writing the same query over and over again."
sidebar_label: "Saved queries"
tags: [Metrics, Semantic Layer]
---

Saved queries are a way to save commonly used queries in MetricFlow. You can group metrics, dimensions, and filters that are logically related into a saved query. 

### Exports and saved queries comparison

Saved queries are distinct from [exports](/docs/use-dbt-semantic-layer/exports), which schedule and execute saved queries using [dbt Cloud's job scheduler](/docs/deploy/job-scheduler). The following table compares the features and usage of exports and saved queries:

| Feature |  Exports | <div style={{width:'250px, text-align: center'}}>Saved queries</div>  |
| ----------- | ----------- | ---------------- |
| **Availability**    | Available on dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) plans on dbt versions 1.7 or newer.| Available in both dbt Core and dbt Cloud.     |
| **Purpose**         | To materialize saved queries in your data platform and expose metrics and dimensions as a view or table. | To define and manage common Semantic Layer queries in YAML, which includes metrics and dimensions.   |
| **Usage**           | Automatically runs saved queries and materializes them within your data platform. Exports count towards [queried metrics](/docs/cloud/billing#what-counts-as-a-queried-metric) usage. <br /><br />**Example**: Creating a weekly aggregated table for active user metrics, automatically updated and stored in the data platform.  | Used for organizing and reusing common MetricFlow queries within dbt projects.<br /><br /><br />**Example**: Group related metrics together for better organization, and include commonly used dimensions and filters. | For materializing query results in the data platform. |
| **Integration**     | Must have the dbt Semantic Layer configured in your dbt project.<br /><br />Tightly integrated with the [MetricFlow Server](/docs/use-dbt-semantic-layer/sl-architecture#components) and dbt Cloud's job scheduler. | Integrated into the dbt <Term id="dag" /> and managed alongside other dbt nodes. |
| **Configuration**   | Defined within the `saved_queries` configuration. Set up within the dbt Cloud environment and job scheduler settings. | Defined in YAML format within dbt project files.     |

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

## Parameters

To define a saved query, refer to the following parameters:

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

## Parameters

To define a saved query, refer to the following parameters:

| Parameter | Type    | Required | Description    |
|-------|---------|----------|----------------|
| `name`       | String    | Required     | Name of the saved query object.          |
| `description`     | String      | Required     | A description of the saved query.     |
| `label`     | String      | Required     | The display name for your saved query. This value will be shown in downstream tools.    |
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

All metrics in a saved query need to use the same dimensions in the `group_by` or `where` clauses.

## Related docs

- [Exports](/docs/use-dbt-semantic-layer/exports)
- [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl)
