---
title: "Tests"
---

## Related reference docs
* [Test command](commands/test)
* [Test properties](resource-properties/tests)
* [Data test configurations](data-test-configs)

<!---
* [Test selection syntax](model-selection-syntax)
--->

## Getting started

Tests are assertions you make about your models and other resources in your dbt project (e.g. sources, seeds and snapshots). When you run `dbt test`, dbt will tell you if each test in your project passes or fails.

There are two type of tests:
* **schema tests** (more common): applied in YAML, returns the number of records that _do not_ pass an assertion — when this number is 0, all records pass, therefore, your test passes
* **data tests**: specific queries that return 0 records

Defining tests is a great way to confirm that your code is working correctly, and helps prevent regressions when your code changes.

:::tip Creating your first tests
If you're new to dbt, we recommend that you check out our [Getting Started Tutorial](tutorial/1-setting-up.md) to build your first dbt project with models and tests.
:::

## Schema tests
Schema tests are added as _properties_ for an existing model (or source, seed, or snapshot).

These properties are added in  `.yml` files in the same directory as your resource.

:::info
If this is your first time working with adding properties to a resource, check out the docs on [declaring properties](declaring-properties).
:::

Out of the box, dbt ships with the `unique`, `not_null`, `accepted_values` and `relationships` tests. Here's a full example:

```yml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
      - name: customer_id
        tests:
          - relationships:
              to: ref('customers')
              field: id
```

In plain English, these tests translate to:
* `unique`: the `order_id` column in the `orders` model should be unique
* `not_null`: the `order_id` column in the `orders` model should not contain null values
* `accepted_values`: the `status` column in the `orders` should be  one of `'placed'`, `'shipped'`, `'completed'`, or  `'returned'`
* `relationships`: each `customer_id` in the `orders` model exists as an `id` in the `customers` table (also known as referential integrity)

Behind the scenes, dbt constructs a `select` query for each schema test. These queries return the number `0` when your assertion is true, otherwise the test fails

You can find more information about these tests, and additional configurations (including [`severity`](resource-properties/tests#severity) and [`tags`](resource-properties/tags)) in the [reference section](resource-properties/tests).

You can also write your own custom schema tests to use in your dbt project — check out the [guide](custom-schema-tests) for more information.

:::info
We've open sourced some useful schema tests in [dbt-utils](https://hub.getdbt.com/fishtown-analytics/dbt_utils/latest/) — skip ahead to the docs on [packages](package-management) to learn more!
:::

### Example
To add a schema test to your project:

1. Add a `.yml` file to your `models` directory, e.g. `models/schema.yml`, with the following content (you may need to adjust the `name:` values for an existing model)

<File name='models/schema.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null

```

</File>

2. Run the [`dbt test` command](commands/test):

```
$ dbt test

Found 3 models, 2 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 0 sources

17:31:05 | Concurrency: 1 threads (target='learn')
17:31:05 |
17:31:05 | 1 of 2 START test not_null_order_order_id..................... [RUN]
17:31:06 | 1 of 2 PASS not_null_order_order_id........................... [PASS in 0.99s]
17:31:06 | 2 of 2 START test unique_order_order_id....................... [RUN]
17:31:07 | 2 of 2 PASS unique_order_order_id............................. [PASS in 0.79s]
17:31:07 |
17:31:07 | Finished running 2 tests in 7.17s.

Completed successfully

Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2

```
3. Check out the SQL dbt is running by either:
   * **dbt Cloud:** checking the Details tab.
   * **dbt CLI:** checking the `target/compiled` directory


**Unique test**
<Tabs
  defaultValue="compiled"
  values={[
    {label: 'Compiled SQL', value: 'compiled'},
    {label: 'Templated SQL', value: 'templated'},
  ]}>
  <TabItem value="compiled">

```sql
select count(*) as validation_errors
from (

    select
        order_id

    from analytics.orders
    where order_id is not null
    group by order_id
    having count(*) > 1

) validation_errors

```

  </TabItem>
  <TabItem value="templated">

```sql
select count(*) as validation_errors
from (

    select
        {{ column_name }}

    from {{ model }}
    where {{ column_name }} is not null
    group by {{ column_name }}
    having count(*) > 1

) validation_errors


```

  </TabItem>
</Tabs>

**Not null test**

<Tabs
  defaultValue="compiled"
  values={[
    {label: 'Compiled SQL', value: 'compiled'},
    {label: 'Templated SQL', value: 'templated'},
  ]}>
  <TabItem value="compiled">

```sql
select
    count(*) as validation_errors
from analytics.orders
where order_id is null

```

  </TabItem>
  <TabItem value="templated">

```sql
select
    count(*) as validation_errors
from {{ model }}
where {{ column_name }} is null

```

  </TabItem>
</Tabs>



## Data tests
A data test is a `select` statement that returns `0` records when the test is successful. Note: this differs from schema tests that return the number `0`.

Data tests are defined in `.sql` files, typically in your `tests` directory. Each `.sql` file contains one data test / one `select` statement:

<File name='test/assert_total_payment_amount_is_positive.sql'>

```sql
-- Refunds have a negative amount, so the total amount should always be >= 0.
-- Therefore return records where this isn't true to make the test fail
select
    order_id,
    sum(amount) as total_amount
from {{ ref('fct_payments' )}}
group by 1
having not(total_amount >= 0)

```

</File>


Data tests are also run by the `dbt test` command. To _only_ run data tests, run `dbt test --data`.


## FAQs


<FAQ src="test-one-model" />
<FAQ src="failed-tests" />
<FAQ src="recommended-tests" />
<FAQ src="when-to-test" />
<FAQ src="records-from-failed-tests" />
<FAQ src="configurable-data-test-path" />
<FAQ src="test-sources" />
<FAQ src="custom-test-thresholds" />
<FAQ src="uniqueness-two-columns" />

<!--
Additional FAQs that need Discourse articles:
- How can I run my tests before a model is created?
-->
