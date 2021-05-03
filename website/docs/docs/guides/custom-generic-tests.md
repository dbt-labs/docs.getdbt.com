---
title: "Writing custom generic tests"
id: "writing-custom-generic-tests"
---

<Changelog>

* `v0.20.0`: Generic tests (f.k.a. schema tests) are defined using `test` blocks instead of macros prefixed `test_`. They return a number of failing rows, rather than a single numeric value.

</Changelog>

dbt ships with [Not Null](resource-properties/tests#not-null), [Unique](resource-properties/tests#unique), [Relationships](resource-properties/tests#relationships), and [Accepted Values](resource-properties/tests#accepted-values) generic tests. (These used to be called "schema tests," and they still are in some places.) Under the hood, these generic tests are defined as `test` blocks (like macros) in a globally accessible dbt project. You can find the source code for these tests [here](https://github.com/fishtown-analytics/dbt/tree/develop/core/dbt/include/global_project/macros/schema_tests).

:::info
There are tons of generic tests defined in open source packages, such as [dbt-utils](https://hub.getdbt.com/fishtown-analytics/dbt_utils/latest/) and [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) — the test you're looking for might already be here!
:::

### Generic tests with standard arguments

To define your own generic tests, simply create a `test` block called `<test_name>`. All generic tests should accept one or both of the standard arguments:
- `model`: The resource on which the test is defined, templated out to its relation name. (Note that the argument is always called `model`, even when the resource is a source, seed, or snapshot.)
- `column_name`: The column on which the test is defined. Not all generic tests operate on the column level, but if they do, they should accept `column_name` as an argument.

Here's an example of an `is_even` schema test that uses both arguments:

<File name='macros/test_is_even.sql'>

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

In the above example, `users` will be passed to the `is_even` test as the `model` argument, and `favorite_number` will be passed in as the `column_name` argument.


### Generic tests with additional arguments

The above test, `is_even` works if only one argument needs to be specified. Other tests, like `relationships`, require more than one argument. If your custom tests requires more than the standard argument, include those arguments in the test signature:

<File name='macros/test_relationships.sql'>

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

{% endmacro %}
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

<File name='macros/warn_if_null.sql'>

```sql
{% test warn_if_odd(model, column_name) %}

    {{ config(severity = 'warn') }}

    select *
    from {{ model }}
    where ({{ column_name }} % 2) = 1

{% endtest %}
```

</File>

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: users
    columns:
      - name: favorite_number
        tests:
      	  - is_even  # will use default 'warn' config value set in generic test definition
      - name: other_number
        tests:
          - is_even:
              severity: error   # overrides value set in generic test definition
```

</File>

### Customizing dbt's built-in tests

To change the way a built-in test works (for example, to add additional parameters, or re-write the SQL), add a test block named `<test_name>` (e.g. `{% test unique() %}`) to your project — dbt will favor your version over the global implementation!

### Examples

Here's some additional examples of custom generic ("schema") tests from the community:
* [Creating a custom schema test with an error threshold](https://discourse.getdbt.com/t/creating-an-error-threshold-for-schema-tests/966)
* [Using custom schema tests to only run tests in production](https://discourse.getdbt.com/t/conditionally-running-dbt-tests-only-running-dbt-tests-in-production/32)
* [Additional examples of custom schema tests](https://discourse.getdbt.com/t/examples-of-custom-schema-tests/181)
