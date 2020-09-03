---
title: "YAML Selectors"
---

<Changelog>New in v0.18.0</Changelog>

:::info [β] Beta Feature
This is net-new functionality in v0.18.0, with iterative improvements to come.
If you encounter unexpected behavior, please post in Slack or open an issue.
:::

Write model selectors in YAML, save them with a human-friendly name, and reference them using the `--selector` flag.
By recording selectors in a top-level `selectors.yml` file:

* **Legibility:** complex selection criteria are composed of dictionaries and arrays
* **Version control:** selector definitions are stored in the same git repository as the dbt project
* **Reusability:** selectors can be referenced in multiple job definitions, and their definitions are extensible (via YAML anchors)

Selectors live in a top-level file named `selectors.yml`. Each has a `name` and a `definition`:

<File name='selectors.yml'>

```yml
selectors:
  - name: nodes_to_joy
    definition: ...
  - name: nodes_to_a_grecian_urn
    definition: ...
```
</File>

Each `definition` is comprised of one or more arguments, which can be one of the following:
* **CLI-style:** strings, representing CLI-style) arguments
* **Key-value:** pairs in the form `method: value`
* **Full YAML:** fully specified dictionaries with items for `method`, `value`, operator-equivalent keywords, and support for `exclude`
    
Use `union` and `intersection` to organize multiple arguments.

#### CLI-style
```yml
definition:
  'tag:nightly'
```

This simple syntax supports use of the `+`, `@`, and `*` operators. It does
not support `exclude`.

#### Key-value
```yml
definition:
  tag: nightly
```

This simple syntax does not support any operators or `exclude`.

#### Full YAML

This is the most thorough syntax, which can include graph and set operators.

```yml
definition:
  method: tag
  value: nightly

  # Optional keywords map to the `+` and `@` operators:

  children: true | false
  parents: true | false

  children_depth: 1    # if children: true, degrees to include
  parents_depth: 1     # if parents: true, degrees to include

  childrens_parents: true | false     # @ operator
```

The `*` operator to select all nodes can be written as:
```yml
definition:
  method: fqn
  value: "*"
```

#### Exclude

The `exclude` keyword is only supported by fully-qualified dictionaries. 
It may be passed as an argument to each dictionary, or as
an item in a `union`. The following are equivalent:

```yml
- method: tag
  value: nightly
  exclude:
    - "@tag:daily"
```

```yml
- union:
    - method: tag
      value: nightly
    - exclude:
       - method: tag
         value: daily
```

Note: The `exclude` argument in YAML selectors is subtly different from
the `--exclude` CLI argument. Here, `exclude` _always_ returns a [set difference](https://en.wikipedia.org/wiki/Complement_(set_theory)), 
and it is always applied _last_ within its scope.

This gets us more intricate subset definitions than what's available on the CLI,
where we can only pass one "yeslist" (`--models`, `--select`) and one "nolist" (`--exclude`).

### Example

Here are two ways to represent:
```
$ dbt run --models @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
```

<Tabs
  defaultValue="cli_style"
  values={[
    { label: 'CLI-style', value: 'cli_style', },
    { label: 'Full YML', value: 'all_yml', },
  ]
}>

<TabItem value="cli_style">
<File name='selectors.yml'>

```yml
selectors:
  - name: nightly_diet_snowplow
    definition:
      union:
        - intersection:
            - '@source:snowplow'
            - 'tag:nightly'
        - 'models/export'
        - exclude:
            - intersection:
                - 'package:snowplow'
                - 'config.materialized:incremental'
            - export_performance_timing
```
</File>
</TabItem>

<TabItem value="all_yml">
<File name='selectors.yml'>

```yml
selectors:
  - name: nightly_diet_snowplow
    definition:
      union:
        - intersection:
            - method: source
              value: snowplow
              childrens_parents: true
            - method: tag
              value: nightly
        - method: path
          value: models/export
        - exclude:
            - intersection:
                - method: package
                  value: snowplow
                - method: config.materialized
                  value: incremental
            - method: fqn
              value: export_performance_timing
```
</File>
</TabItem>

</Tabs>

Then in our job definition:
```bash
$ dbt run --selector nightly_diet_snowplow
```