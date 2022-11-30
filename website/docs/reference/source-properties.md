---
title: Source properties
---

## Related documentation
- [Using sources](/docs/build/sources)
- [Declaring resource properties](configs-and-properties)

## Overview
Source properties can be declared in `.yml` files in your `models/` directory (as defined by the [`model-paths` config](model-paths)).

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <string> # required
    [description](description): <markdown_string>
    [database](resource-properties/database): <database_name>
    [schema](resource-properties/schema): <schema_name>
    [loader](loader): <string>
    [loaded_at_field](resource-properties/freshness#loaded_at_field): <column_name>
    [meta](meta): {<dictionary>}
    [tags](resource-configs/tags): [<string>]
    
    # requires v1.1+
    [config](resource-properties/config):
      [<source_config>](source-configs): <config_value>

    [overrides](resource-properties/overrides): <string>

    [freshness](resource-properties/freshness):
      warn_after:
        [count](resource-properties/freshness#count): <positive_integer>
        [period](resource-properties/freshness#period): minute | hour | day
      error_after:
        [count](resource-properties/freshness#count): <positive_integer>
        [period](resource-properties/freshness#period): minute | hour | day
      [filter](resource-properties/freshness#filter): <where-condition>

    [quoting](resource-properties/quoting):
      database: true | false
      schema: true | false
      identifier: true | false

    tables:
      - name: <string> #required
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [identifier](identifier): <table_name>
        [loaded_at_field](resource-properties/freshness#loaded_at_field): <column_name>
        [tests](resource-properties/tests):
          - <test>
          - ... # declare additional tests
        [tags](resource-configs/tags): [<string>]
        [freshness](resource-properties/freshness):
          warn_after:
            [count](resource-properties/freshness#count): <positive_integer>
            [period](resource-properties/freshness#period): minute | hour | day
          error_after:
            [count](resource-properties/freshness#count): <positive_integer>
            [period](resource-properties/freshness#period): minute | hour | day
          [filter](resource-properties/freshness#filter): <where-condition>

        [quoting](resource-properties/quoting):
          database: true | false
          schema: true | false
          identifier: true | false
        [external](resource-properties/external): {<dictionary>}
        columns:
          - name: <column_name> # required
            [description](description): <markdown_string>
            [meta](meta): {<dictionary>}
            [quote](quote): true | false
            [tests](resource-properties/tests):
              - <test>
              - ... # declare additional tests
            [tags](resource-configs/tags): [<string>]
          - name: ... # declare properties of additional columns

      - name: ... # declare properties of additional source tables

  - name: ... # declare properties of additional sources

```

</File>


## Example

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    schema: public
    loader: emr # informational only (free text)
    loaded_at_field: _loaded_at # configure for all sources

    # meta fields are rendered in auto-generated documentation
    meta:
      contains_pii: true
      owner: "@alice"

    # Add tags to this source
    tags:
      - ecom
      - pii

    quoting:
      database: false
      schema: false
      identifier: false

    tables:
      - name: orders
        identifier: Orders_
        loaded_at_field: updated_at # override source defaults
        columns:
          - name: id
            tests:
              - unique

          - name: price_in_usd
            tests:
              - not_null

      - name: customers
        quoting:
          identifier: true # override source defaults
        columns:
            tests:
              - unique
```

</File>
