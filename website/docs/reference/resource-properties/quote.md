---
resource_types: all
datatype: boolean
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/schema.yml'>

```yml
version: 2

sources:
  - name: source_name
    tables:
      - name: table_name
        columns:
          - name: column_name
            quote: true | false

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analysis/schema.yml'>

```yml
version: 2

analyses:
  - name: analysis_name
    columns:
      - name: column_name
        quote: true | false

```

</File>

</TabItem>

</Tabs>

## Definition
The `quote` field can be used to enable or disable quoting for column names.

## Default
The default quoting value is `false`

## Explanation
This is particularly relevant to those using Snowflake, where quoting can be particularly fickle.

This property is useful when:
- A source <Term id="table" /> has a column that needs to be quoted to be selected, for example, to preserve column casing
- A seed was created with `quote_columns: true` ([docs](/reference/resource-configs/quote_columns)) on Snowflake
- A model uses quotes in the SQL, potentially to work around the use of reserved words
```sql
select user_group as "group"
```

Without setting `quote: true`:
- Schema tests applied to this column may fail due to invalid SQL
- Documentation may not render correctly, e.g. `group` and `"group"` may not be matched as the same column name.

## Example
### Add tests to a quoted column in a source table
This is especially relevant if using Snowflake:

```yml
version: 2

sources:
  - name: stripe
    tables:
      - name: payment
        columns:
          - name: orderID
            quote: true
            tests:
              - not_null

```

Without `quote: true`, the following error will occur:

```
$ dbt test -s source:stripe.*
Running with dbt=0.16.1
Found 7 models, 22 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 4 sources

13:33:37 | Concurrency: 4 threads (target='learn')
13:33:37 |
13:33:37 | 1 of 1 START test source_not_null_stripe_payment_order_id............ [RUN]
13:33:39 | 1 of 1 ERROR source_not_null_stripe_payment_order_id................. [ERROR in 1.89s]
13:33:39 |
13:33:39 | Finished running 1 tests in 6.43s.

Completed with 1 error and 0 warnings:

Database Error in test source_not_null_stripe_payment_order_id (models/staging/stripe/src_stripe.yml)
  000904 (42000): SQL compilation error: error line 3 at position 6
  invalid identifier 'ORDERID'
  compiled SQL at target/compiled/jaffle_shop/schema_test/source_not_null_stripe_payment_orderID.sql
```

This is because dbt is trying to run:
```sql
select count(*)
from raw.stripe.payment
where orderID is null

```

Instead of:
```sql
select count(*)
from raw.stripe.payment
where "orderID" is null

```
