---
title: "Materialize configurations"
description: "Materialize Configurations- Read this in-depth guide to learn about configurations in dbt."
id: "materialize-configs"
---

## Performance optimizations

### Clusters


Enable the configuration of [clusters](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).


The default [cluster](https://materialize.com/docs/overview/key-concepts/#clusters) that is used to maintain materialized views or indexes can be configured in your [profile](/docs/core/connect-data-platform/profiles.yml) using the `cluster` connection parameter. To override the cluster that is used for specific models (or groups of models), use the `cluster` configuration parameter.

<File name='my_view_cluster.sql'>

```sql
{{ config(materialized='materializedview', cluster='not_default') }}

select ...
```

</File>

<File name='dbt_project.yml'>

```yaml
models:
  project_name:
    +materialized: materializedview
    +cluster: not_default
```

</File>



### Incremental models: Materialized Views

Materialize, at its core, is a real-time database that delivers incremental view updates without ever compromising on latency or correctness. Use [materialized views](https://materialize.com/docs/overview/key-concepts/#materialized-views) to compute and incrementally update the results of your query.

### Indexes

Enable additional configuration for [indexes](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

Like in any standard relational database, you can use [indexes](https://materialize.com/docs/overview/key-concepts/#indexes) to optimize query performance in Materialize. Improvements can be significant, reducing response times down to single-digit milliseconds.

Materialized views (`materializedview`), views (`view`) and sources (`source`) may have a list of `indexes` defined. Each [Materialize index](https://materialize.com/docs/sql/create-index/) can have the following components:

- `columns` (list, required): one or more columns on which the index is defined. To create an index that uses _all_ columns, use the `default` component instead.
- `name` (string, optional): the name for the index. If unspecified, Materialize will use the materialization name and column names provided.
- `cluster` (string, optional): the cluster to use to create the index. If unspecified, indexes will be created in the cluster used to create the materialization.
- `default` (bool, optional): Default: `False`. If set to `True`, creates a default index that uses all columns.

<File name='my_view_index.sql'>

```sql
{{ config(materialized='view',
          indexes=[{'columns': ['col_a'], 'cluster': 'cluster_a'}]) }}
          indexes=[{'columns': ['symbol']}]) }}

select ...
```

</File>

<File name='my_view_default_index.sql'>

```sql
{{ config(materialized='view',
    indexes=[{'default': True}]) }}

select ...
```

</File>

### Tests

If you set the optional `--store-failures` flag or [`store_failures` config](/reference/resource-configs/store_failures), dbt will create a materialized view for each configured test that can keep track of failures over time. By default, test views are created in a schema suffixed with `dbt_test__audit`. To specify a custom suffix, use the `schema` config.
<File name='dbt_project.yml'>

```yaml
tests:
  project_name:
    +store_failures: true
    +schema: test
```

</File>
