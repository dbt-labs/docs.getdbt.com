---
title: "Databricks adapter behavior changes"
id: "databricks-changes"
sidebar: "Databricks"
---

The following are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-databricks`:

| Flag                          | `dbt-databricks`: Intro | `dbt-databricks`: Maturity | Status |
| ----------------------------- | ----------------------- | -------------------------- | ------ |
| [`use_info_schema_for_columns`](#use-information-schema-for-columns) | 1.9.0                   | N/A                        | **Removed in 1.11.0** |
| [`use_user_folder_for_python`](#use-users-folder-for-python-model-notebooks)  | 1.9.0                   | 1.11.0                     | Default changed to `true` |
| [`use_materialization_v2`](#use-restructured-materializations)      | 1.10.0                  | TBD                        | Active |
| [`use_managed_iceberg`](#use-managed-iceberg)  | 1.11.0  |  1.12.0                                                     | Active |
| [`use_replace_on_for_insert_overwrite`](#use-replace-on-for-insert_overwrite-strategy)   | 1.11.0   | 1.12.0                    | Active, defaults to `true` |
| [`use_describe_as_json_for_relation_metadata`](#use-describe-as-json-for-relation-metadata) | 1.12.0 | TBD | Active, defaults to `false` |

## Use information schema for columns

:::caution Removed in v1.11.0

The `use_info_schema_for_columns` flag has been **removed** as of dbt-databricks v1.11.0. The adapter now uses [`DESCRIBE EXTENDED ... AS JSON`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-aux-describe-table) (available in DBR 16.2+) to efficiently retrieve complex type information, eliminating the need for this flag.

If you're still using this flag in your project configuration, you can safely remove it. The new approach provides better performance and doesn't require the `REPAIR TABLE` operations that were needed with `information_schema`.

:::

### Legacy documentation
_This applies to dbt-databricks versions v1.11 and older_
The `use_info_schema_for_columns` flag was `false` by default in versions 1.9 and 1.10.

Setting this flag to `true` would use `information_schema` rather than `describe extended` to get column metadata for Unity Catalog tables. This setting helped avoid issues where `describe extended` truncates information when the type is a complex struct.

:::tip For complex types

If your complex type comes from processing JSON using `from_json`, you have an alternative: use [`parse_json` to create the column as the `variant` type](https://docs.databricks.com/aws/en/sql/language-manual/functions/parse_json).
The `variant` type might be a reasonable alternative in terms of performance, while avoiding type truncation issues.

:::

## Use user's folder for Python model notebooks

:::info Default changed in v1.11.0

As of dbt-databricks v1.11.0, the `use_user_folder_for_python` flag defaults to **`true`**.

:::

The `use_user_folder_for_python` flag controls where uploaded Python model notebooks are stored in Databricks:

- **`true` (default in v1.11+)**: Notebooks are written to `/Users/{{current user}}/{{catalog}}/{{schema}}/`.
- **`false` (default in v1.9-v1.10)**: Notebooks are written to `/Shared/dbt_python_models/{{schema}}/`.

Databricks deprecated writing to the `Shared` folder as it doesn't align with governance best practices. Using user-specific folders provides better isolation, access control, and aligns with Unity Catalog security models.

To preserve the legacy behavior for backward compatibility, you can explicitly set this flag to `false` in your `dbt_project.yml`:

```yaml
flags:
  use_user_folder_for_python: false
```

## Use restructured materializations

The `use_materialization_v2` flag defaults to `false`. Set it to `true` under `flags:` in `dbt_project.yml` to use the restructured materializations for table and incremental models.

### Set `use_materialization_v2` per model

_Available in `dbt-databricks` 1.13.1 or higher._

Set `use_materialization_v2` on a `table` or `incremental` model to override the project flag (`true` for the restructured path, `false` for the original path). Omit the config or set it to `null` to inherit the project flag. Views and seeds ignore it.

This lets you trade off atomicity against create-time features per model: the original path replaces Delta tables atomically with a single `CREATE OR REPLACE TABLE ... AS SELECT`, while the restructured path creates the table before inserting rows &mdash; allowing column masks before data loads (see [Configuring columns](/reference/resource-configs/databricks-configs#configuring-columns)), at the cost of briefly exposing an empty table during direct rebuilds.

Set the config in a model's `config()` block, in its properties YAML, or for a folder with `+use_materialization_v2` in `dbt_project.yml`. See [Config inheritance](/reference/define-configs#config-inheritance).

Keep the original path as the project default and opt one folder into the restructured path:

<File name='dbt_project.yml'>

```yaml
flags:
  use_materialization_v2: false

models:
  my_project:
    governed:
      +use_materialization_v2: true
```

</File>

Opt a specific model in that folder back out:

<File name='models/governed/schema.yml'>

```yaml
models:
  - name: customer_dashboard
    config:
      use_materialization_v2: false
```

</File>

### Changes to the Seed materialization

Starting in `dbt-databricks` 1.12.7, seeds use a single materialization. In earlier versions, the restructured seed path omitted calls to unsupported operations such as transactions.

### Changes to the View materialization

Starting in `dbt-databricks` 1.13.0, views use a single materialization regardless of `use_materialization_v2`. Set `view_update_via_alter: true` to update an existing Unity Catalog view in place (preserving its history) for eligible changes; `--full-refresh` always replaces the view. Replacing a view with another view always uses `CREATE OR REPLACE VIEW`, regardless of `use_safer_relation_operations`.

This example enables in-place updates for a Unity Catalog view.

 <File name="schema.yml">
 
 ```yaml
  
 models:
   - name: market_summary
     config:
       materialized: view
       view_update_via_alter: true
     
     columns:
       - name: country
         data_tests:
           - unique
           - not_null
 ...
 ```
 
 </File>

:::caution There is currently no support for altering the comment on a view via Databricks SQL.

As such, we must replace the view whenever you change its description

:::

#### View replacement before dbt-databricks 1.13.0

In `dbt-databricks` 1.10&ndash;1.12, set the project flag to `true` to use `view_update_via_alter` or `use_safer_relation_operations` for views. With `view_update_via_alter: false`, `use_safer_relation_operations: true` can build a staged view and swap it with the existing view if both can be renamed.

 <File name="schema.yml">
 
 ```yaml
  
 models:
   - name: market_summary
     config:
       materialized: view
       use_safer_relation_operations: true
     
     columns:
       - name: country
         data_tests:
           - unique
           - not_null
 ...
 ```
 
 </File>

:::caution
Staged view replacement in these older adapter versions creates additional Unity Catalog objects and can affect object history.
:::

### Changes to the Table materialization

:::caution The restructured table materialization may increase storage costs.
More temporary objects are used, consistent with other dbt adapters' materializations.
We consider these changes experimental in part because we do not have enough data quantifying the price impact of this change.
The benefits though are improvements in performance, safety, and unblocking features that cannot be delivered with the existing materialization.

:::

The restructured table materialization creates the table before inserting rows. This separation greatly improves performance for setting table comments, since adding comments at create time is faster than using separate `alter table` statements. It also resolves compatibility issues in Databricks, where creating and inserting in one step prevents setting comments.

#### Constraints

For several feature releases now, dbt-databricks supported both dbt's [constraints](/reference/resource-properties/constraints) implementation and our own alternative, earlier version called `persist_constraints`. With the `use_materialization_v2` flag, we're beginning to deprecate `persist_constraints` and shifting fully to dbt's native constraint support.

One new enhancement is support for the `expression` field on primary and foreign keys, which lets you pass additional Databricks options &mdash; like using [`RELY` to tell the Databricks optimizer that it may exploit the constraint to rewrite queries](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-constraint).

Separating `create` and `insert` also changes how constraints behave. Previously, we would create a table with data and then apply constraints. If the new data violated a constraint, the run would fail &mdash; but by then, it had already replaced the valid table from the previous run.

The restructured materialization applies enforced constraints before inserting rows.

#### `use_safer_relation_operations`

When set to `true` on a table that dbt can rename, dbt builds and loads a staging table before swapping it with the existing table. If the load fails before the swap, the existing table stays available.

With the default `false`, or when dbt cannot rename the existing table, dbt rebuilds the target directly. If the insert fails, the target can remain empty.

:::caution This configuration option may increase costs and disrupt Unity Catalog history.

Staging creates additional Unity Catalog objects with their own history.
Consider carefully whether you need this behavior.

:::

### Changes to the Incremental materialization

The table replacement behavior also applies when dbt rebuilds an incremental model's target, such as during a full refresh. Regular incremental runs use the configured incremental strategy. See [Changes to the table materialization](#changes-to-the-table-materialization).

We’ve also added a new config: `incremental_apply_config_changes`. 

This config lets you control whether dbt should apply changes to things like `tags`, `tblproperties`, and comments during incremental runs. Many users wanted the capability to configure table metadata in Databricks &mdash; like AI-generated comments &mdash; without dbt overwriting them. Previously, dbt-databricks always applied detected changes during incremental runs.

With the V2 materialization, you can now set `incremental_apply_config_changes` to `false` to stop that behavior. (It defaults to `true` to match the previous behavior.)

The following example shows how to configure this:

<File name="schema.yml">

```yaml
 
models:
  - name: incremental_market_updates
    config:
      materialized: incremental
      incremental_apply_config_changes: false
...
```

</File>

## Use managed Iceberg

When you set `table_format` to `iceberg`, the `use_managed_iceberg` flag controls how the table is created. By default, this flag is set to `false` and dbt creates a [UniForm](https://www.databricks.com/blog/delta-uniform-universal-format-lakehouse-interoperability) table. When set to `true`, dbt creates a [managed Iceberg](https://docs.databricks.com/aws/en/tables/managed) table.

## Use `replace on` for `insert_overwrite` strategy

The `use_replace_on_for_insert_overwrite` flag controls which SQL syntax dbt generates for incremental models using the `insert_overwrite` strategy. This flag defaults to `true` by default and results in using the [`insert into ... replace on`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) syntax to perform dynamic partition/cluster overwrites, which is the same behavior as in cluster computes. When the flag is set to `false`, `insert_overwrite` will truncate the entire table when used with SQL warehouses. The flag is not relevant for cluster computes because the `insert_overwrite`'s behavior has always been dynamic partition/cluster overwrites in cluster computes.

<SimpleTable>

| Flag value | SQL generated | Description |
|---|---|---|
| `true` (default) | [`INSERT INTO ... REPLACE ON`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) | Uses the latest, recommended Databricks syntax to replace matching partitions.  |
| `false` | `INSERT OVERWRITE` | Uses the older Spark syntax to overwrite partitions. Depends on Spark session settings.|  <br />
</SimpleTable>

If you previously relied on this behavior to get full table replacement without dropping existing metadata, that behavior continues to exist with the flag set to `true`, provided you do not use any partitions or liquid clustering clusters.
These data layout optimizations only tend to have a significant effect for tables that are approximately 1 TB large or greater, at which point regular replacement of all of the data is probably not the best approach.

## Use `DESCRIBE AS JSON` for relation metadata

The `use_describe_as_json_for_relation_metadata` flag controls how dbt fetches relation-level metadata such as constraints (primary key, foreign key, and non-null), column masks, row filters, and view descriptions for Databricks tables and views. It accepts two values:

- **`false`** (default): dbt issues multiple `information_schema` queries per relation to fetch this metadata.
- **`true`**: dbt fetches all of this metadata in a single [`DESCRIBE TABLE EXTENDED ... AS JSON`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-aux-describe-table) call per relation.

Enabling this flag is useful for projects that have many models with constraints, column masks, or row filters, because it reduces the number of metadata queries dbt has to issue.

#### Requirements

dbt uses the `DESCRIBE AS JSON` path for a given relation only when _all_ of the following are true:

- The relation is in Unity Catalog (not the Hive metastore).
- The relation is not a foreign table.
- The compute is a SQL warehouse, or runs on DBR 17.3 or later.

If any condition isn't met, dbt falls back to `information_schema` queries for that relation. The fallback happens per relation, so you can safely enable the flag on projects with mixed compute types.


