---
resource_types: all
datatype: test
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

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    columns:
      - name: <column_name>
        data_type: <string>
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests): ...
        config:
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
      - name: <another_column>
        ...
```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    tables:
    - name: <table_name>
      columns:
        - name: <column_name>
          [description](/reference/resource-properties/description): <markdown_string>
          data_type: <string>
          [quote](/reference/resource-properties/columns#quote): true | false
          [data_tests](/reference/resource-properties/data-tests): ...
          config:
            [tags](/reference/resource-configs/tags): ...
            [meta](/reference/resource-configs/meta): ...
        - name: <another_column>
          ...

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests): ...
        config:
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
      - name: <another_column>
            ...
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests): ...
        config:
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
      - name: <another_column>

```

</File>

</TabItem>


<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name>
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
      - name: <another_column>

```

</File>

</TabItem>

</Tabs>

Columns are not resources in and of themselves. Instead, they are child properties of another resource type. They can define sub-properties that are similar to properties defined at the resource level:
- `tags`
- `meta`
- `data_tests`
- `description`

Because columns are not resources, their `tags` and `meta` properties are not true configurations even when nested under a `config` block. They do not inherit the `tags` or `meta` values of their parent resources. However, you can select a generic test, defined on a column, using tags applied to its column or top-level resource; see [test selection examples](/reference/node-selection/test-selection-examples#run-tests-on-tagged-columns).

Columns may optionally define a `data_type`, which is necessary for:
- Enforcing a model [contract](/reference/resource-configs/contract)
- Use in other packages or plugins, such as the [`external`](/reference/resource-properties/external) property of sources and [`dbt-external-tables`](https://hub.getdbt.com/dbt-labs/dbt_external_tables/latest/)

### `quote`

The `quote` field can be used to enable or disable quoting for column names.

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

### Default
The default quoting value is `false`

### Explanation
This is particularly relevant to those using Snowflake, where quoting can be particularly fickle.

This property is useful when:
- A source <Term id="table" /> has a column that needs to be quoted to be selected, for example, to preserve column casing
- A seed was created with `quote_columns: true` ([docs](/reference/resource-configs/quote_columns)) on Snowflake
- A model uses quotes in the SQL, potentially to work around the use of reserved words
```sql
select user_group as "group"
```

Without setting `quote: true`:
- [Data tests](/docs/build/data-tests) applied to this column may fail due to invalid SQL
- Documentation may not render correctly, e.g. `group` and `"group"` may not be matched as the same column name.

### Example
#### Add data tests to a quoted column in a source table
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
            data_tests:
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
