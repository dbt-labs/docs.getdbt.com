---
resource_types: [seeds]
datatype: <string>
default_value: ","
---

## Definition

An optional seed configuration used to separate values in a [seed](/docs/build/seeds) with a string you provide.


* The delimiter defaults to a comma when not speicfied.
* Explicitly set The `delimiter` configuration value if you want seed files to use a different delimiter, such as "|" or ";" (default is comma).

  
## Usage

Specify a custom delimiter in your `dbt_project.yml` file to override the global separator for all seed values:

<File name='dbt_project.yml'>

```yml
seeds:
  +quote_columns: False
  +delimiter: ";"
```

</File>


Or use a custom delimiter to overrid the values for a specific seed:

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

### Use a custom delimiter

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: 
    +delimiter: "|"
    mappings:
      +delimiter: ";"
```

</File>

Or

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: mappings
    config:
      delimiter: "|"
```

</File>
