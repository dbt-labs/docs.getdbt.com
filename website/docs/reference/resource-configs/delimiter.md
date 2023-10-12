---
resource_types: [seeds]
datatype: <string>
default_value: ","
---

## Definition

An optional seed configuration used to separate values in a [seed](/docs/build/seeds) with a string you provide. The delimiter defaults to comma.


## Usage
Specify delimiter in your `dbt_project.yml` file to globally separate all seed values:

<File name='dbt_project.yml'>

```yml
seeds:
  +quote_columns: False
  +delimiter: ","
```

</File>


Or:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  quote_columns: False
  delimiter: ","
```

</File>

## Examples
For a project with:

* `name: jaffle_shop` in the `dbt_project.yml` file
* `seed-paths: ["seeds"]` in the `dbt_project.yml` file

### Use a comma delimiter
<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # you must include the project name
    mappings:
      +delimiter: ","
```

</File>

Or

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: mappings
    config:
      delimiter: ","
```

</File>

## Recommended configuration

* Explicitly set this value if using seed files.
* The `delimiter` configuration should contain a value and not be empty.
