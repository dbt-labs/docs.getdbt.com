---
title: "Writing custom generic tests"
id: "writing-custom-generic-tests"
description: Learn how to define your own custom generic tests.
displayText: Writing custom generic tests
hoverSnippet: Learn how to define your own custom generic tests.
---

dbt ships with [Not Null](/reference/resource-properties/data-tests#not-null), [Unique](/reference/resource-properties/data-tests#unique), [Relationships](/reference/resource-properties/data-tests#relationships), and [Accepted Values](/reference/resource-properties/data-tests#accepted-values) generic tests. (These used to be called "schema tests," and you'll still see that name in some places.) Under the hood, these generic tests are defined as `test` blocks (like macros) in a globally accessible dbt project. You can find the source code for these tests in the [global project](https://github.com/dbt-labs/dbt-core/tree/main/core/dbt/include/global_project/macros/generic_test_sql).

:::info
There are tons of generic data tests defined in open source packages, such as [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) and [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) — the test you're looking for might already be here!
:::

### Generic tests with standard arguments

Generic tests are defined in SQL files. Those files can live in two places:
- `tests/generic/`: that is, a special subfolder named `generic` within your [test paths](/reference/project-configs/test-paths) (`tests/` by default)
- `macros/`: Why? Generic tests work a lot like macros, and historically, this was the only place they could be defined. If your generic test depends on complex macro logic, you may find it more convenient to define the macros and the generic test in the same file.

To define your own generic tests, simply create a `test` block called `<test_name>`. All generic tests should accept one or both of the standard arguments:
- `model`: The resource on which the test is defined, templated out to its relation name. (Note that the argument is always named `model`, even when the resource is a source, seed, or snapshot.)
- `column_name`: The column on which the test is defined. Not all generic tests operate on the column level, but if they do, they should accept `column_name` as an argument.

Here's an example of an `is_even` schema test that uses both arguments:

<File name='tests/generic/test_is_even.sql'>

```sql
{% test is_even(model, column_name) %}

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

select *
from validation_errors

{% endtest %}
```

</File>

If this `select` statement returns zero records, then every record in the supplied `model` argument is even! If a nonzero number of records is returned instead, then at least one record in `model` is odd, and the test has failed.

To use this generic test, specify it by name in the `tests` property of a model, source, snapshot, or seed:

<File name='models/<filename>.yml'>

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

With one line of code, you've just created a test! In this example, `users` will be passed to the `is_even` test as the `model` argument, and `favorite_number` will be passed in as the `column_name` argument. You could add the same line for other columns, other models—each will add a new test to your project, _using the same generic test definition_.


### Generic tests with additional arguments

The `is_even` test works without needing to specify any additional arguments. Other tests, like `relationships`, require more than just `model` and `column_name`. If your custom tests requires more than the standard arguments, include those arguments in the test signature, as `field` and `to` are included below:

<File name='tests/generic/test_relationships.sql'>

```sql
{% test relationships(model, column_name, field, to) %}

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

select *
from child
where id is not null
  and id not in (select id from parent)

{% endtest %}
```

</File>

When calling this test from a `.yml` file, supply the arguments to the test in a dictionary. Note that the standard arguments (`model` and `column_name`) are provided by the context, so you do not need to define them again.

<File name='models/<filename>.yml'>

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

### Generic tests with default config values

It is possible to include a `config()` block in a generic test definition. Values set there will set defaults for all specific instances of that generic test, unless overridden within the specific instance's `.yml` properties.

<File name='tests/generic/warn_if_odd.sql'>

```sql
{% test warn_if_odd(model, column_name) %}

    {{ config(severity = 'warn') }}

    select *
    from {{ model }}
    where ({{ column_name }} % 2) = 1

{% endtest %}
```

Any time the `warn_if_odd` test is used, it will _always_ have warning-level severity, unless the specific test overrides that value:

</File>

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: users
    columns:
      - name: favorite_number
        tests:
      	  - warn_if_odd         # default 'warn'
      - name: other_number
        tests:
          - warn_if_odd:
              severity: error   # overrides
```

</File>

### Customizing dbt's built-in tests

To change the way a built-in generic test works—whether to add additional parameters, re-write the SQL, or for any other reason—you simply add a test block named `<test_name>` to your own project. dbt will favor your version over the global implementation!

<File name='tests/generic/<filename>.sql'>

```sql
{% test unique(model, column_name) %}

    -- whatever SQL you'd like!

{% endtest %}
```

</File>

### Examples

Here's some additional examples of custom generic ("schema") tests from the community:
* [Creating a custom schema test with an error threshold](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966)
* [Using custom schema tests to only run tests in production](https://discourse.getdbt.com/t/conditionally-running-dbt-tests-only-running-dbt-tests-in-production/322)
* [Additional examples of custom schema tests](https://discourse.getdbt.com/t/examples-of-custom-schema-tests/181)
