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
 - [meta](resource-configs/meta)
 - [database](resource-properties/database)
 - [schema](resource-properties/schema)
 - [loader](resource-properties/loader)
 - [quoting](resource-properties/quoting)
 - [freshness](resource-properties/freshness)
 - [loaded_at_field](resource-properties/freshness#loaded_at_field)
 - [tags](resource-configs/tags)

## Examples
### Supply your database and schema name for a source defined in a package

This example is based on the [Fivetran GitHub Source package](https://github.com/fivetran/dbt_github_source/blob/830ba43ac2948e4853a3c167ab7ee88b8b425fa0/models/src_github.yml#L3-L29).
Here, the database and schema is overridden in the parent dbt project which
includes the `github_source` package.

<File name='models/src_github.yml'>

```yml
version: 2

sources:
  - name: github
    overrides: github_source

    database: RAW
    schema: github_data

```

</File>

### Configure your own source freshness for a source table in a package

You can override configurations at both the source and the <Term id="table" /> level

<File name='models/src_github.yml'>

```yml
version: 2

sources:
  - name: github
    overrides: github_source

    freshness:
      warn_after:
        count: 1
        period: day
      error_after:
        count: 2
        period: day

    tables:
      - name: issue_assignee
        freshness:
          warn_after:
            count: 2
            period: day
          error_after:
            count: 4
            period: day

```

</File>
