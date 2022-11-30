---
title: "YAML Selectors"
---

<Changelog>

- **v0.18.0**: Introduced YAML selectors
- **v0.19.0**: Added optional `description` property. Selectors appear in `manifest.json` under a new `selectors` key.
- **v0.21.0**: Added optional `default` + `greedy` properties

</Changelog>

Write resource selectors in YAML, save them with a human-friendly name, and reference them using the `--selector` flag.
By recording selectors in a top-level `selectors.yml` file:

* **Legibility:** complex selection criteria are composed of dictionaries and arrays
* **Version control:** selector definitions are stored in the same git repository as the dbt project
* **Reusability:** selectors can be referenced in multiple job definitions, and their definitions are extensible (via YAML anchors)

Selectors live in a top-level file named `selectors.yml`. Each must have a `name` and a `definition`, and can optionally define a `description` and [`default` flag](#default).

<File name='selectors.yml'>

```yml
selectors:
  - name: nodes_to_joy
    definition: ...
  - name: nodes_to_a_grecian_urn
    description: Attic shape with a fair attitude
    default: true
    definition: ...
```
</File>

## Definitions

Each `definition` is comprised of one or more arguments, which can be one of the following:
* **CLI-style:** strings, representing CLI-style arguments
* **Key-value:** pairs in the form `method: value`
* **Full YAML:** fully specified dictionaries with items for `method`, `value`, operator-equivalent keywords, and support for `exclude`

Use `union` and `intersection` to organize multiple arguments.

### CLI-style
```yml
definition:
  'tag:nightly'
```

This simple syntax supports use of the `+`, `@`, and `*` operators. It does
not support `exclude`.

### Key-value
```yml
definition:
  tag: nightly
```

This simple syntax does not support any operators or `exclude`.

### Full YAML

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
  
  indirect_selection: eager | cautious  # include all tests selected indirectly? eager by default
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
where we can only pass one "yeslist" (`--select`) and one "nolist" (`--exclude`).

#### Indirect selection

As a general rule, dbt will indirectly select _all_ tests if they touch _any_ resource that you're selecting directly. We call this "eager" indirect selection. You can optionally switch the indirect selection mode to "cautious" by setting `indirect_selection` for a specific criterion:

```yml
- union:
    - method: fqn
      value: model_a
      indirect_selection: eager  # default: will include all tests that touch model_a
    - method: fqn
      value: model_b
      indirect_selection: cautious  # will not include tests touching model_b
                        # if they have other unselected parents
```

If provided, a yaml selector's `indirect_selection` value will take precedence over the CLI flag `--indirect-selection`. Because `indirect_selection` is defined separately for _each_ selection criterion, it's possible to mix eager/cautious modes within the same definition, to achieve the exact behavior that you need. Remember that you can always test out your critiera with `dbt ls --selector`.

See [test selection examples](test-selection-examples) for more details about indirect selection.

## Example

Here are two ways to represent:

<VersionBlock firstVersion="0.21">

  ```bash
  $ dbt run --select @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
  ```

</VersionBlock>
<VersionBlock lastVersion="0.20">

  ```bash
  $ dbt run --models @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
  ```

</VersionBlock>

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
    description: "Non-incremental Snowplow models that power nightly exports"
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
    description: "Non-incremental Snowplow models that power nightly exports"
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

## Default

Starting in v0.21, selectors may define a boolean `default` property. If a selector has `default: true`, dbt will use this selector's criteria when tasks do not define their own selection criteria.

Let's say we define a default selector that only selects resources defined in our root project:
```yml
selectors:
  - name: root_project_only
    description: >
        Only resources from the root project.
        Excludes resources defined in installed packages.
    default: true
    definition:
      method: package
      value: <my_root_project_name>
```

If I run an "unqualified" command, dbt will use the selection criteria defined in `root_project_only`—that is, dbt will only build / freshness check / generate compiled SQL for resources defined in my root project.
```
$ dbt build
$ dbt source freshness
$ dbt docs generate
```

If I run a command that defines its own selection criteria (via `--select`, `--exclude`, or `--selector`), dbt will ignore the default selector and use the flag criteria instead. It will not try to combine the two.
```
$ dbt run --select  model_a
$ dbt run --exclude model_a
```

Only one selector may set `default: true` for a given invocation; otherwise, dbt will return an error. You may use a Jinja expression to adjust the value of `default` depending on the environment, however:

```yml
selectors:
  - name: default_for_dev
    default: "{{ target.name == 'dev' | as_bool }}"
    definition: ...
  - name: default_for_prod
    default: "{{ target.name == 'prod' | as_bool }}"
    definition: ...
```

<VersionBlock firstVersion="1.2">

### Selector inheritance

Selectors can reuse and extend definitions from other selectors, via the `selector` method.

```yml
selectors:
  - name: foo_and_bar
    definition:
      intersection:
        - tag: foo
        - tag: bar

  - name: foo_bar_less_buzz
    definition:
      intersection:
        # reuse the definition from above
        - method: selector
          value: foo_and_bar
        # with a modification!
        - exclude:
            - method: tag
              value: buzz
```

</VersionBlock>
