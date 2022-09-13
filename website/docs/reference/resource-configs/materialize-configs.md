---
title: "Materialize configurations"
id: "materialize-configs"
---

## Performance optimizations

### Incremental models
Materialize, at its core, is a real-time database that delivers incremental view updates without ever compromising on latency or correctness.
Materialized views are incremental models, defined once. 

### Indexes

Materialized views (`materializedview`), views (`view`) and sources (`source`) may have a list of `indexes` defined. Each [Materialize index](https://materialize.com/docs/sql/create-index/) can have the following components:

- `columns` (list, required): one or more columns on which the index is defined
- `type` (string, optional): a supported index type. The only supported type is [`arrangement`](https://materialize.com/docs/overview/arrangements/).

<File name='my_view.sql'>

```sql
{{ config(materialized='view',
          indexes=[{'columns': ['symbol']}]) }}

select ...
```

</File>

If one or more indexes are configured on a resource, dbt will run `create index` <Term id="ddl" /> statement(s) as part of that resource's <Term id="materialization" />, within the same transaction as its main `create` statement. For the index's name, dbt uses a hash of its properties and the current timestamp, in order to guarantee uniqueness and avoid namespace conflict with other indexes.

```sql
create index if not exists
"3695050e025a7173586579da5b27d275"
on "my_target_database"."my_target_schema"."view_model"
(symbol);
```

You can also configure indexes for a number of resources at once:

<File name='dbt_project.yml'>

```yaml
models:
  project_name:
    subdirectory:
      +indexes:
        - columns: ['symbol']
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