---
resource_types: [models]
description: "When the contract configuration is enforced, dbt will ensure that your model's returned dataset exactly matches the attributes you have defined in YAML, such as name and data_type, as well as any additional constraints supported by the data platform."
datatype: "{<dictionary>}"
default_value: {enforced: false}
id: "contract"
---

When the `contract` configuration is enforced, dbt will ensure that your model's returned dataset exactly matches the attributes you have defined in YAML:
- `name` and `data_type` for every column
- Additional [`constraints`](/reference/resource-properties/constraints), as supported for this materialization and data platform

This is to ensure that the people querying your model downstream—both inside and outside dbt—have a predictable and consistent set of columns to use in their analyses. Even a subtle change in data type, such as from `boolean` (`true`/`false`) to `integer` (`0`/`1`), could cause queries to fail in surprising ways.

Contracts give you control over how schemas are enforced, whether that’s on a single model or consistently across many models in a project.

import Contractsupport from '/snippets/_contract-support.md'; 

<Contractsupport />

Refer to the [Examples](/reference/resource-configs/contract#examples) to see how to apply contracts in your project.

## Data type aliasing

dbt uses built-in type aliasing for the `data_type` defined in your YAML. For example, you can specify `string` in your contract, and on Postgres/Redshift, dbt will convert it to `text`. If dbt doesn't recognize the `data_type` name among its known aliases, it will pass it through as-is. This is enabled by default, but you can opt-out by setting `alias_types` to `false`.

Example for disabling: 

<File name='FOLDER_NAME/FILE_NAME.yml'>

```yml

models:
  - name: my_model
    config:
      contract:
        enforced: true
        alias_types: false  # true by default

```

</File>

## Size, precision, and scale

When dbt compares data types, it will not compare granular details such as size, precision, or scale. We don't think you should sweat the difference between `varchar(256)` and `varchar(257)`, because it doesn't really affect the experience of downstream queriers. You can accomplish a more-precise assertion by [writing or using a custom test](/best-practices/writing-custom-generic-tests).

Note that you need to specify a varchar size or numeric scale, otherwise dbt relies on default values. For example, if a `numeric` type defaults to a precision of 38 and a scale of 0, then the numeric column stores 0 digits to the right of the decimal (it only stores whole numbers), which might cause it to fail contract enforcement. To avoid this implicit coercion, specify your `data_type` with a nonzero scale, like `numeric(38, 6)`. <Constant name="core" /> 1.7 and higher provides a warning if you don't specify precision and scale when providing a numeric data type.

### Examples

<File name='models/dim_customers.yml'>

```yml
models:
  - name: dim_customers
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
      - name: customer_name
        data_type: string
      - name: non_integer
        data_type: numeric(38,3)
```

</File>

Let's say your model is defined as:

<File name='models/dim_customers.sql'>

```sql
select
  'abc123' as customer_id,
  'My Best Customer' as customer_name
```

</File>

When you `dbt run` your model, _before_ dbt has materialized it as a table in the database, you will see this error:
```txt
20:53:45  Compilation Error in model dim_customers (models/dim_customers.sql)
20:53:45    This model has an enforced contract that failed.
20:53:45    Please ensure the name, data_type, and number of columns in your contract match the columns in your model's definition.
20:53:45
20:53:45    | column_name | definition_type | contract_type | mismatch_reason    |
20:53:45    | ----------- | --------------- | ------------- | ------------------ |
20:53:45    | customer_id | TEXT            | INT           | data type mismatch |
20:53:45
20:53:45
20:53:45    > in macro assert_columns_equivalent (macros/materializations/models/table/columns_spec_ddl.sql)
```

<Tabs>
  <TabItem value="Project YAML" label="Project YAML">

  Use a contract enforcement in your `dbt_project.yml` to enforce contracts consistently across multiple models:

    ```yml

    models:
      property_management:  # replace with your dbt project name
        +contract:
          enforced: true

    ```

  </TabItem>
 
  <TabItem value="Properties YAML" label="Properties YAML">

  Define a model’s contract in a `properties.yml` by specifying the expected columns and data types:

```yml

models:
  - name: stg_rental_applications  # replace with your model name
    config:
      contract:
        enforced: true
    columns:
      - name: column_1_id  # example id column. Replace with your column
        data_type: int    # replace with your column's data type
      - name: column_2_created_at  # example column tracking when something was created
        data_type: timestamp
      - name: column_3_status      # example status column, which typically store text values ("active", "pending", "completed", etc.)
        data_type: string

```

    </TabItem>
 
  <TabItem value="SQL file config" label="SQL file config">

  Enforce a contract in a model SQL file when you want to apply it to a single model and maintain fine-grained control: 

  ```sql

  {{ config(
    contract = { "enforced": true }  -- Enables contract enforcement for this model
  ) }}

  select
    column_1_id,          -- replace with your column
    column_2_created_at,  -- replace with your column
    column_3_status       -- replace with your column
  from {{ source('property_management', 'rental_applications') }}  -- replace with your source name and table

  ```

  </TabItem>

</Tabs>

Refer to [General configurations](/reference/model-configs#general-configurations) for more information on the supported configs available for model SQL files, `dbt_project.yml` and `properties.yml`.

### Incremental models and `on_schema_change`

Why require that incremental models also set [`on_schema_change`](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change), and why to `append_new_columns` or `fail`?

Imagine:
- You add a new column to both the SQL and the YAML spec
- You don't set `on_schema_change`, or you set `on_schema_change: 'ignore'`
- dbt doesn't actually add that new column to the existing table — and the upsert/merge still succeeds, because it does that upsert/merge on the basis of the already-existing "destination" columns only (this is long-established behavior)
- The result is a delta between the YAML-defined contract, and the actual table in the database - which means the contract is now incorrect!

Why `append_new_columns` (or `fail`) rather than `sync_all_columns`? Because removing existing columns is a breaking change for contracted models! `sync_all_columns` works like `append_new_columns` but also removes deleted columns, which you're not supposed to do with contracted models unless you upgrade the version.

## Troubleshooting

<Expandable alt_header="I’m getting a contract mismatch error">
**What went wrong:** When a model has an enforced contract, dbt ensures the model’s returned dataset exactly matches the YAML-defined `name` and `data_type` for every column; if they don’t match, dbt errors.

**Solution:** Ensure the `name`, `data_type`, and number of columns in the contract match the columns in the model’s definition. For details, refer to the [contract docs](/reference/resource-configs/contract).
</Expandable>

<Expandable alt_header="I got an error and don’t know where it failed">
**What went wrong:** Debugging slows down if you don’t distinguish whether an error happened during parsing/compilation versus SQL execution.

**Solution:** Use the error type and step mapping in the docs (`Runtime`, `Compilation`, `Dependency`, `Database`) to identify where the failure occurred, then debug accordingly. For details, refer to [Debug errors](/guides/debug-errors#types-of-errors).
</Expandable>

<Expandable alt_header="I need help debugging this model">
**What went wrong:** If you don’t inspect the compiled/executed SQL and full logs, you miss the exact query dbt ran and the surrounding context.

**Solution:** Use `target/compiled` (select statements), `target/run` (SQL dbt executes to build models), and `logs/dbt.log` (all queries plus verbose logging; recent errors at the bottom). For details, refer to [How can I see the SQL that dbt is running?](/faqs/Runs/checking-logs), [Events and logs](/reference/events-logging), and [Debug errors](/guides/debug-errors).
</Expandable>

<Expandable alt_header="My incremental model is creating duplicates">
**What went wrong:** Without `unique_key`, most adapters use append-only behavior. With a `unique_key` that isn’t truly unique (or contains nulls), incremental runs may fail to match rows and can generate duplicates.

**Solution:** Define `unique_key` to enable updating existing rows instead of just appending, and ensure the key columns do not contain nulls (the docs suggest using `coalesce(...)` or defining a surrogate key). If you’re having issues, double-check the key is truly unique in both the existing table and the new incremental rows. For details, refer to [Defining a unique key](/docs/build/incremental-models#defining-a-unique-key).
</Expandable>

<Expandable alt_header="My incremental filter isn’t selecting the rows I expect">
**What went wrong:** `is_incremental()` controls whether incremental-only filtering is applied; if the filter logic is off, you may not be transforming the intended subset of rows on incremental runs.

**Solution:** Implement your incremental-run filter inside an `is_incremental()` block, and ensure the model SQL is valid whether `is_incremental()` evaluates to `True` or `False` (the docs include examples using [`{{ this }}`](/reference/dbt-jinja-functions/this) to filter based on the existing target table). For details, refer to [Understand the is_incremental() macro](/docs/build/incremental-models#understand-the-is_incremental-macro).
</Expandable>

<Expandable alt_header="My new column isn’t showing up in my incremental model">
**What went wrong:** With `on_schema_change: ignore` (the default behavior), or if you don’t set `on_schema_change` at all, adding a column to an incremental model and running `dbt run` won’t add that column to the existing target table.

**Solution:** Set `on_schema_change` to control how dbt handles schema changes (`fail`, `append_new_columns`, or `sync_all_columns`). Note that none of these options backfill values for old records in newly added columns—if you need that, the docs recommend manual updates or triggering a `--full-refresh`. For details, refer to [What if the columns of my incremental model change?](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) and the contract docs section on [Incremental models and `on_schema_change`](/reference/resource-configs/contract#incremental-models-and-on_schema_change).
</Expandable>

<Expandable alt_header="A column disappeared from my incremental model table">
**What went wrong:** `sync_all_columns` “adds any new columns to the existing table, and removes any columns that are now missing,” so a column can be removed from the target table if it’s missing from the new model query.

**Solution:** Use a non-destructive option like `append_new_columns` when you only want to add columns. For contracted models, the contract docs explain why you should use `append_new_columns` or `fail` rather than `sync_all_columns`. For details, refer to [What if the columns of my incremental model change?](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) and the contract docs section on [Incremental models and `on_schema_change`](/reference/resource-configs/contract#incremental-models-and-on_schema_change).
</Expandable>

<Expandable alt_header="My SQL changed, but old rows didn’t update">
**What went wrong:** If incremental model logic changes, new-row transformations can diverge from historical transformations stored in the existing target table.

**Solution:** Rebuild the incremental model from scratch using the `--full-refresh` flag (the docs explain this drops the existing target table before rebuilding). For details, refer to [How do I rebuild an incremental model?](/docs/build/incremental-models#how-do-i-rebuild-an-incremental-model).
</Expandable>

<Expandable alt_header="I’m getting a data type mismatch I didn’t expect">
**What went wrong:** dbt applies built-in type aliasing for YAML `data_type` values, and relying on default precision/scale (especially for `numeric`) can lead to implicit coercion that may cause contract enforcement to fail.

**Solution:** If you want to avoid aliasing, set `alias_types: false`. To avoid implicit numeric coercion, specify a `data_type` with a nonzero scale (for example, `numeric(38, 6)`). For details, refer to the [contract docs](/reference/resource-configs/contract).
</Expandable>

## Related documentation
- [What is a model contract?](/docs/mesh/govern/model-contracts)
- [Defining `columns`](/reference/resource-properties/columns)
- [Defining `constraints`](/reference/resource-properties/constraints)
