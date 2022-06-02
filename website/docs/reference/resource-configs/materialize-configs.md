---
title: "Materialize configurations"
id: "materialize-configs"
---

## Performance optimizations

### Indexes

:::info Advanced feature
  Manually creating indexes in Materialize is an advanced feature that most users **do not** need. See the [Materialize documentation](https://materialize.com/docs/sql/create-index/) for more details.
:::

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
