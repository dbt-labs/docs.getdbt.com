---
title: "Testing"
id: "testing"
---

## Overview

dbt models are only useful if they're correct. It's typical to spend some time after building or updating a model validating that it works how you expect. This process might also involve testing *other* models, ensuring that you didn't accidentally make a change that has deleterious effects on downstream models. This process is both time consuming and error prone, and it's easy to get lazy with manual testing.

To this end, dbt makes it easy to define automated tests on your models. After writing these tests once, you can quickly run them when developing locally, or in production on an ongoing basis. By testing your models, you can build confidence in their correctness and avoid costly regressions down the line.

<Callout type="info" title="Tests are gifts you send to your future self">

Testing is an essential part of a [mature analytics workflow](viewpoint#quality-assurance). It only takes a minute to set up a test -- your future self will thank you!

</Callout>

dbt provides two different mechanisms for data validation: schema tests and custom data tests.

## Schema Tests

Schema tests are assertions that a model's schema adheres to basic rules: referential integrity, uniqueness, and nullity, for instance. Modern data warehouses don't enforce these rules, but they're still _incredibly_ useful tools for reasoning about and validating data in a database.

### Executing Tests
This guide explains the different types of tests built into dbt and demonstrates how to use them. For information on running tests like these, check out the [dbt test](test) command reference.

### Writing Schema Tests
Schema tests are declared in a [schema.yml file](declaring-properties). dbt provides four types of schema tests out of the box. [Custom schema tests](custom-schema-tests) can also be created.

<Callout type="info" title="Pro Tip">

If you find yourself writing **repeating blocks** of YAML for your tests, use [anchor labels](https://stackoverflow.com/questions/8466223/reuse-a-block-of-code-in-yaml) to stay DRY.

</Callout>

## Built-in tests

### Not null

This test validates that there are no `null` values present in a column.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: id
        tests:
          - not_null
              
      - name: account_id
        tests:
          - not_null
              
      - name: status
        tests:
          - not_null
```

</File>

### Unique

This test validates that there are no duplicate values present in a field.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: id
        tests:
          - unique
```

</File>

### Relationships

This test validates that all of the records in a child table have a corresponding record in a parent table. This property is referred to as "referential integrity".

The following example tests that every person's `account_id` maps back to a valid `account`. 

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: account_id
        tests:
          - relationships:
              to: ref('accounts')
              field: id
```

</File>

The `to` argument accepts a [Relation](class-reference#relation) – this means you can pass it a `ref` to a model (e.g. `ref('accounts')`), or a ` source` (e.g. `source('payroll', 'accounts')`).

### Accepted values

This test validates that all of the values in a column are present in a supplied list of `values`. If any values other than those provided in the list are present, then the test will fail.

The `accepted_values` test supports an optional `quote` parameter which by default will single-quote the list of accepted values in the test query. To test non-strings (like integers or boolean values) explicitly set the `quote` config to `false`.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: status
        tests:
          - accepted_values:
              values: ['active', 'cancelled']
              
      - name: status_id
        tests:
          - accepted_values:
              values: [1, 2]
              quote: false
```

</File>

## Putting it all together

The tests above were shown in separate files for clarity, but in practice, they should all be combined into a single file. This combined `schema.yml` file would look like this:

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: id
        tests:
          - not_null
          - unique

      - name: account_id
        tests:
          - not_null:
              severity: warn
          - relationships:
              to: ref('accounts')
              field: id
              severity: error
            
      - name: status
        tests:
          - not_null
          - accepted_values:
              values: ['active', 'cancelled']
              severity: warn
```

</File>

## Testing complicated logic

### Testing Expressions

Sometimes, a constraint only holds for a combination of columns. For example, maybe the combination of `user_id` and `date` is unique, but neither column is unique in isolation.

To test expressions like this, specify the `tests` directive at the *model* level, and use a `column_name` key to define the expression,  as shown below.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    tests:
      - unique:
          column_name: "concat(date_day, user_id)"
      
      - not_null:
          column_name: "coalesce(status, new_status)"
      
      - accepted_values:
          column_name: "coalesce(status, new_status)"
          values: ['active', 'cancelled']
        
      - relationships:
          column_name: "coalesce(account_id, parent_account_id)"
          to: ref('accounts')
          field: id
```

</File>

It is recommended that users specify tests for as many constraints as can be reasonably identified in their database. This may result in a large number of total tests, but `schema.yml` makes it fast to create and modify these tests. The presence of tests like these can significantly increase the confidence in underlying data consistency in a database.

### Custom data tests

Not all error conditions can be expressed in a schema test. For this reason, dbt provides a mechanism for testing arbitrary assertions about your data. These data tests are sql `SELECT` statements that return 0 rows on success, or more than 0 rows on failure.

A typical data test might look like:

<File name='tests/assert_lt_5_pct_cookie_ids_are_null.sql'>

```sql
-- If >= 5% of cookie_ids are null, then the test returns 1 row (failure).
-- If < 5% of cookie_ids are null, then the test returns 0 rows (success)

with calc as (

    select
        case
            when cookie_id is null then 1
            else 0
        end as cookie_is_null
  
    from {{ ref('events') }}
  
),

agg as (
  
    select
        sum(cookie_is_null)::float / nullif(count(*), 0) as pct_null

    from calc

)

select *
from agg
where pct_null < 0.05
```

</File>

Another example would be asserting that a particular column on a certain row is what you expect:

<File name='tests/assert_payment_has_expected_amount.sql'>

```sql
with data as (
  
  select *
  from {{ ref('payment_items') }}
  where payment_id = 777
  
),

validation as (

  select *
  from data
  where amount != 120

)

select * from validation
```

</File>



<Callout type="info" title="Custom data tests and model selection syntax">

To run custom data tests for a particular model, use the [model selection syntax](model-selection-syntax):
`$ dbt test --data --models my_model`.

Note that dependencies between custom data tests and models are defined by using the [ref](ref) function in your data test, e.g. `from {{ ref('my_model') }}`.

</Callout>


### Enabling custom data tests

To enable data tests, add the `test-paths` config to your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yaml
test-paths: ["tests"]        # look for *.sql files in the "tests" directory
```

</File>

A full description of the options for `dbt test` can be found in the [command reference](test) section.

## Test Severity

<Callout type="info" title="New in v0.14.0">

Test severity is _new_ in dbt v0.14.0. For upgrading instructions, check out the [installation docs](installation).

</Callout>

The "severity" of a test can be configured by supplying the `severity` configuration option in the test specification. The `severity` option can be one of `warn` or `error`. If `warn` is supplied, then dbt will log a warning for any failing tests, but the test will still be considered passing. This configuration is useful for tests in which a failure does not imply that action is required.

If a `severity` level is not provided, then tests are run with the `error` severity level. The `severity` config can be applied to any test type, including [custom schema tests](custom-schema-tests).

### Schema test severity

The following example exercises both `warn` and `error` level severities in a `schema.yml` file.

<File name='models/schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: email
        tests:
          - not_null:
              severity: warn
          - unique:
              severity: error
```

</File>

### Custom data test severity

The severity for a custom data test can be configured using the `config` function:

<File name='tests/my_test.sql'>

```sql


{{ config(severity='warn') }}

select *
from ....
```

</File>

##  Running tests

Schema tests and custom data tests can be run with the `dbt test` command as shown below.

```shell
dbt test           # run schema + data tests
dbt test --schema  # run only schema tests
dbt test --data    # run only data tests
```
