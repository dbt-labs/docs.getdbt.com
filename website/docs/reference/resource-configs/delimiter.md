---
resource_types: [seeds]
datatype: <string>
---

## Description

Optionally specify a custom delimiter for [seed](/docs/build/seeds) by providing a string value. The delimiter defaults to comma.


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
      +delimiter: ","
```

</File>



Or:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: country_codes
    config:
      column_types:
        country_code: varchar(2)
        country_name: varchar(32)
      delimiter: ","
```

</File>

If you have previously run `dbt seed`, you'll need to run `dbt seed --full-refresh` for the changes to take effect.

Note that you will need to use the fully directory path of a seed when configuring `delimiter`. For example, for a seed file at `seeds/marketing/utm_mappings.csv`, you will need to configure it like so:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_mappings:
        +delimiter:
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
      +delimiter: ","
```

</File>

## Recommendation

Use this configuration only when required. Otherwise you can omit this configuration.

## Troubleshooting

The `delimiter` configuration should contain a value when set and not be empty. This value should not be set to a semicolon.
