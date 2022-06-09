---
title: How do I test and document seeds?
description: "Use a schema file to test and document seeds"
sidebar_label: 'Test and document seeds'
id: testing-seeds

---

<Changelog>The `seeds:` key is new in 0.16.0. Prior to this, use a `models:` key instead.</Changelog>

To test and document seeds, use a [schema file](configs-and-properties) and nest the configurations under a `seeds:` key

## Example

<File name='seeds/schema.yml'>

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
