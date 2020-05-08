---
title: How do I test and document seeds?
---

<Changelog>The `seeds:` key is new in 0.16.0. Prior to this, use a `models:` key instead.</Changelog>

To test and document seeds, use a [schema file](docs/building-a-dbt-project/testing-and-documentation/declaring-properties.md) and nest the configurations under a `seeds:` key

## Example:

<File name='data/schema.yml'>

```yml
version: 2

seeds:
  - name: country_codes
    description: A mapping of two letter country codes to country names
    columns:
      - name: country_code
        tests:
          - unique
          - not_null
      - name: country_name
        tests:
          - unique
          - not_null
```

</File>
