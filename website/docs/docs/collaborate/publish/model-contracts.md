---
title: "Model contracts"
id: model-contracts
sidebar_label: "Model contracts"
description: "Model contracts define a set of parameters validated during transformation"
---

:::info Beta functionality
This functionality is new in v1.5. These docs provide a high-level overview of what's to come. The specific syntax is liable to change.

For more details and to leave your feedback, join the GitHub discussion:
* ["Model contracts" (dbt-core#6726)](https://github.com/dbt-labs/dbt-core/discussions/6726)
:::

## Related documentation
* [`contract`](resource-configs/contract)
* [`columns`](resource-properties/columns)
* [`constraints`](resource-properties/constraints)

## Why define a contract?

Defining a dbt model is as easy as writing a SQL `select` statement or a Python Data Frame transformation. Your query naturally produces a dataset with columns of names and types based on the columns you select and the transformations you apply.

While this is ideal for quick and iterative development, for some models, constantly changing the shape of its returned dataset poses a risk when other people and processes are querying that model. It's better to define a set of upfront attestations that guarantee the shape of your model. We call this set of attestations a "contract." While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract, or it will fail to build.

## How to define a contract

Let's say you have a model with a query like:

<File name="models/marts/dim_customers.sql">

```sql
-- lots of SQL

final as (

    select
        -- lots of columns
    from ...

)

select * from final
```
</File>

Your contract _must_ include every column's `name` and `data_type` (where `data_type` matches the type your data platform understands). If your model is materialized as `table` or `incremental`, you may optionally specify that certain columns must be `not_null` (containing zero null values). Depending on your data platform, you may also be able to define additional `constraints` enforced while the model is being built.

Finally, you configure your model with `contract: true`.

<File name="models/marts/customers.yml">

```yaml
models:
  - name: dim_customers
    config:
      contract: true
    columns:
      - name: customer_id
        data_type: int
        not_null: true
      - name: customer_name
        data_type: string
        ...
```

</File>

When building a model with a defined contract, dbt will do two things differently:
1. dbt will run a preliminary verification check to ensure that the model's query will return a set of columns with names and data types matching the ones you have defined.
2. dbt will pass the column names, types, `not_null`, and other constraints into the DDL statements it submits to the data platform, which will be enforced while building the table.

## FAQs

### Which models should have contracts?

Any model can define a contract. Defining contracts for “public” models that are being shared with other groups, teams, and (soon) dbt projects is especially important.

### How are contracts different from tests?

A model's contract defines the **shape** of the returned dataset.

[Tests](tests) are a more flexible mechanism for validating the content of your model. So long as you can write the query, you can run the test. Tests are also more configurable via `severity` and custom thresholds and are easier to debug after finding failures. The model has already been built, and the relevant records can be materialized in the data warehouse by [storing failures](resource-configs/store_failures).

In blue/green deployments (docs link TK), ... <!-- TODO write more here -->

In parallel for software APIs:
- The structure of the API response is the contract
- Quality and reliability ("uptime") are also **crucial**, but not part of the contract per se.
