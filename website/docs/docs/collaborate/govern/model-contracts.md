---
title: "Model contracts"
id: model-contracts
sidebar_label: "Model contracts"
description: "Model contracts define a set of parameters validated during transformation"
---

<VersionBlock lastVersion="1.5">

:::info New functionality
This functionality is new in v1.5 — if you have thoughts, participate in [the discussion on GitHub](https://github.com/dbt-labs/dbt-core/discussions/6726)!
:::

</VersionBlock>


## Related documentation
* [`contract`](/reference/resource-configs/contract)
* [`columns`](/reference/resource-properties/columns)
* [`constraints`](/reference/resource-properties/constraints)

## Why define a contract?

Defining a dbt model is as easy as writing a SQL `select` statement. Your query naturally produces a dataset with columns of names and types based on the columns you select and the transformations you apply.

While this is ideal for quick and iterative development, for some models, constantly changing the shape of its returned dataset poses a risk when other people and processes are querying that model. It's better to define a set of upfront "guarantees" that define the shape of your model. We call this set of guarantees a "contract." While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract, or it will fail to build.

## Where are contracts supported?

At present, model contracts are supported for:
- SQL models. Contracts are not yet supported for Python models.
- Models materialized as `table`, `view`, and `incremental` (with `on_schema_change: append_new_columns`). Views offer limited support for column names and data types, but not `constraints`. Contracts are not supported for `ephemeral`-materialized models.
- Certain data platforms, but the supported and enforced `constraints` vary by platform.

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

If your model is materialized as `table` or `incremental`, and depending on your data platform, you may optionally specify additional [constraints](/reference/resource-properties/constraints), such as `not_null` (containing zero null values).

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
1. dbt will run a "preflight" check to ensure that the model's query will return a set of columns with names and data types matching the ones you have defined. This check is agnostic to the order of columns specified in your model (SQL) or YAML spec.
2. dbt will include the column names, data types, and constraints in the DDL statements it submits to the data platform, which will be enforced while building or updating the model's table.

## FAQs

### Which models should have contracts?

Any model meeting the criteria described above _can_ define a contract. We recommend defining contracts for ["public" models](model-access) that are being relied on downstream.
- Inside of dbt: Shared with other groups, other teams, and (in the future) other dbt projects.
- Outside of dbt: Reports, dashboards, or other systems & processes that expect this model to have a predictable structure. You might reflect these downstream uses with [exposures](/docs/build/exposures).

### How are contracts different from tests?

A model's contract defines the **shape** of the returned dataset. If the model's logic or input data doesn't conform to that shape, the model does not build.

[Tests](/docs/build/tests) are a more flexible mechanism for validating the content of your model _after_ it's built. So long as you can write the query, you can run the test. Tests are more configurable, such as with [custom severity thresholds](/reference/resource-configs/severity). They are easier to debug after finding failures, because you can query the already-built model, or [store the failing records in the data warehouse](/reference/resource-configs/store_failures).

In some cases, you can replace a test with its equivalent constraint. This has the advantage of guaranteeing the validation at build time, and it probably requires less compute (cost) in your data platform. The prerequisites for replacing a test with a constraint are:
- Making sure that your data platform can support and enforce the constraint that you need. Most platforms only enforce `not_null`.
- Materializing your model as `table` or `incremental` (**not** `view` or `ephemeral`).
- Defining a full contract for this model by specifying the `name` and `data_type` of each column.

**Why aren't tests part of the contract?** In a parallel for software APIs, the structure of the API response is the contract. Quality and reliability ("uptime") are also very important attributes of an API's quality, but they are not part of the contract per se. When the contract changes in a backwards-incompatible way, it is a breaking change that requires a bump in major version.

### Can I define a "partial" contract?

Currently, dbt contracts apply to **all** columns defined in a model, and they require declaring explicit expectations about **all** of those columns. The explicit declaration of a contract is not an accident—it's very much the intent of this feature.

We are investigating the feasibility of supporting "inferred" or "partial" contracts in the future. This would enable you to define constraints and strict data typing for a subset of columns, while still detecting breaking changes on other columns by comparing against the same model in production. If you're interested, please upvote or comment on [dbt-core#7432](https://github.com/dbt-labs/dbt-core/issues/7432).

### How are breaking changes handled?

When comparing to a previous project state, dbt will look for breaking changes that could impact downstream consumers. If breaking changes are detected, dbt will present a contract error. 

Breaking changes include:
- Removing an existing column
- Changing the `data_type` of an existing column
- Removing or modifying one of the `constraints` on an existing column (dbt v1.6 or higher)

More details are available in the [contract reference](/reference/resource-configs/contract#detecting-breaking-changes).