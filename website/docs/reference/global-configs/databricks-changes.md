---
title: "Databricks adapter behavior changes"
id: "databricks-changes"
sidebar: "Databricks"
---

The following are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-databricks`:

| Flag                          | `dbt-databricks`: Intro | `dbt-databricks`: Maturity |
| ----------------------------- | ----------------------- | -------------------------- |
| [`use_info_schema_for_columns`](#use-information-schema-for-columns) | 1.9.0                   | TBD                        |
| [`use_user_folder_for_python`](#use-users-folder-for-python-model-notebooks)  | 1.9.0                   | TBD                        |
| [`use_materialization_v2`](#use-restructured-materializations)      | 1.10.0                  | TBD                        |
| [`use_managed_iceberg`](#use-managed-iceberg)  | 1.11.0  |  TBD                                                     |
| [`use_replace_on_for_insert_overwrite`](#use-replace-on-for-insert_overwrite-strategy)   | 1.11.0   | TBD                    |

## Use information schema for columns

The `use_info_schema_for_columns` flag is `False` by default.

Setting this flag to `True` will use `information_schema` rather than `describe extended` to get column metadata for Unity Catalog tables. This setting helps you avoid issues where `describe extended` truncates information when the type is a complex struct. However, this setting is not yet the default behavior, as there are performance impacts due to a Databricks metadata limitation because of the need to run `REPAIR TABLE {{relation}} SYNC METADATA` before querying to ensure the `information_schema` is complete. 
Please note that there is no equivalent option for views at this time which means dbt will still need to use `describe extended` for views.

This flag may become default behavior in the future, depending on how `information_schema` changes.

:::tip Do I need this flag?

If your complex type comes from processing JSON using `from_json`, you have an alternative: use [`parse_json` to create the column as the `variant` type](https://docs.databricks.com/aws/en/sql/language-manual/functions/parse_json).
Depending on how you intend to query or further process the data, the `variant` type might be a reasonable alternative in terms of performance, while not suffering from the issue of type truncation in metadata queries.

:::

## Use user's folder for Python model notebooks

The `use_user_folder_for_python` flag is `False` by default and results in writing uploaded python model notebooks to `/Shared/dbt_python_models/{{schema}}/`. Setting this flag to `True` will write notebooks to `/Users/{{current user}}/{{catalog}}/{{schema}}/` Writing to the `Shared` folder is deprecated by Databricks as it does not align with governance best practices.

We plan to switch the default of this flag to `True` in v1.11.0.

## Use restructured materializations

The `use_materialization_v2` flag is `False` by default and guards significant rewrites of the core materializations in `dbt-databricks` while they are still in an experimental stage.

When set to `True`, `dbt-databricks ` uses the updated logic for all model types (views, tables, incremental, seeds). It also enables additional, optional config options for more fine-tuned control:
* `view_update_via_alter` &mdash; When enabled, this config attempts to update the view in place using alter view, instead of using create or replace to replace it.
* `use_safer_relation_operation` &mdash; When enabled (and if `view_update_via_alter` isn't set), this config makes dbt model updates more safe by staging relations and using rename operations to ensure the live version of the table or view is not disrupted by failures.

These configs aren't required to receive the core benefits of this flag &mdash; like better performance and column/constraint functionality &mdash; but they are gated behind the flag because they introduce more significant changes to how materializations behave.

We plan to switch the default of this flag to `True` in 1.11.0, depending on user feedback.

### Changes to the Seed materialization

The seeds materialization should have the smallest difference between the old and new materialization, as the primary difference is just removing calls to methods that are not supported by Databricks, such as transaction operations.

### Changes to the View materialization

With the `use_materialization_v2` flag set to `True`, there are two model configuration options that can customize how we handle the view materialization when we detect an existing relation at the target location.

* `view_update_via_alter` &mdash; Updates the view in place using alter view, instead of using create or replace to replace it. This allows continuity of history for the view, keeps the metadata, and helps with Unity Catalog compatibility. Here's an example of how to configure this:

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

* `use_safer_relation_operations` &mdash; When enabled (and if `view_update_via_alter` isn't set), this config makes dbt model updates more safe by creating a new relation in a staging location, swapping it with the existing relation, and deleting the old relation afterward. The following example shows how to configure this:

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

:::caution This configuration option may increase costs and disrupt Unity Catalog history.

While this approach is equivalent to the default dbt view materialization, it will create additional UC objects, as compared to alternatives.
Since this config does not use atomic 'create or replace...' for any materialization, the history of the object in Unity Catalog may not behave as you expect.
Consider carefully before using this model config broadly.

:::

### Changes to the Table materialization

:::caution This flag may increase storage costs for tables.

As with views, these materialization changes could increase costs.
More temporary objects are used, consistent with other dbt adapters' materializations.
We consider these changes experimental in part because we do not have enough data quantifying the price impact of this change.
The benefits though are improvements in performance, safety, and unblocking features that cannot be delivered with the existing materialization.

:::

When `use_materialization_v2` is set to `True`, all materialization paths are updated. The key change is that table creation is separated from inserting rows into the table. This separation greatly improves performance for setting table comments, since adding comments at create time is faster than using separate `alter table` statements. It also resolves compatibility issues in Databricks, where creating and inserting in one step prevents setting comments.

Additionally, this change makes it possible to support other column features &mdash; like column-level masks &mdash; that aren’t compatible with inserting data during creation. While these features aren’t included in version 1.10.0, they can now be added in future releases.

#### Constraints

For several feature releases now, dbt-databricks supported both dbt's [constraints](/reference/resource-properties/constraints) implementation and our own alternative, earlier version called `persist_constraints`. With the `use_materialization_v2` flag, we're beginning to deprecate `persist_constraints` and shifting fully to dbt's native constraint support.

One new enhancement is support for the `expression` field on primary and foreign keys, which lets you pass additional Databricks options &mdash; like using [`RELY` to tell the Databricks optimizer that it may exploit the constraint to rewrite queries](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-table-constraint).

Separating `create` and `insert` also changes how constraints behave. Previously, we would create a table with data and then apply constraints. If the new data violated a constraint, the run would fail &mdash; but by then, it had already replaced the valid table from the previous run.

As with views, you can select between performance and safety with the [`use_safer_relation_operations` flag](#use_safer_relation_operations), but regardless of setting, the new materialization approach ensures constraint violations don't make it into the target table.

#### `use_safer_relation_operations`

When using this model configuration with tables, we first create a staging table. After successfully inserting data into the table, we rename it to replace the target materialization. Since Databricks doesn’t support rollbacks, this is a safer approach &mdash; if something fails before the rename, the original table stays intact. That gives you time to troubleshoot without worrying that exposures or work streams relying on that table are broken in the mean time.

If this config is set to `false` (the default), the target table will still never contain constraint-violating data, but it might end up empty if the insert fails due to the constraint. The key difference is whether we replace the target directly or use a staging-and-rename approach.

:::caution This configuration option may increase costs and disrupt Unity Catalog history.

As with views, there is a cost to using additional temporary objects, in the form of creating more UC objects with their own history.
Consider carefully whether you need this behavior.

:::

### Changes to the Incremental materialization

All the changes made to the [Table materialization section](#changes-to-the-table-materialization) also apply to Incremental materializations.

We’ve also added a new config: `incremental_apply_config_changes`. 

This config lets you control whether dbt should apply changes to things like `tags`, `tblproperties`, and comments during incremental runs. Many users wanted the capability to configure table metadata in Databricks &mdash; like AI-generated comments &mdash; without dbt overwriting them. Previously, dbt-databricks always applied detected changes during incremental runs.

With the V2 materialization, you can now set `incremental_apply_config_changes` to `False` to stop that behavior. (It defaults to `True` to match the previous behavior.)

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

When you set `table_format` to `iceberg`, the `use_managed_iceberg` flag controls how the table is created. By default, this flag is set to `False` and dbt creates a [UniForm](https://www.databricks.com/blog/delta-uniform-universal-format-lakehouse-interoperability) table. When set to `True`, dbt creates a [managed Iceberg](https://docs.databricks.com/aws/en/tables/managed) table.

## Use `replace on` for `insert_overwrite` strategy

The `use_replace_on_for_insert_overwrite` flag is only relevant when using incremental models with the `insert_overwrite` strategy on SQL warehouses. The flag is `True` by default and results in using the [`insert into ... replace on`](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) syntax to perform dynamic partition/cluster overwrites, which is the same behavior as in cluster computes. When the flag is set to `False`, `insert_overwrite` will truncate the entire table when used with SQL warehouses. The flag is not relevant for cluster computes because the `insert_overwrite`'s behavior has always been dynamic partition/cluster overwrites in cluster computes.
