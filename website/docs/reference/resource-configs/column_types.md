---
resource_types: [seeds]
datatype: {column_name: datatype}
---

## Description
Optionally specify the database type of columns in a [seed](docs/building-a-dbt-project/seeds.md), by providing a dictionary where the keys are the column names, and the values are a valid datatype (this varies across databases).

Without specifying this, dbt will infer the datatype based on the column values in your seed file.

## Usage
Specify column types in your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +column_types:
        country_code: varchar(2)
        country_name: varchar(32)

```

</File>

<File name='seeds/properties.yml'>

Or (as of v0.21):
```yml
version: 2

seeds:
  - name: country_codes
    config:
      column_types:
        country_code: varchar(2)
        country_name: varchar(32)
```

</File>

If you have previously run `dbt seed`, you'll need to run `dbt seed --full-refresh` for the changes to take effect.

Note that you will need to use the fully directory path of a seed when configuring `column_types`. For example, for a seed file at `seeds/marketing/utm_mappings.csv`, you will need to configure it like so:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_mappings:
        +column_types:
          ...

```

</File>

## Examples

### Use a varchar column type to preserve leading zeros in a zipcode
(Note: preservation of leading zeros works for v0.16.0 onwards)
<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # you must include the project name
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>

## Recommendation
Use this configuration only when required, i.e. when the type inference is not working as expected. Otherwise you can omit this configuration.
