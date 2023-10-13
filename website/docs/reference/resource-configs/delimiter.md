---
resource_types: [seeds]
datatype: <string>
default_value: ","
---

## Definition

An optional seed configuration used to customize how you separate values in a [seed](/docs/build/seeds) with the one-character string you provide.

* The delimiter defaults to a comma when not specified.
* Explicitly set the `delimiter` configuration value if you want seed files to use a different delimiter, such as "|" or ";".

:::info New in 1.7!

Delimiter is new functionality available beginning with dbt Core v1.7.

:::

  
## Usage

Specify a delimiter in your `dbt_project.yml` file to customize the global separator for all seed values:

<File name='dbt_project.yml'>

```yml
seeds:
  <project_name>:
     +delimiter: "|" # default project delimiter for seeds will be "|"
    <seed_subdirectory>:
      +delimiter: "," # delimiter for seeds in seed_subdirectory will be ","
```

</File>


Or use a custom delimiter to override the values for a specific seed:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>
    config: 
      delimiter: "|"
```

</File>

## Examples
For a project with:

* `name: jaffle_shop` in the `dbt_project.yml` file
* `seed-paths: ["seeds"]` in the `dbt_project.yml` file

### Use a custom delimiter to override global values

You can set a default behavior for all seeds with an exception for one seed, `seed_a`, which uses a comma:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: 
    +delimiter: "|" # default delimiter for seeds in jaffle_shop project will be "|"
    seed_a:
      +delimiter: "," # delimiter for seed_a will be ","
```

</File>

Your corresponding seed files would be formatted like this:

<File name='seeds/my_seed.csv'>

```text
col_a|col_b|col_c
1|2|3
4|5|6
...
```

</File>

<File name='seeds/seed_a.csv'>

```text
name,id
luna,1
doug,2
...
```

</File>

Or you can configure custom behavior for one seed. The `country_codes` uses the ";" delimiter:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: country_codes
    config:
      delimiter: ";"
```

</File>

The `country_codes` seed file would be formatted like this:

<File name='seeds/country_codes.csv'>

```text
country_code;country_name
US;United States
CA;Canada
GB;United Kingdom
...
```

</File>
