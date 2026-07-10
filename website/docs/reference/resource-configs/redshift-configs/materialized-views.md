---
title: "Materialized views"
sidebar_label: "Materialized views"
description: "Configure Redshift materialized views in dbt, including auto-refresh, backup, dist, and sort key options."
---

The Redshift adapter supports [materialized views](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html)
with the following configuration parameters:

| Parameter                                                                        | Type         | Required | Default                                        | Change Monitoring Support |
|----------------------------------------------------------------------------------|--------------|----------|------------------------------------------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`   | no       | `apply`                                        | n/a                       |
| [`dist`](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey)                                             | `<string>`   | no       | `even`                                         | drop/create               |
| [`sort`](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey)                                             | `[<string>]` | no       | `none`                                         | drop/create               |
| [`sort_type`](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey)                                        | `<string>`   | no       | `auto` if no `sort` <br />`compound` if `sort` | drop/create               |
| [`auto_refresh`](/reference/resource-configs/redshift-configs/materialized-views#auto-refresh)                                                  | `<boolean>`  | no       | `false`                                        | alter                     |
| [`backup`](/reference/resource-configs/redshift-configs/materialized-views#backup)                                                              | `<string>`   | no       | `true`                                         | n/a                       |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
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
    [+](/reference/resource-configs/plus-prefix)[dist](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey): all | auto | even | <field-name>
    [+](/reference/resource-configs/plus-prefix)[sort](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey): <field-name> | [<field-name>]
    [+](/reference/resource-configs/plus-prefix)[sort_type](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey): auto | compound | interleaved
    [+](/reference/resource-configs/plus-prefix)[auto_refresh](/reference/resource-configs/redshift-configs/materialized-views#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[backup](/reference/resource-configs/redshift-configs/materialized-views#backup): true | false
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
      [dist](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey): all | auto | even | <field-name>
      [sort](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey): <field-name> | [<field-name>]
      [sort_type](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey): auto | compound | interleaved
      [auto_refresh](/reference/resource-configs/redshift-configs/materialized-views#auto-refresh): true | false
      [backup](/reference/resource-configs/redshift-configs/materialized-views#backup): true | false
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="materialized_view",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [dist](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey)="all" | "auto" | "even" | "<field-name>",
    [sort](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey)=["<field-name>"],
    [sort_type](/reference/resource-configs/redshift-configs/performance-optimizations#using-sortkey-and-distkey)="auto" | "compound" | "interleaved",
    [auto_refresh](/reference/resource-configs/redshift-configs/materialized-views#auto-refresh)=true | false,
    [backup](/reference/resource-configs/redshift-configs/materialized-views#backup)=true | false,
) }}
```

</File>

</TabItem>

</Tabs>

Many of these parameters correspond to their table counterparts and have been linked above.
The parameters unique to materialized views are the [auto-refresh](/reference/resource-configs/redshift-configs/materialized-views#auto-refresh) and [backup](/reference/resource-configs/redshift-configs/materialized-views#backup) functionality, which are covered below.

Learn more about these parameters in Redshift's [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html).

#### Auto-refresh

| Parameter      | Type        | Required | Default | Change Monitoring Support |
|----------------|-------------|----------|---------|---------------------------|
| `auto_refresh` | `<boolean>` | no       | `false` | alter                     |

Redshift supports [automatic refresh](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html#materialized-view-auto-refresh) configuration for materialized views.
By default, a materialized view does not automatically refresh.
dbt monitors this parameter for changes and applies them using an `ALTER` statement.

Learn more information about the [parameters](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters) in the Redshift docs.

#### Backup

| Parameter | Type        | Required | Default | Change Monitoring Support |
|-----------|-------------|----------|---------|---------------------------|
| `backup`  | `<boolean>` | no       | `true`  | n/a                       |

Redshift supports [backup](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html) configuration of clusters at the object level.
This parameter identifies if the materialized view should be backed up as part of the cluster snapshot.
By default, a materialized view will be backed up during a cluster snapshot.
dbt cannot monitor this parameter as it is not queryable within Redshift.
If the value changes, the materialized view will need to go through a `--full-refresh` to set it.

Learn more about these parameters in Redshift's [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters).

### Limitations

As with most data platforms, there are limitations associated with materialized views. Some worth noting include:

- Materialized views cannot reference views, temporary tables, user-defined functions, or late-binding tables.
- Auto-refresh cannot be used if the materialized view references mutable functions, external schemas, or another materialized view.

Find more information about materialized view limitations in Redshift's [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-limitations).
