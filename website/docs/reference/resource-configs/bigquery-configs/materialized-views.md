---
title: "Materialized views"
sidebar_label: "Materialized views"
description: "Configuration parameters for BigQuery materialized views, including auto-refresh options and limitations."
---

The BigQuery adapter supports [materialized views](https://cloud.google.com/bigquery/docs/materialized-views-intro)
with the following configuration parameters:

| Parameter                                                                        | Type                   | Required | Default | Change Monitoring Support |
|----------------------------------------------------------------------------------|------------------------|----------|---------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`             | no       | `apply` | n/a                       |
| [`cluster_by`](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#clustering-clause)                                               | `[<string>]`           | no       | `none`  | drop/create               |
| [`partition_by`](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#partition-clause)                                              | `{<dictionary>}`       | no       | `none`  | drop/create               |
| [`enable_refresh`](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh)                                                | `<boolean>`            | no       | `true`  | alter                     |
| [`refresh_interval_minutes`](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh)                                      | `<float>`              | no       | `30`    | alter                     |
| [`max_staleness`](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh) (in Preview)                                    | `<interval>`           | no       | `none`  | alter                     |
| [`description`](/reference/resource-properties/description)                      | `<string>`             | no       | `none`  | alter                     |
| [`labels`](/reference/resource-configs/bigquery-configs/labels-and-tags#specifying-labels)                                                   | `{<string>: <string>}` | no       | `none`  | alter                     |
| [`resource_tags`](/reference/resource-configs/bigquery-configs/labels-and-tags#resource-tags)                                                | `{<string>: <string>}` | no       | `none`  | alter                     |
| [`hours_to_expiration`](/reference/resource-configs/bigquery-configs/controlling-table-expiration)                           | `<integer>`            | no       | `none`  | alter                     |
| [`kms_key_name`](/reference/resource-configs/bigquery-configs/managing-kms-encryption#using-kms-encryption)                                          | `<string>`             | no       | `none`  | alter                     |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>


<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): materialized_view
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[cluster_by](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#clustering-clause): <field-name> | [<field-name>]
    [+](/reference/resource-configs/plus-prefix)[partition_by](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#partition-clause):
      - field: <field-name>
      - data_type: timestamp | date | datetime | int64
        # only if `data_type` is not 'int64'
      - granularity: hour | day | month | year
        # only if `data_type` is 'int64'
      - range:
        - start: <integer>
        - end: <integer>
        - interval: <integer>
    [+](/reference/resource-configs/plus-prefix)[enable_refresh](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[refresh_interval_minutes](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh): <float>
    [+](/reference/resource-configs/plus-prefix)[max_staleness](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh): <interval>
    [+](/reference/resource-configs/plus-prefix)[description](/reference/resource-properties/description): <string>
    [+](/reference/resource-configs/plus-prefix)[labels](/reference/resource-configs/bigquery-configs/labels-and-tags#specifying-labels): {<label-name>: <label-value>}
    [+](/reference/resource-configs/plus-prefix)[resource_tags](/reference/resource-configs/bigquery-configs/labels-and-tags#resource-tags): {<tag-key>: <tag-value>}
    [+](/reference/resource-configs/plus-prefix)[hours_to_expiration](#acontrolling-table-expiration): <integer>
    [+](/reference/resource-configs/plus-prefix)[kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): materialized_view
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [cluster_by](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#clustering-clause): <field-name> | [<field-name>]
      [partition_by](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#partition-clause):
        - field: <field-name>
        - data_type: timestamp | date | datetime | int64
          # only if `data_type` is not 'int64'
        - granularity: hour | day | month | year
          # only if `data_type` is 'int64'
        - range:
          - start: <integer>
          - end: <integer>
          - interval: <integer>
      [enable_refresh](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh): true | false
      [refresh_interval_minutes](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh): <float>
      [max_staleness](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh): <interval>
      [description](/reference/resource-properties/description): <string>
      [labels](/reference/resource-configs/bigquery-configs/labels-and-tags#specifying-labels): {<label-name>: <label-value>}
      [resource_tags](/reference/resource-configs/bigquery-configs/labels-and-tags#resource-tags): {<tag-key>: <tag-value>}
      [hours_to_expiration](#acontrolling-table-expiration): <integer>
      [kms_key_name](##using-kms-encryption): <path-to-key>
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)='materialized_view',
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [cluster_by](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#clustering-clause)="<field-name>" | ["<field-name>"],
    [partition_by](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#partition-clause)={
        "field": "<field-name>",
        "data_type": "timestamp" | "date" | "datetime" | "int64",

        # only if `data_type` is not 'int64'
        "granularity": "hour" | "day" | "month" | "year,

        # only if `data_type` is 'int64'
        "range": {
            "start": <integer>,
            "end": <integer>,
            "interval": <integer>,
        }
    },

    # auto-refresh options
    [enable_refresh](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh)= true | false,
    [refresh_interval_minutes](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh)=<float>,
    [max_staleness](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh)="<interval>",

    # additional options
    [description](/reference/resource-properties/description)="<description>",
    [labels](/reference/resource-configs/bigquery-configs/labels-and-tags#specifying-labels)={
        "<label-name>": "<label-value>",
    },
    [resource_tags](/reference/resource-configs/bigquery-configs/labels-and-tags#resource-tags)={
        "<tag-key>": "<tag-value>",
    },
    [hours_to_expiration](#acontrolling-table-expiration)=<integer>,
    [kms_key_name](##using-kms-encryption)="<path_to_key>",
) }}
```

</File>

</TabItem>

</Tabs>

Many of these parameters correspond to their table counterparts and have been linked above.
The set of parameters unique to materialized views covers [auto-refresh functionality](/reference/resource-configs/bigquery-configs/materialized-views#auto-refresh).

Learn more about these parameters in BigQuery's docs:
- [CREATE MATERIALIZED VIEW statement](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_materialized_view_statement)
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)

### Auto-refresh

| Parameter                    | Type         | Required | Default | Change Monitoring Support |
|------------------------------|--------------|----------|---------|---------------------------|
| `enable_refresh`             | `<boolean>`  | no       | `true`  | alter                     |
| `refresh_interval_minutes`   | `<float>`    | no       | `30`    | alter                     |
| `max_staleness` (in Preview) | `<interval>` | no       | `none`  | alter                     |

BigQuery supports [automatic refresh](https://cloud.google.com/bigquery/docs/materialized-views-manage#automatic_refresh) configuration for materialized views.
By default, a materialized view will automatically refresh within 5 minutes of changes in the base table, but not more frequently than once every 30 minutes.
BigQuery only officially supports the configuration of the frequency (the "once every 30 minutes" frequency);
however, there is a feature in preview that allows for the configuration of the staleness (the "5 minutes" refresh).
dbt will monitor these parameters for changes and apply them using an `ALTER` statement.

Learn more about these parameters in BigQuery's docs:
- [materialized_view_option_list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#materialized_view_option_list)
- [max_staleness](https://cloud.google.com/bigquery/docs/materialized-views-create#max_staleness)

### Limitations

As with most data platforms, there are limitations associated with materialized views. Some worth noting include:

- Materialized view SQL has a [limited feature set](https://cloud.google.com/bigquery/docs/materialized-views-create#supported-mvs).
- Materialized view SQL cannot be updated; the materialized view must go through a `--full-refresh` (DROP/CREATE).
- The `partition_by` clause on a materialized view must match that of the underlying base table.
- While materialized views can have descriptions, materialized view *columns* cannot.
- Recreating/dropping the base table requires recreating/dropping the materialized view.

Find more information about materialized view limitations in Google's BigQuery [docs](https://cloud.google.com/bigquery/docs/materialized-views-intro#limitations).
