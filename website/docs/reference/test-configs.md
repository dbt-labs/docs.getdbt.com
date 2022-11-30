---
title: Test configurations
---

## Related documentation

* [Tests](/docs/build/tests)

<Changelog>

* `v0.20.0`: Introduced the ability to configure tests from `dbt_project.yml`, and to configure `enabled` for generic tests. Introduced `fail_calc`, `where`, `error_if`, `warn_if`, `store_failures`, and `where` configs.
* `v0.21.0`: Introduced the `config()` dictionary, making it easier and clearer to configure specific instances of generic tests


</Changelog>

Tests can be configured in a few different ways:
1. Properties within `.yml` definition (generic tests only, see [test properties](resource-properties/tests) for full syntax)
2. A `config()` block within the test's SQL definition
3. In `dbt_project.yml`

Test configs are applied hierarchically, in the order of specifity outlined above. In the case of a singular test, the `config()` block within the SQL definition takes precedence over configs in the project file. In the case of a specific instance of a generic test, the test's `.yml` properties would take precedence over any values set in its generic SQL definition's `config()`, which in turn would take precedence over values set in `dbt_project.yml`.

## Available configurations

Click the link on each configuration option to read more about what it can do.

### Test-specific configurations

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Config block', value: 'config', },
    { label: 'Property file', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
tests:
  [<resource-path>](resource-path):
    [+](plus-prefix)[fail_calc](fail_calc): <string>
    [+](plus-prefix)[limit](limit): <integer>
    [+](plus-prefix)[severity](severity): error | warn
    [+](plus-prefix)[error_if](severity): <string>
    [+](plus-prefix)[warn_if](severity): <string>
    [+](plus-prefix)[store_failures](store_failures): true | false
    [+](plus-prefix)[where](where): <string>

```

</File>

</TabItem>


<TabItem value="config">

```jinja

{{ config(
    [fail_calc](fail_calc) = "<string>",
    [limit](limit) = <integer>,
    [severity](severity) = "error | warn",
    [error_if](severity) = "<string>",
    [warn_if](severity) = "<string>",
    [store_failures](store_failures) = true | false,
    [where](where) = "<string>"
) }}

```


</TabItem>

<TabItem value="property-yaml">

```yaml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](resource-properties/config):
            [fail_calc](fail_calc): <string>
            [limit](limit): <integer>
            [severity](severity): error | warn
            [error_if](severity): <string>
            [warn_if](severity): <string>
            [store_failures](store_failures): true | false
            [where](where): <string>

    [columns](columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](resource-properties/config):
                [fail_calc](fail_calc): <string>
                [limit](limit): <integer>
                [severity](severity): error | warn
                [error_if](severity): <string>
                [warn_if](severity): <string>
                [store_failures](store_failures): true | false
                [where](where): <string>
```

This configuration mechanism is supported for specific instances of generic tests only. To configure a specific singular test, you should use the `config()` macro in its SQL definition.


</TabItem>

</Tabs>


### General configurations

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Config block', value: 'config', },
    { label: 'Property file', value: 'property-yaml', },
  ]
}>
<TabItem value="project-yaml">


<File name='dbt_project.yml'>

```yaml
tests:
  [<resource-path>](resource-path):
    [+](plus-prefix)[enabled](enabled): true | false
    [+](plus-prefix)[tags](resource-configs/tags): <string> | [<string>]
    [+](plus-prefix)[meta](resource-configs/meta): {dictionary}
    # relevant for [store_failures](resource-configs/store_failures) only
    [+](plus-prefix)[database](resource-configs/database): <string>
    [+](plus-prefix)[schema](resource-configs/schema): <string>
    [+](plus-prefix)[alias](resource-configs/alias): <string>
```
</File>

</TabItem>

<TabItem value="config">


```jinja

{{ config(
    [enabled](enabled)=true | false,
    [tags](resource-configs/tags)="<string>" | ["<string>"]
    [meta](resource-configs/meta)={dictionary},
    [database](resource-configs/database)="<string>",
    [schema](resource-configs/schema)="<string>",
    [alias](resource-configs/alias)="<string>",
) }}

```

</TabItem>

<TabItem value="property-yaml">

```yaml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](resource-properties/config):
            [enabled](enabled): true | false
            [tags](resource-configs/tags): <string> | [<string>]
            [meta](resource-configs/meta): {dictionary}
            # relevant for [store_failures](resource-configs/store_failures) only
            [database](resource-configs/database): <string>
            [schema](resource-configs/schema): <string>
            [alias](resource-configs/alias): <string>

    [columns](columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](resource-properties/config):
                [enabled](enabled): true | false
                [tags](resource-configs/tags): <string> | [<string>]
                [meta](resource-configs/meta): {dictionary}
                # relevant for [store_failures](resource-configs/store_failures) only
                [database](resource-configs/database): <string>
                [schema](resource-configs/schema): <string>
                [alias](resource-configs/alias): <string>
```

This configuration mechanism is supported for specific instances of generic tests only. To configure a specific singular test, you should use the `config()` macro in its SQL definition.


</TabItem>


</Tabs>

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

If a singular test:

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
