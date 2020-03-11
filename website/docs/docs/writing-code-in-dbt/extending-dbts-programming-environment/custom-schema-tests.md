---
title: "Custom schema tests"
id: "custom-schema-tests"
---

dbt ships with [Not Null](testing#not-null), [Unique](testing#unique), [Relationships](testing#relationships), and [Accepted Values](testing#accepted-values) schema tests. Under the hood, these schema tests are defined as macros in a globally accessible dbt project. You can find the source code for these tests [here](https://github.com/fishtown-analytics/dbt/tree/development/dbt/include/global_project/macros/schema_tests).

## Schema Tests with One Argument

To define your own schema tests, simply create a macro called `test_{test_name}`. Here's an example of an `is_even` schema test:

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

<Callout type="info" title="ProTip">

Run `dbt test --model users` to run only the tests defined for the `users` model.

</Callout>

## Schema Tests with More Than One Argument

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
