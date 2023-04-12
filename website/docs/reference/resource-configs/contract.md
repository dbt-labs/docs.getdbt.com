---
resource_types: [models]
datatype: "{<dictionary>}"
default_value: {contract: false}
id: "contract"
---


## Related documentation
- [What is a model contract?](govern/model-contracts)
- [Defining `columns`](resource-properties/columns)
- [Defining `constraints`](resource-properties/constraints)

:::info Beta functionality
This functionality is new in v1.5! The syntax is mostly locked, but some small details are still liable to change.
:::

# Definition

When the `contract` configuration is enforced, dbt will ensure that your model's returned dataset exactly matches the attributes you have defined in yaml:
- `name` and `data_type` for every column
- additional [`constraints`](resource-properties/constraints), as supported for this materialization + data platform

The `data_type` defined in your yaml file must match a data type your data platform recognizes. dbt does not do any type aliasing itself; if your data platform recognizes both `int` and `integer` as corresponding to the same type, then they will return a match.

## Example

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
- The most popular data platforms — though support and enforcement of different [constraint types](resource-properties/constraints) vary by platform

### Incremental models and `on_schema_change`

Why require that incremental models also set [`on_schema_change`](incremental-models#what-if-the-columns-of-my-incremental-model-change), and why to `append_new_columns`?

Imagine:
- You add a new column to both the SQL and the yaml spec
- You don't set `on_schema_change`, or you set `on_schema_change: 'ignore'`
- dbt doesn't actually add that new column to the existing table — and the upsert/merge still succeeds, because it does that upsert/merge on the basis of the already-existing "destination" columns only (this is long-established behavior)
- The result is a delta between the yaml-defined contract, and the actual table in the database - which means the contract is now incorrect!

Why `append_new_columns`, rather than `sync_all_columns`? Because removing existing columns is a breaking change for contracted models!

### Detecting breaking changes

When you use the `state:modified` selection method in Slim CI, dbt will detect changes to model contracts, and raise an error if any of those changes could be breaking for downstream consumers.

Breaking changes include:
- Removing an existing column
- Changing the `data_type` of an existing column
- (Future) Removing or modifying one of the `constraints` on an existing column

```
Breaking Change to Contract Error in model sometable (models/sometable.sql)
  While comparing to previous project state, dbt detected a breaking change to an enforced contract.

  The contract's enforcement has been disabled.

  Columns were removed:
   - order_name

  Columns with data_type changes:
   - order_id (number -> int)

  Consider making an additive (non-breaking) change instead, if possible.
  Otherwise, create a new model version: https://docs.getdbt.com/docs/collaborate/govern/model-versions
```

Additive changes are **not** considered breaking:
- Adding a new column to a contracted model
- Adding new `constraints` to an existing column in a contracted model
