---
title: "Writing custom schema tests"
id: "writing-custom-schema-tests"
---

dbt ships with [Not Null](resource-properties/tests#not-null), [Unique](resource-properties/tests#unique), [Relationships](resource-properties/tests#relationships), and [Accepted Values](resource-properties/tests#accepted-values) schema tests. Under the hood, these schema tests are defined as macros in a globally accessible dbt project. You can find the source code for these tests [here](https://github.com/fishtown-analytics/dbt/tree/develop/core/dbt/include/global_project/macros/schema_tests).

:::info
We've open sourced some useful custom schema tests in [dbt-utils](https://hub.getdbt.com/fishtown-analytics/dbt_utils/latest/) — the test you're looking for might already be here!
:::

## Schema tests with one argument

To define your own schema tests, simply create a macro called `test_<test_name>`. Here's an example of an `is_even` schema test:

<File name='macros/test_is_even.sql'>

```sql
{% macro test_is_even(model, column_name) %}

with validation as (

    select
        {{ column_name }} as even_field

    from {{ model }}

),

validation_errors as (

    select
        even_field

    from validation
    -- if this is true, then even_field is actually odd!
    where (even_field % 2) = 1

)

select count(*)
from validation_errors

{% endmacro %}
```

</File>

If this `select` statement returns a count of `0` records, then every record in the supplied `model` argument is even! If the returned `count` is greater than zero, then at least one record in `model` is odd, and the test has failed.

To use this test, add a test for the name of your macro, minus the `test_` prefix:

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: users
    columns:
      - name: favorite_number
        tests:
      	- is_even
```

</File>

In the above example, `users` will be passed to the `is_even` test as the `model` argument, and `favorite_number` will be passed in as the `column_name` argument.


## Schema tests with more than one argument

The above test, `is_even` works if only one argument needs to be specified. Other tests, like `relationships`, require more than one argument. If your custom tests requires more than one argument (besides `model`), define them like this:

<File name='macros/test_relationships.sql'>

```sql
{% macro test_relationships(model, field, to, column_name) %}

with parent as (

    select
        {{ field }} as id

    from {{ to }}

),

child as (

    select
        {{ column_name }} as id

    from {{ model }}

)

select count(*)
from child
where id is not null
  and id not in (select id from parent)

{% endmacro %}
```

</File>

When calling this test from a `schema.yml` file, supply the arguments to the test in a dictionary. Note that the `model` and `column_name` arguments will be provided for you:

<File name='models/schema.yml'>

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

## Customizing dbt's built-in tests

To change the way a built-in test works (for example, to add additional parameters, or re-write the SQL), add a macro named `test_<test_name>` (e.g. `test_unique`) to your project — dbt will favor your macro over the global implementation!

## Examples

Here's some additional examples of custom schema tests from the community:
* [Creating a custom schema test with an error threshold](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966)
* [Using custom schema tests to only run tests in production](https://discourse.getdbt.com/t/conditionally-running-dbt-tests-only-running-dbt-tests-in-production/32)
* [Additional examples of custom schema tests](https://discourse.getdbt.com/t/examples-of-custom-schema-tests/181)
