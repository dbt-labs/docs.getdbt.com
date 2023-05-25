---
resource_types: [seeds]
description: "Quote_columns - Read this in-depth guide to learn about configurations in dbt."
datatype: boolean
default_value: false
---

## Definition
An optional seed configuration, used to determine whether column names in the seed file should be quoted when the <Term id="table" /> is created.

* When `True`, dbt will quote the column names defined in the seed file when building a table for the seed, preserving casing.
* When `False`, dbt will not quote the column names defined in the seed file.
* When not set, it will vary by adapter whether or not column names are quoted.

## Usage
### Globally quote all seed columns

<File name='dbt_project.yml'>

```yml
seeds:
  +quote_columns: true
```

</File>

### Only quote seeds in the `seeds/mappings` directory.
For a project with:
* `name: jaffle_shop` in the `dbt_project.yml` file
* `seed-paths: ["seeds"]` in the `dbt_project.yml` file

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    mappings:
      +quote_columns: true
```

</File>

Or (as of v0.21):

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: mappings
    config:
      quote_columns: true
```

</File>

## Recommended configuration
* Explicitly set this value if using seed files.
* Apply the configuration globally rather than to individual projects/seeds.
* Set `quote_columns: false` _unless_ your column names include a special character or casing needs to be preserved. In that case, consider renaming your seed columns (this will simplify code downstream)
