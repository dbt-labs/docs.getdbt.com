---
title: "Materialize configurations"
id: "materialize-configs"
---

## Performance optimizations

### Clusters

<Changelog>

- **v1.2.0:** Enable the configuration of [clusters](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

</Changelog>

The [cluster](https://materialize.com/docs/overview/key-concepts/#clusters) that dbt uses to maintain materialized views or indexes can be configured in your [profile](/reference/profiles.yml) for Materialize connections. To override the cluster that is used for specific models (or groups of models), use the `cluster` model configuration.

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


**Recommendation** Create a cluster to use for anything built by dbt. This will leave Materialize's default cluster free for responding quickly to `SHOW MATERIALIZED VIEWS` and other diagnostic queries.

### Incremental models: Materialized Views

Materialize, at its core, is a real-time database that delivers incremental view updates without ever compromising on latency or correctness. Use [materialized views](https://materialize.com/docs/overview/key-concepts/#materialized-views) to compute and incrementally update the results of your query.

### Indexes

<Changelog>

- **v1.2.0:** Enable additional configuration for [indexes](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

</Changelog>

Indexes assemble and maintain a query’s results in memory within a cluster, which provides future queries the data they need in a format they can immediately use.

Materialized views (`materializedview`), views (`view`) and sources (`source`) may have a list of `indexes` defined. Each [Materialize index](https://materialize.com/docs/sql/create-index/) can have the following components:

- `columns` (list, required): one or more columns on which the index is defined. To create an index that uses _all_ columns, use the `default` component instead.
- `name` (string, optional): the name for the index. If unspecified, Materialize will use the materialization name and column names provided.
- `cluster` (string, optional): the cluster to use to create the index. If unspecified, indexes will be created in the cluster used to create the materialization.
- `default` (bool, optional): Default: `False`. If set to `True`, creates a default index that uses all columns.

<File name='my_view_index.sql'>

```sql
{{ config(materialized='view',
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

<Changelog>

- **v1.1.1:** Provide support for storing the results of a test query in a materialized view, using the `store_failures` config.

</Changelog>

If you set the optional `--store-failures` flag or [`store_failures` config](resource-configs/store_failures), dbt will create a materialized view using the test query. This view is a continuously updating representation of failures.

<File name='dbt_project.yml'>

```yaml
tests:
  project_name:
    +store_failures: true
    +schema: test
```

</File>