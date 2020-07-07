---
title: "as_text"
id: "as_text"
---

The `as_text` Jinja filter will coerce Jinja-compiled output back to text. It
can be used in yaml rendering contexts where values _must_ be provided as
strings, rather than as the datatype that they look like.

:::info Heads up
In dbt v0.17.1, native rendering is not enabled by default. As such, 
the `as_text` filter has no functional effect.

It is still possible to natively render specific values using the [`as_bool`](as_bool), 
[`as_number`](as_number), and [`as_native`](as_native) filters. 

:::

### Usage

In the example below, the `as_text` filter is used to assert that `1.0` is a string,
not the integer 1. This specification is necessary in `v0.17.0`.

<File name='schema.yml'>

```yml
version: 2

models:
  - name: devices
    columns:
      - name: installed_version
        tests:
          accepted_values:
            values:
              - "{{ 1.0 | as_text }}"
              - 1.1
```

</File>

As of `v0.17.1`, this native rendering is not necessary, because `values` treats 
all its inputs as strings by default.

<File name='schema.yml'>

```yml
version: 2

models:
  - name: devices
    columns:
      - name: installed_version
        tests:
          accepted_values:
            values:
              - 1.0
              - 1.1
```

</File>

<Changelog>

* `v0.17.0`: Native rendering is enabled by default. The `as_text` filter was 
introduced.
* `v0.17.1`: Native rendering is disabled by default. The `as_text` filter works
as before, with no functional effect.

</Changelog>
