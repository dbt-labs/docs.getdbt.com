---
title: Data test configurations
description: "Read this guide to learn about using data test configurations in dbt."
meta:
  resource_type: Data tests
---
import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';


## Related documentation

* [Data tests](/docs/build/data-tests)

Data tests can be configured in a few different ways:
1. Properties within `.yml` definition (generic tests only, see [test properties](/reference/resource-properties/data-tests) for full syntax)
2. A `config()` block within the test's SQL definition
3. In `dbt_project.yml`

Data test configs are applied hierarchically, in the order of specificity outlined above. In the case of a singular test, the `config()` block within the SQL definition takes precedence over configs in the project file. In the case of a specific instance of a generic test, the test's `.yml` properties would take precedence over any values set in its generic SQL definition's `config()`, which in turn would take precedence over values set in `dbt_project.yml`.

## Available configurations

Click the link on each configuration option to read more about what it can do.

### Data test-specific configurations

<ConfigResource meta={frontMatter.meta} />

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
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[fail_calc](/reference/resource-configs/fail_calc): <string>
    [+](/reference/resource-configs/plus-prefix)[limit](/reference/resource-configs/limit): <integer>
    [+](/reference/resource-configs/plus-prefix)[severity](/reference/resource-configs/severity): error | warn
    [+](/reference/resource-configs/plus-prefix)[error_if](/reference/resource-configs/severity): <string>
    [+](/reference/resource-configs/plus-prefix)[warn_if](/reference/resource-configs/severity): <string>
    [+](/reference/resource-configs/plus-prefix)[store_failures](/reference/resource-configs/store_failures): true | false
    [+](/reference/resource-configs/plus-prefix)[where](/reference/resource-configs/where): <string>

```

</File>

</TabItem>


<TabItem value="config">

```jinja

{{ config(
    [fail_calc](/reference/resource-configs/fail_calc) = "<string>",
    [limit](/reference/resource-configs/limit) = <integer>,
    [severity](/reference/resource-configs/severity) = "error | warn",
    [error_if](/reference/resource-configs/severity) = "<string>",
    [warn_if](/reference/resource-configs/severity) = "<string>",
    [store_failures](/reference/resource-configs/store_failures) = true | false,
    [where](/reference/resource-configs/where) = "<string>"
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
          [config](/reference/resource-properties/config):
            [fail_calc](/reference/resource-configs/fail_calc): <string>
            [limit](/reference/resource-configs/limit): <integer>
            [severity](/reference/resource-configs/severity): error | warn
            [error_if](/reference/resource-configs/severity): <string>
            [warn_if](/reference/resource-configs/severity): <string>
            [store_failures](/reference/resource-configs/store_failures): true | false
            [where](/reference/resource-configs/where): <string>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [fail_calc](/reference/resource-configs/fail_calc): <string>
                [limit](/reference/resource-configs/limit): <integer>
                [severity](/reference/resource-configs/severity): error | warn
                [error_if](/reference/resource-configs/severity): <string>
                [warn_if](/reference/resource-configs/severity): <string>
                [store_failures](/reference/resource-configs/store_failures): true | false
                [where](/reference/resource-configs/where): <string>
```

This configuration mechanism is supported for specific instances of generic tests only. To configure a specific singular test, you should use the `config()` macro in its SQL definition.


</TabItem>

</Tabs>


### General configurations

<ConfigGeneral />

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
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {dictionary}
    # relevant for [store_failures](/reference/resource-configs/store_failures) only
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
```
</File>

</TabItem>

<TabItem value="config">


```jinja

{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"]
    [meta](/reference/resource-configs/meta)={dictionary},
    [database](/reference/resource-configs/database)="<string>",
    [schema](/reference/resource-properties/schema)="<string>",
    [alias](/reference/resource-configs/alias)="<string>",
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
          [config](/reference/resource-properties/config):
            [enabled](/reference/resource-configs/enabled): true | false
            [tags](/reference/resource-configs/tags): <string> | [<string>]
            [meta](/reference/resource-configs/meta): {dictionary}
            # relevant for [store_failures](/reference/resource-configs/store_failures) only
            [database](/reference/resource-configs/database): <string>
            [schema](/reference/resource-properties/schema): <string>
            [alias](/reference/resource-configs/alias): <string>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [enabled](/reference/resource-configs/enabled): true | false
                [tags](/reference/resource-configs/tags): <string> | [<string>]
                [meta](/reference/resource-configs/meta): {dictionary}
                # relevant for [store_failures](/reference/resource-configs/store_failures) only
                [database](/reference/resource-configs/database): <string>
                [schema](/reference/resource-properties/schema): <string>
                [alias](/reference/resource-configs/alias): <string>
```

This configuration mechanism is supported for specific instances of generic data tests only. To configure a specific singular test, you should use the `config()` macro in its SQL definition.


</TabItem>


</Tabs>

### Examples

#### Add a tag to one test

If a specific instance of a generic data test:

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

If a singular data test:

<File name='tests/<filename>.sql'>

```sql
{{ config(tags = ['my_tag']) }}

select ...
```

</File>

#### Set the default severity for all instances of a generic data test

<File name='macros/<filename>.sql'>

```sql
{% test my_test() %}

    {{ config(severity = 'warn') }}

    select ...

{% endtest %}
```

</File>

#### Disable alldata tests from a package

<File name='dbt_project.yml'>

```yml
tests:
  package_name:
    +enabled: false
```

</File>
