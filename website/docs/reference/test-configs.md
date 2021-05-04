---
title: Test configurations
---

## Related documentation
* [Tests](building-a-dbt-project/tests)

<Changelog>

* `v0.20.0`: Introduced the ability to configure tests from `dbt_project.yml`,
and to configure `enabled` for generic tests.

</Changelog>

Tests can be configured in a few different ways:
1. Properties within `.yml` definition (generic tests only, see [test properties](resource-properties/tests) for full syntax)
2. A `config()` block within the test's SQL definition
3. In `dbt_project.yml`

Test configs are applied hierarchically, in the order of specifity outlined above. In the case of a specific instance of a generic test, the test's `.yml` properties would take precedence over any values set in its generic SQL definition's `config()`, which in turn would take precedence over values set in `dbt_project.yml`.

<File name='tests/<filename>.sql'>

```jinja
{{
    config(
        [enabled](enabled) = true | false,
        [severity](resource-properties/tests#severity) = 'error' | 'warn',
        [tags](resource-configs/tags) = 'example_tag' | ['example_tag_1', 'example_tag_2']
    )
}}
```

</File>

<File name='dbt_project.yml'>

```yml
tests:
  [<resource-path>](resource-path):
    [+](plus-prefix)[enabled](enabled): true | false
    [+](plus-prefix)[severity](severity): error | warn
    [+](plus-prefix)[tags](resource-configs/tags): <string> | [<string>]
```

</File>

### Examples

#### Add a tag to one test

If a specific instance of a generic test:

<File name='models/<filename>.yml'>

```yml
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique:
              tags: ['my_tag']
```

</File>

If a bespoke test:

<File name='tests/<filename>.sql'>

```sql
{{ config(tags = ['my_tag']) }}

select ...
```

</File>

#### Set the default severity for all instances of a generic test

<File name='macros/<filename>.sql'>

```sql
{% test my_test() %}

    {{ config(severity = 'warn') }}

    select ...

{% endtest %}
```

</File>

#### Disable all tests from a package

<File name='dbt_project.yml'>

```yml
tests:
  package_name:
    +enabled: false
```

</File>
