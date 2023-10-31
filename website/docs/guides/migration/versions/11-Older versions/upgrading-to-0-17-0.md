---
title: "Upgrading to 0.17.0"
id: "upgrading-to-0-17-0"

---

dbt v0.17.0 makes compilation more consistent, improves performance, and fixes a number of bugs.

## Articles:

 - [Changelog](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/CHANGELOG.md)

## Notable changes

Please be aware of the following changes in 0.17.0 that may require a code update in your dbt project.

### A new dbt_project.yml config version

dbt v0.17.0 introduces a new config version for the `dbt_project.yml` file. This new config version changes the semantics of how dbt interprets the `dbt_project.yml` file.

#### Specifying a config version

A config version can be declared using the `config-version` key in the `dbt_project.yml` file:

```yml
name: my_project
version: 1.0.0

config-version: 2

models:
  ...
```

The accepted values for `config-version` are `1` and `2`. When the `config-version: 2` is used, some new functionality in dbt is unlocked.

#### Using config-version: 2

##### Better variable scoping semantics

Previous releases of dbt allowed variables (`vars:`) to be scoped to a folder level in the `models:` hierarchy. This presents a few problems:

- The vars should only _really_ be applied to _models_ (as the variable declaration lives in the `models:` config), but variables are also often referenced in tests, `schema.yml` files, macros, snapshots, and so on.
- There is an ambiguity in how variables are resolved in `schema.yml` files. Consider the case where a `schema.yml` file is scoped with one value for a variable, but the model it references is scoped with a different value for the same variable. The behavior of `var()` in this scenario is poorly defined, and often not what you would expect.

In version 2 of the `dbt_project.yml` config, vars must now be defined in a top-level `vars:` dictionary, eg:

<File name='dbt_project.yml'>

```yml
name: my_project
version: 1.0.0

config-version: 2

vars:
  my_var: 1
  another_var: true

models:
  ...
```

</File>


This syntax makes variable scoping unambiguous, as all of the nodes in a given package will receive the same value for a given variable. Note that this syntax _does_ still support package-level variable scoping. See the docs on the `dbt_project.yml` file syntax for more information.

##### Unambiguous resource configurations

Version 1 of the `dbt_project.yml` file spec allowed for ambiguous model configurations when dictionary configs were defined in a `models:` block. Consider:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    reporting:
      partition_by:
        field: date_day
        data_type: timestamp

```

</File>

This example is intended to configure a `partition_by` setting for all of the BigQuery models in the `models/reporting/` folder. From the syntax in this file alone though, there are two possible interpretations:

- Configure the `partition_by` value for models in the `models/reporting` folder
- Configure the `field` and `data_type` values for models in the `models/reporting/partition_by` folder

To resolve this ambiguity, configurations can now be supplied using the `+` syntax for config keys. For the example above, this would look like:

<File name='dbt_project.yml'>

```yml

models:
  my_project:
    reporting:
      +partition_by:
        field: date_day
        data_type: timestamp
```
</File>


This syntax unambiguously defines `partition_by` as a configuration with a dictionary value of `{field: date_day, data_type: timestamp}`. This `+` decorator can be used for _any_ configuration, and can be helpful if you have a folder name that collides with a known dbt project config key. Example:

<File name='dbt_project.yml'>

```yml
# Your model lives in models/materialized/my_model.sql

models:
  my_project:
    materialized:
      +materialized: table

```
</File>


This configuration will work in dbt v0.17.0 when `config-version: 2` is used, but was not possible to represent in previous versions of dbt.

##### Upgrading instructions

- Add `config-version: 2` to your `dbt_project.yml` file
- Ensure that all `vars:` declarations in your `dbt_project.yml` file have been moved to the top-level of the file
- Ensure that any packages that your project references are also declared with `config-version: 2`

Support for version 1 will be removed in a future release of dbt.

### NativeEnvironment rendering for YAML fields

In dbt v0.17.0, dbt enabled use of Jinja's Native Environment to render values in
YML files. This Native Environment coerces string values to their
primitive Python types (booleans, integers, floats, and tuples). With this
change, you can now provide boolean and integer values to configurations via
string-oriented inputs, like environment variables or command line variables.

:::danger Heads up

  In dbt v0.17.1, native rendering is not enabled by default. It is possible to
  natively render specific values using the [`as_bool`](/reference/dbt-jinja-functions/as_bool),
  [`as_number`](/reference/dbt-jinja-functions/as_number), and [`as_native`](/reference/dbt-jinja-functions/as_native) filters.

  The examples below have been updated to reflect 0.17.1 functionality.

:::

This example specifies a port number as an integer from an environment variable.
This was not possible in previous versions of dbt.

```yml

debug:
  target: dev
  outputs:
    dev:
      type: postgres
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASS') }}"
      host: "{{ env_var('DBT_HOST') }}"

      # The port number will be coerced from a string to an integer
      port: "{{ env_var('DBT_PORT') | as_number }}"

      dbname: analytics
      schema: analytics
```

Finally, you can now enable or disable models conditionally based on the
environment that dbt is running in. In this example, models in the `admin`
package will be disabled in dev. This was not possible in previous versions of
dbt.

<File name='dbt_project.yml'>

```yml
name: my_project
version: 1.0.0

config-version: 2

models:
  my_project:
    +enabled: true

  admin:
    +enabled: "{{ (target.name == 'prod') | as_bool }}"
```

</File>


### Accessing sources in the `graph` object

In previous versions of dbt, the `sources` in a dbt project could be accessed in the compilation context using the [graph.nodes](/reference/dbt-jinja-functions/graph) context variable. In dbt v0.17.0, these sources have been moved out of the `graph.nodes` dictionary and into a new `graph.sources` dictionary. This change is also reflected in the `manifest.json` artifact produced by dbt. If you are accessing these sources programmatically, please update any references from `graph.nodes` to `graph.sources` instead.

### BigQuery `locations` removed from Catalog

As a workaround for permission issues encountered by many dbt users, the `location` field has been removed from the Catalog generated by dbt. Accordingly, this field will no longer be visible in the auto-generated dbt documentation website. This field may be re-added in a future release of dbt.


### Macros no longer see variables defined outside of macro blocks

In previous versions of dbt, a variable could be declared outside of the macro scope, and referenced from any macros in the same file:

```jinja
{% set my_global = ['a', 'b', 'c'] %}
{% macro use_my_global() %}
    {% for value in my_global %}
        {% do log('value: ' ~ value) %}
    {% endfor %}
{% endmacro %}
```

This is now an error, because `my_global` is not visible to the macro `use_my_global`. To provide a globally-available value, use a macro that returns a constant value:

```jinja
{% macro get_my_global() %}
    {% do return(['a', 'b', 'c']) %}
{% endmacro %}
{% macro use_my_global() %}
    {% for value in get_my_global() %}
        {% do log('value: ' ~ value) %}
    {% endfor %}
{% endmacro %}
```

## Python requirements

If you are installing dbt in a Python environment alongside other Python
modules, please be mindful of the following changes to dbt's Python
dependencies:

Core:
- Pinned `Jinja2` depdendency to `2.11.2`
- Pinned `hologram` to `0.0.7`
- Require Python >= `3.6.3`

BigQuery:
- Require `protobuf>=3.6.0,<3.12`

## New and changed documentation

**Core**
- [`path:` selectors](/reference/node-selection/methods#the-path-method)
- [`--fail-fast`](/reference/commands/run#failing-fast)
- [as_text Jinja filter](/reference/dbt-jinja-functions/as_text)
- [accessing nodes in the `graph` object](/reference/dbt-jinja-functions/graph)
- [persist_docs](/reference/resource-configs/persist_docs)
- [source properties](reference/source-properties)
- [source overrides](/reference/resource-properties/overrides)

**BigQuery**
- [maximum_bytes_billed](/docs/core/connect-data-platform/bigquery-setup#maximum-bytes-billed)
