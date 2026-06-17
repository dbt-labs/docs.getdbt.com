---
title: How do I test and document seeds?
description: "Use a schema file to test and document seeds"
sidebar_label: 'Test and document seeds'
id: testing-seeds

---

To test and document seeds, use a [properties file](/reference/configs-and-properties) and nest the configurations under a `seeds:` key

## Example

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: country_codes
    description: A mapping of two letter country codes to country names
    columns:
      - name: country_code
        data_tests:
          - unique
          - not_null
      - name: country_name
        data_tests:
          - unique
          - not_null
```

</File>
