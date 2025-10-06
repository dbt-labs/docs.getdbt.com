---
title: "Supported data formats for unit tests"
sidebar_label: "Data formats"
---

Currently, mock data for unit testing in dbt supports three formats:

- `dict` (default): Inline dictionary values.
- `csv`: Inline CSV values or a CSV file.
- `sql`: Inline SQL query or a SQL file. Note: For this format you must supply mock data for _all rows_. 

## dict

The `dict` data format is the default if no `format` is defined.

`dict` requires an inline dictionary for `rows`:

<File name='models/schema.yml'>

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

</File>

## CSV

When using the `csv` format, you can use either an inline CSV string for `rows`:

<File name='models/schema.yml'>

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
</File>


Or, you can provide the name of a CSV file in the `tests/fixtures` directory (or the configured `test-paths` location) of your project for `fixture`: 

<File name='models/schema.yml'>

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: csv
        fixture: my_model_a_fixture

```
</File>

## sql

Using this format:
- Provides more flexibility for the types of data you can unit test
- Allows you to unit test a model that depends on an ephemeral model

However, when using `format: sql` you must supply mock data for _all rows_.

When using the `sql` format, you can use either an inline SQL query for `rows`:

<File name='models/schema.yml'>

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: sql
        rows: |
          select 1 as id, 'gerda' as name, null as loaded_at union all
          select 2 as id, 'michelle', null as loaded_at as name

```

</File>

Or, you can provide the name of a SQL file in the `tests/fixtures` directory (or the configured `test-paths` location) of your project for `fixture`: 

<File name='models/schema.yml'>

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: sql
        fixture: my_model_a_fixture

```
</File>

**Note:** Jinja is unsupported in SQL fixtures for unit tests.
