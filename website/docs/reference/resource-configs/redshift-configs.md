---
title: "Redshift configurations"
id: "redshift-configs"
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
- think about whether some of these should be outside of models
--->

## Performance Optimizations

### Using sortkey and distkey

Tables in Amazon Redshift have two powerful optimizations to improve query performance: distkeys and sortkeys. Supplying these values as model-level configurations apply the corresponding settings in the generated `CREATE TABLE` <Term id="ddl" />. Note that these settings will have no effect for models set to `view` or `ephemeral` models.

- `dist` can have a setting of `all`, `even`, `auto`, or the name of a key.
- `sort` accepts a list of sort keys, for example: `['timestamp', 'userid']`. dbt will build the sort key in the same order the fields are supplied.
- `sort_type` can have a setting of `interleaved` or `compound`. if no setting is specified, sort_type defaults to `compound`.

Sort and dist keys should be added to the `{{ config(...) }}` block in model `.sql` files, eg:

<File name='my_model.sql'>

```sql
-- Example with one sort key
{{ config(materialized='table', sort='id', dist='received_at') }}

select ...


-- Example with multiple sort keys
{{ config(materialized='table', sort=['id', 'category'], dist='received_at') }}

select ...


-- Example with interleaved sort keys
{{ config(materialized='table',
          sort_type='interleaved'
          sort=['id', 'category'],
          dist='received_at')
}}

select ...
```

</File>

For more information on distkeys and sortkeys, view Amazon's docs:

- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing a Data Distribution Style](https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html)
- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing Sort Keys](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)

## Late Binding Views

Redshift supports <Term id="view">views</Term> unbound from their dependencies, or [late binding views](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html#late-binding-views). This DDL option "unbinds" a view from the data it selects from. In practice, this means that if upstream views or tables are dropped with a cascade qualifier, the late-binding view does not get dropped as well.

Using late-binding views in a production deployment of dbt can vastly improve the availability of data in the warehouse, especially for models that are materialized as late-binding views and are queried by end-users, since they won’t be dropped when upstream models are updated. Additionally, late binding views can be used with [external tables](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_TABLE.html) via Redshift Spectrum.

To materialize a dbt model as a late binding view, use the `bind: false` configuration option:

<File name='my_view.sql'>

```sql
{{ config(materialized='view', bind=False) }}

select *
from source.data
```

</File>

To make all views late-binding, configure your `dbt_project.yml` file like this:

<File name='dbt_project.yml'>

```yaml
models:
  +bind: false # Materialize all views as late-binding
  project_name:
    ....
```

</File>
