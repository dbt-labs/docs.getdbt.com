---
resource_types: sources
datatype: string
---

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    overrides: <package name>

    database: ...
    schema: ...
```

</File>

## Definition
Override a source defined in an included package. The properties defined
in the overriding source will be applied on top of the base properties of the
overridden source.

The following source properties can be overridden:
 - [description](resource-properties/description)
 - [meta](resource-properties/meta)
 - [database](resource-properties/database)
 - [schema](resource-properties/schema)
 - [loader](resource-properties/loader)
 - [quoting](resource-properties/quoting)
 - [freshness](resource-properties/freshness)
 - [loaded_at_field](resource-properties/freshness#loaded_at_field)
 - [tags](resource-properties/tags)

## Examples
### Supply your database and schema name for a source defined in a package

This example is based on the [Fivetran Netsuite package](https://github.com/fivetran/dbt_netsuite/blob/bbc3b34151acacffa8a44a7cf422cef3b2f9ef46/models/src_netsuite.yml#L1-L17).
Here, the database and schema is overridden in the parent dbt project which
includes the `netsuite` package.

<File name='models/src_netsuite.yml'>

```yml
version: 2

sources:
  - name: netsuite
    overrides: netsuite

    database: RAW
    schema: netsuitedata

```

</File>

### Configure source freshness based on your loading frequency

<File name='models/src_netsuite.yml'>

```yml
version: 2

sources:
  - name: netsuite
    overrides: netsuite

    freshness:
      warn_after:
        count: 1
        period: day
      error_after:
        count: 2
        period: day
```

</File>
