---
title: "Performance optimizations"
sidebar_label: "Performance optimizations"
description: "Improve Redshift query performance in dbt with distkey and sortkey table settings and the query_group session parameter."
---

### Using sortkey and distkey

Tables in Amazon Redshift have two powerful optimizations to improve query performance: distkeys and sortkeys. Supplying these values as model-level configurations apply the corresponding settings in the generated `CREATE TABLE` <Term id="ddl" />. Note that these settings will have no effect on models set to `view` or `ephemeral` models.

- `dist` can have a setting of `all`, `even`, `auto`, or the name of a key.
- `sort` accepts a list of sort keys, for example: `['reporting_day', 'category']`. dbt will build the sort key in the same order the fields are supplied.
- `sort_type` can have a setting of `interleaved` or `compound`. if no setting is specified, sort_type defaults to `compound`.

When working with sort keys, it's highly recommended you follow [Redshift's best practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/query-best-practices-redshift/best-practices-tables.html#sort-keys) on sort key effectiveness and cardinality. 

Sort and dist keys should be added to the `{{ config(...) }}` block in model `.sql` files, eg:

<File name='my_model.sql'>

```sql
-- Example with one sort key
{{ config(materialized='table', sort='reporting_day', dist='unique_id') }}

select ...


-- Example with multiple sort keys
{{ config(materialized='table', sort=['category', 'region', 'reporting_day'], dist='received_at') }}

select ...


-- Example with interleaved sort keys
{{ config(materialized='table',
          sort_type='interleaved'
          sort=['category', 'region', 'reporting_day'],
          dist='unique_id')
}}

select ...
```

</File>

For more information on distkeys and sortkeys, view Amazon's docs:

- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing a Data Distribution Style](https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html)
- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing Sort Keys](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)

<VersionBlock firstVersion="1.12">

### Session configuration

The Redshift adapter supports the `query_group` session parameter, enabling dbt runs to tag queries for Redshift Workload Manager (WLM) and query logging (for example, `STL_QUERY` and `SVL_QLOG`). You can set `query_group` at the profile level (default for the connection) and override it at the model level.

- **Profile-level configuration**

  Configure `query_group` in your `profiles.yml` to apply a default value to all queries executed using that profile. dbt sets the `query_group` when opening a connection.

  <File name="profiles.yml">

  ```yml
  outputs:
    dev:
      type: redshift
      host: CLUSTER_ENDPOINT
      user: REDSHIFT_USER
      password: REDSHIFT_PASSWORD
      dbname: REDSHIFT_DBNAME
      port: 5439
      schema: analytics
      threads: 4
      query_group: QUERY_GROUP_NAME
  ```

  </File>

  ```sql
  -- models/a_default_group.sql
  -- Runs under query_group = 'QUERY_GROUP_NAME' (from the profile)
  select 1 as id
  ```

- **Model-level configuration**

  Set `query_group` in a model's `config()` block to temporarily override the default value for that model’s execution. dbt applies the model-level value while the model runs and then restores the default value after model materialization.

  ```sql
  -- models/b_override_group.sql
  -- dbt temporarily sets query_group = 'dbt_finance' for this model, then restores the default value
  {{ config(query_group='dbt_finance') }}

  select 1 as id
  ```

</VersionBlock>
