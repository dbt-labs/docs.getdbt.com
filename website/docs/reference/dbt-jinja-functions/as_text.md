---
title: "as_text"
id: "as_text"
---

The `as_text` Jinja filter will coerce jinja-compiled output back to text. It
can be used in yaml rendering contexts where values _must_ be provided as
strings, rather than as the datatype that they look like.

### Usage:

In the example below, the `as_text` filter is used to convert the number "17",
a dataset id, from a number into a string.

<File name='schema.yml'>

```yml
bigquery-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: 'dbt-project-1'
      dataset: "{{ 12345 | as_text }}"
```

</File>
