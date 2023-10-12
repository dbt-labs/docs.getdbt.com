---
resource_types: [seeds]
datatype: <string>
default_value: ","
---

## Definition

An optional seed configuration used to customize how you separate values in a [seed](/docs/build/seeds) with the one-character string you provide.

* The delimiter defaults to a comma when not specified.
* Explicitly set The `delimiter` configuration value if you want seed files to use a different delimiter, such as "|" or ";" (default is comma).

:::info New to dbt Core 1.7

Delimiter is new functionality available beginning with dbt Core v1.7.

:::

  
## Usage

Specify a custom delimiter in your `dbt_project.yml` file to override the global separator for all seed values:

<File name='dbt_project.yml'>

```yml
seeds:
  <project_name>:
     +delimiter: "|"
    <seed_directory_name>:
      +delimiter: ","
```

</File>


Or use a custom delimiter to override the values for a specific seed:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: <seed_directory_name>
    config: 
      delimiter: "|"
```

</File>

## Examples
For a project with:

* `name: jaffle_shop` in the `dbt_project.yml` file
* `seed-paths: ["seeds"]` in the `dbt_project.yml` file

### Use a custom delimiter to overrride global values

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: 
    +delimiter: "|"
    seed_a:
      +delimiter: ","
```

</File>

Or for certain seeds:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: seed_a
    config:
      delimiter: "|"
```

</File>
