---
resource_types: [models]
description: "When the contract configuration is enforced, dbt will ensure that your model's returned dataset exactly matches the attributes you have defined in yaml, such as name and data_type, as well as any additional constraints supported by the data platform."
datatype: "{<dictionary>}"
default_value: {enforced: false}
id: "contract"
---

Supported in dbt v1.5 and higher.

When the `contract` configuration is enforced, dbt will ensure that your model's returned dataset exactly matches the attributes you have defined in yaml:
- `name` and `data_type` for every column
- Additional [`constraints`](/reference/resource-properties/constraints), as supported for this materialization and data platform

This is to ensure that the people querying your model downstream—both inside and outside dbt—have a predictable and consistent set of columns to use in their analyses. Even a subtle change in data type, such as from `boolean` (`true`/`false`) to `integer` (`0`/`1`), could cause queries to fail in surprising ways.

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

Note that you need to specify a varchar size or numeric scale, otherwise dbt relies on default values. For example, if a `numeric` type defaults to a precision of 38 and a scale of 0, then the numeric column stores 0 digits to the right of the decimal (it only stores whole numbers), which might cause it to fail contract enforcement. To avoid this implicit coercion, specify your `data_type` with a nonzero scale, like `numeric(38, 6)`. dbt Core 1.7 and higher provides a warning if you don't specify precision and scale when providing a numeric data type.

### Example

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

## Support

At present, model contracts are supported for:
- SQL models (not yet Python)
- Models materialized as `table`, `view`, and `incremental` (with `on_schema_change: append_new_columns`)
- The most popular data platforms — though support and enforcement of different [constraint types](/reference/resource-properties/constraints) vary by platform

### Incremental models and `on_schema_change`

Why require that incremental models also set [`on_schema_change`](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change), and why to `append_new_columns`?

Imagine:
- You add a new column to both the SQL and the YAML spec
- You don't set `on_schema_change`, or you set `on_schema_change: 'ignore'`
- dbt doesn't actually add that new column to the existing table — and the upsert/merge still succeeds, because it does that upsert/merge on the basis of the already-existing "destination" columns only (this is long-established behavior)
- The result is a delta between the yaml-defined contract, and the actual table in the database - which means the contract is now incorrect!

Why `append_new_columns`, rather than `sync_all_columns`? Because removing existing columns is a breaking change for contracted models!

## Related documentation
- [What is a model contract?](/docs/collaborate/govern/model-contracts)
- [Defining `columns`](/reference/resource-properties/columns)
- [Defining `constraints`](/reference/resource-properties/constraints)
