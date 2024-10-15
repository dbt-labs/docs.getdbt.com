---
title: "Model contracts"
id: model-contracts
sidebar_label: "Model contracts"
description: "Model contracts define a set of parameters validated during transformation"
---

## Related documentation
* [`contract`](/reference/resource-configs/contract)
* [`columns`](/reference/resource-properties/columns)
* [`constraints`](/reference/resource-properties/constraints)

## Why define a contract?

Defining a dbt model is as easy as writing a SQL `select` statement. Your query naturally produces a dataset with columns of names and types based on the columns you select and the transformations you apply.

While this is ideal for quick and iterative development, for some models, constantly changing the shape of its returned dataset poses a risk when other people and processes are querying that model. It's better to define a set of upfront "guarantees" that define the shape of your model. We call this set of guarantees a "contract." While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract, or it will fail to build.

## Where are contracts supported?

At present, model contracts are supported for:
- SQL models. 
- Models materialized as one of the following:
    - `table`
    - `view` &mdash; Views offer limited support for column names and data types, but not `constraints`.
    - `incremental` &mdash; with `on_schema_change: append_new_columns` or `on_schema_change: fail`.  
- Certain data platforms, but the supported and enforced `constraints` vary by platform.

Model contracts are _not_ supported for:
- Python models.
- `materialized view` or `ephemeral`-materialized SQL models.
- Custom materializations (unless added by the author).
- Models with recursive <Term id="cte" />'s in BigQuery.
- Other resource types, such as `sources`, `seeds`, `snapshots`, and so on.


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
2. dbt will include the column names, data types, and constraints in the DDL statements it submits to the data platform, which will be enforced while building or updating the model's table, and order the columns per the contract instead of your dbt model.

## Platform constraint support

Select the adapter-specific tab for more information on [constraint](/reference/resource-properties/constraints) support across platforms. Constraints fall into three categories based on definability and platform enforcement:

- **Definable and enforced** &mdash; The model won't build if it violates the constraint.
- **Definable and not enforced** &mdash; The platform supports specifying the type of constraint, but a model can still build even if building the model violates the constraint. This constraint exists for metadata purposes only. This approach is more typical in cloud data warehouses than in transactional databases, where strict rule enforcement is more common.
- **Not definable and not enforced** &mdash; You can't specify the type of constraint for the platform.



<Tabs>

<TabItem value="Redshift" label="Redshift">

| Constraint type | Definable       | Enforced         |
|:----------------|:-------------:|:------------------:|
| not_null        | ✅ | ✅ |
| primary_key     | ✅ | ❌ |
| foreign_key     | ✅ | ❌ |
| unique          | ✅ | ❌ |
| check           | ❌ | ❌ |

</TabItem>
<TabItem value="Snowflake" label="Snowflake">

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:---------------------:|
| not_null        | ✅  | ✅ |
| primary_key     | ✅  | ❌ |
| foreign_key     | ✅  | ❌ |
| unique          | ✅  | ❌ |
| check           | ❌  | ❌ |

</TabItem>
<TabItem value="BigQuery" label="BigQuery">

| Constraint type | Definable     | Enforced |
|:-----------------|:-------------:|:---------------------:|
| not_null        | ✅ | ✅  |
| primary_key     | ✅ | ❌  |
| foreign_key     | ✅ | ❌  |
| unique          | ❌ | ❌  |
| check           | ❌ | ❌  |

</TabItem>
<TabItem value="Postgres" label="Postgres">

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:--------------------:|
| not_null        | ✅  |	✅  |
| primary_key     | ✅  |	✅  |
| foreign_key     | ✅  |	✅  |
| unique          | ✅  |	✅  |
| check           | ✅  |	✅  |

</TabItem>
<TabItem value="Spark" label="Spark">

Currently, `not_null` and `check` constraints are enforced only after a model is built. Because of this platform limitation, dbt considers these constraints definable but not enforced, which means they're not part of the _model contract_ since they can't be enforced at build time. This table will change as the features evolve.

| Constraint type | Definable    | Enforced |
|:----------------|:------------:|:---------------------:|
| not_null        |	✅  | ❌ |
| primary_key     |	✅  | ❌ |
| foreign_key     |	✅  | ❌ |
| unique          |	✅  | ❌ |
| check           |	✅  | ❌ |

</TabItem>
<TabItem value="Databricks" label="Databricks">

Currently, `not_null` and `check` constraints are enforced only after a model is built. Because of this platform limitation, dbt considers these constraints definable but not enforced, which means they're not part of the _model contract_ since they can't be enforced at build time. This table will change as the features evolve.

| Constraint type | Definable     | Enforced |
|:----------------|:-------------:|:---------------------:|
| not_null        |	✅  | ❌ |
| primary_key     | ✅  | ❌ |
| foreign_key     |	✅  | ❌ |
| unique          |	✅  | ❌ |
| check           |	✅  | ❌ |

</TabItem>
</Tabs>


## FAQs

### Which models should have contracts?

Any model meeting the criteria described above _can_ define a contract. We recommend defining contracts for ["public" models](model-access) that are being relied on downstream.
- Inside of dbt: Shared with other groups, other teams, and [other dbt projects](/best-practices/how-we-mesh/mesh-1-intro).
- Outside of dbt: Reports, dashboards, or other systems & processes that expect this model to have a predictable structure. You might reflect these downstream uses with [exposures](/docs/build/exposures).

### How are contracts different from tests?

A model's contract defines the **shape** of the returned dataset. If the model's logic or input data doesn't conform to that shape, the model does not build.

[Data Tests](/docs/build/data-tests) are a more flexible mechanism for validating the content of your model _after_ it's built. So long as you can write the query, you can run the data test. Data tests are more configurable, such as with [custom severity thresholds](/reference/resource-configs/severity). They are easier to debug after finding failures because you can query the already-built model, or [store the failing records in the data warehouse](/reference/resource-configs/store_failures).

In some cases, you can replace a data test with its equivalent constraint. This has the advantage of guaranteeing the validation at build time, and it probably requires less compute (cost) in your data platform. The prerequisites for replacing a data test with a constraint are:
- Making sure that your data platform can support and enforce the constraint that you need. Most platforms only enforce `not_null`.
- Materializing your model as `table` or `incremental` (**not** `view` or `ephemeral`).
- Defining a full contract for this model by specifying the `name` and `data_type` of each column.

**Why aren't tests part of the contract?** In a parallel for software APIs, the structure of the API response is the contract. Quality and reliability ("uptime") are also very important attributes of an API's quality, but they are not part of the contract per se. When the contract changes in a backwards-incompatible way, it is a breaking change that requires a bump in major version.

### Do I need to define every column for a contract?

Currently, dbt contracts apply to **all** columns defined in a model, and they require declaring explicit expectations about **all** of those columns. The explicit declaration of a contract is not an accident—it's very much the intent of this feature.

At the same time, for models with many columns, we understand that this can mean a _lot_ of yaml. We are investigating the feasibility of supporting "inferred" contracts. This would enable you to define constraints and strict data typing for a subset of columns, while still detecting breaking changes on other columns by comparing against the same model in production. This isn't the same as a "partial" contract, because all columns in the model are still checked at runtime, and matched up with what's defined _explicitly_ in your yaml contract or _implicitly_ with the comparison state. If you're interested in "inferred" contract, please upvote or comment on [dbt-core#7432](https://github.com/dbt-labs/dbt-core/issues/7432).


### How are breaking changes handled?

When comparing to a previous project state, dbt will look for breaking changes that could impact downstream consumers. If breaking changes are detected, dbt will present a contract error. 

Breaking changes include:
- Removing an existing column.
- Changing the `data_type` of an existing column.
- Removing or modifying one of the `constraints` on an existing column (dbt v1.6 or higher).
- Removing a contracted model by deleting, renaming, or disabling it (dbt v1.9 or higher).
  - versioned models will raise an error.
  - unversioned models will raise a warning.

More details are available in the [contract reference](/reference/resource-configs/contract#detecting-breaking-changes).

