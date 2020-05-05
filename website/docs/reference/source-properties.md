---
title: Source properties
---

<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document.

</Alert>

Source properties can be declared in `.yml` files in your `models/` directory (as defined by the [`source-paths` config](source-paths)).

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <string> # required
    [description](description): <markdown_string>
    database: <database_name>
    schema: <schema_name>
    loader: <string>
    loaded_at_field: <column_name>
    [meta](meta): {<dictionary>}
    [tags](resource-properties/tags): [<string>]

    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    quoting:
      database: true | false
      schema: true | false
      identifier: true | false

    tables:
      - name: <string> #required
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        identifier: <table_name>
        loaded_at_field: <column_name>
        [tests](tests):
          - <test>
          - ... # declare additional tests
        [tags](resource-properties/tags): [<string>]
        freshness:
          warn_after: {count: 12, period: hour}
          error_after: {count: 24, period: hour}
        quoting:
          identifier: true | false
        columns:
          - name: <column_name> # required
            [description](description): <markdown_string>
            [meta](meta): {<dictionary>}
            [quote](quote): true | false
            [tests](tests):
              - <test>
              - ... # declare additional tests
            [tags](resource-properties/tags): [<string>]
          - name: ... # declare properties of additional columns

      - name: ... # declare properties of additional source tables

  - name: ... # declare properties of additional sources

```

</File>
