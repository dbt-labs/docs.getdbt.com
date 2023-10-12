---
resource_types: [seeds]
datatype: <string>
default_value: ","
---

## Definition

An optional seed configuration used to separate values in a [seed](/docs/build/seeds) with a string you provide. The delimiter defaults to comma.


* The delimiter defaults to a comma.
* Explicitly set this value if you want seed files to use a different delimiter (default is comma).
* The `delimiter` configuration should contain a value and not be empty.
## Usage
Specify a delimiter in your `dbt_project.yml` file to override the global separator for all seed values:

<File name='dbt_project.yml'>

```yml
seeds:
  +quote_columns: False
  +delimiter: ";"
```

</File>


Or only separate values with a delimiter in the seeds/mappings directory:
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


* The `delimiter` configuration should contain a value and not be empty.
