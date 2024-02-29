---
title: "Supported data formats for unit tests"
sidebar_label: "Data formats"
---

Currently, mock data for unit testing in dbt supports two formats:

- `dict` (default): Inline dictionary values.
- `csv`: Inline CSV values or a CSV file.

We will support more in the future, so watch our [upgrade guides](/docs/dbt-versions/core-upgrade) and this page for updates.

The `dict` data format is the default if no `format` is defined.

`dict` requires an inline dictionary for `rows`:

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: dict
        rows:
          - {id: 1, name: gerda}
          - {id: 2, b: michelle}    

```

When using the `csv` format, you can use either an inline CSV string for `rows`:

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: csv
        rows: |
          id,name
          1,gerda
          2,michelle

```

Or, you can provide the name of a CSV file in the `tests/fixtures` directory (or the configured `test-paths` location) of your project for `fixture`: 

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: csv
        fixture: my_model_a_fixture

```