---
title: "Materialized views"
sidebar_label: "Materialized views"
description: "Configure materialized views in the Postgres adapter, including on_configuration_change and indexes parameters."
---

The Postgres adapter supports [materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html)
with the following configuration parameters:

| Parameter                                                                        | Type               | Required | Default | Change Monitoring Support |
|----------------------------------------------------------------------------------|--------------------|----------|---------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`         | no       | `apply` | n/a                       |
| [`indexes`](/reference/resource-configs/postgres-configs/performance-optimizations#indexes)                                                            | `[{<dictionary>}]` | no       | `none`  | alter                     |

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
    [+](/reference/resource-configs/plus-prefix)[indexes](/reference/resource-configs/postgres-configs/performance-optimizations#indexes):
      - columns: [<column-name>]
        unique: true | false
        type: hash | btree
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
      [indexes](/reference/resource-configs/postgres-configs/performance-optimizations#indexes):
        - columns: [<column-name>]
          unique: true | false
          type: hash | btree
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="materialized_view",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [indexes](/reference/resource-configs/postgres-configs/performance-optimizations#indexes)=[
        {
            "columns": ["<column-name>"],
            "unique": true | false,
            "type": "hash" | "btree",
        }
    ]
) }}
```

</File>

</TabItem>

</Tabs>

The [`indexes`](/reference/resource-configs/postgres-configs/performance-optimizations#indexes) parameter corresponds to that of a table, as explained above.
It's worth noting that, unlike tables, dbt monitors this parameter for changes and applies the changes without dropping the materialized view.
This happens via a `DROP/CREATE` of the indexes, which can be thought of as an `ALTER` of the materialized view.

Learn more about these parameters in Postgres's [docs](https://www.postgresql.org/docs/current/sql-creatematerializedview.html).
