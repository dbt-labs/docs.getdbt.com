Previously, the Redshift adapter used PostgreSQL-compatible catalog tables (for example, `pg_*`, `information_schema`) for metadata operations such as listing relations, schemas, and columns. These tables only surface objects within the currently connected database, which prevents cross-database operations needed for [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html).

Starting `dbt-redshift` v1.11.0rc1, you can set `datasharing: true` in your `profiles.yml` to enable cross-database and cross-cluster access. When enabled, `dbt-redshift` switches metadata queries to Redshift's native `SHOW` system commands. You can then materialize models into a database or cluster other than the one specified in your profile using `{{ config(database='other_db') }}`.

Example configuration:

<File name='profiles.yml'>

```yml
company-name:
  target: dev
  outputs:
    dev:
      type: redshift
      host: hostname.region.redshift.amazonaws.com
      ...
      datasharing: true  # default: false
```

</File>

Once enabled, you can materialize a model into a different database by setting `database` in the model config. For example:

```sql
{{ config(database='other_db') }}

select * from {{ ref('my_model') }}
```

The following macros switch to `SHOW` commands when `datasharing: true`:

| Macro | Without `datasharing` | With `datasharing` |
|---|---|---|
| `list_relations_without_caching` | `information_schema.tables` | `SHOW TABLES FROM SCHEMA` |
| `list_schemas`, `check_schema_exists` | `pg_namespace` | `SHOW SCHEMAS FROM DATABASE` |
| `get_columns_in_relation` | `information_schema.columns` | `SHOW COLUMNS FROM TABLE` |
| Catalog queries | `pg_class`, `pg_tables`, `pg_views` | `SHOW TABLES FROM SCHEMA` + `SVV_REDSHIFT_COLUMNS` |
| `get_relation_last_modified` | `information_schema.tables` | `SHOW TABLES FROM SCHEMA` |
| Grants | `pg_user`, `has_table_privilege()` | `SHOW GRANTS ON TABLE` |

`ra3_node: true` also enables this behavior and is supported for backward compatibility. For new projects, use `datasharing: true` instead.

:::note
If you see `pg_*` queries running with `datasharing` enabled, this is not necessarily a bug. Only the macros listed above are migrated &mdash; some macros remain on `pg_*` by design (for example, `get_relations` for dependency tracking and `list_function_relations_without_caching` for function discovery). Custom macro overrides in your project are not affected. To confirm whether a `pg_*` query is expected, check which macro is being overridden and which metadata operation is running.
:::

The following limitations apply when using `datasharing`:

- Creating views (including materialized views) in another database is not supported.
- Cross-database grants on objects are not supported.
- Source freshness checks can have a lag of up to 5 minutes.
- Metadata queries are limited to 10,000 rows. If a database has more than 10,000 schemas, or a schema has more than 10,000 tables, dbt runs can result in unexpected scenarios.
- Cross-database writes require the `SNAPSHOT` transaction isolation level.
- For views that reference tables in another database, define them as [late-binding views](/reference/resource-configs/redshift-configs/late-binding-views).
