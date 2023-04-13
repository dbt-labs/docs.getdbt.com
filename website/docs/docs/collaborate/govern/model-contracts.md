---
title: "Model contracts"
id: model-contracts
sidebar_label: "Model contracts"
description: "Model contracts define a set of parameters validated during transformation"
---

:::info New functionality
This functionality is new in v1.5.
:::

## Related documentation
* [`contract`](resource-configs/contract)
* [`columns`](resource-properties/columns)
* [`constraints`](resource-properties/constraints)

## Why define a contract?

Defining a dbt model is as easy as writing a SQL `select` statement. Your query naturally produces a dataset with columns of names and types based on the columns you select and the transformations you apply.

While this is ideal for quick and iterative development, for some models, constantly changing the shape of its returned dataset poses a risk when other people and processes are querying that model. It's better to define a set of upfront "guarantees" that define the shape of your model. We call this set of guarantees a "contract." While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract, or it will fail to build.

## How to define a contract

Let's say you have a model with a query like:

<File name="models/marts/dim_customers.sql">

```sql
-- lots of SQL

final as (

    select
        customer_id,
        customer_name,
        -- ... many more ...
    from ...

)

select * from final
```

</File>

To enforce a model's contract, set `enforced: true` under the `contract` configuration.

When enforced, your contract _must_ include every column's `name` and `data_type` (where `data_type` matches one that your data platform understands).

If your model is materialized as `table` or `incremental`, and depending on your data platform, you may optionally specify additional [constraints](resource-properties/constraints), such as `not_null` (containing zero null values).

<File name="models/marts/customers.yml">

```yaml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
      - name: customer_name
        data_type: string
      ...
```

</File>

When building a model with a defined contract, dbt will do two things differently:
1. dbt will run a "preflight" check to ensure that the model's query will return a set of columns with names and data types matching the ones you have defined. This check is agnostic to the order of columns specified in your model (SQL) or yaml spec.
2. dbt will include the column names, data types, and constraints in the DDL statements it submits to the data platform, which will be enforced while building or updating the model's table.

## FAQs

### Which models should have contracts?

Any model can define a contract. Defining contracts for "public" models that are being shared with other groups, teams, and (soon) dbt projects is especially important. For more, read about ["Model access"](model-access).

### How are contracts different from tests?

A model's contract defines the **shape** of the returned dataset.

[Tests](docs/build/tests) are a more flexible mechanism for validating the content of your model. So long as you can write the query, you can run the test. Tests are also more configurable via `severity` and custom thresholds and are easier to debug after finding failures. The model has already been built, and the relevant records can be materialized in the data warehouse by [storing failures](resource-configs/store_failures).

In a parallel for software APIs, the structure of the API response is the contract. Quality and reliability ("uptime") are also very important attributes of an API's quality, but not part of the contract per se, indicating a breaking change or requiring a version bump.

### Where are contracts supported?

At present, model contracts are supported for:
- SQL models (not yet Python)
- Models materialized as `table`, `view`, and `incremental` (with `on_schema_change: append_new_columns`)
- On the most popular data platforms — but which `constraints` are supported/enforced varies by platform
