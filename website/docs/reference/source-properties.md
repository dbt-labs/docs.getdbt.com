---
title: Source properties
---
Sources may be described in the `source-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

sources:
  - name: <string> # required
    description: <markdown_string>
    database: <database_name>
    schema: <schema_name>
    loader: <string>
    loaded_at_field: <column_name>
    meta: { <dictionary> }
    tags: <string> | [<string>] # check if single value is allowed

    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    quoting:
      database: true | false
      schema: true | false
      identifier: true | false

    tables:
      - name: <string> #required
        description: <markdown_string>
        identifier: <table_name>
        loaded_at_field: <column_name>
        tests: [<test>]
        tags: []
        docs: # to check
          show: true | false
        freshness:
          warn_after: {count: 12, period: hour}
          error_after: {count: 24, period: hour}
        quoting:
          identifier: true | false
        columns: # this is repeated elsewhere
          - name: <column_name> # required
            description: <markdown_string>
            quote: true | false
            tests: [<test>]
            tags: [<string>]


```
