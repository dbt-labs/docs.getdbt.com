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

In the example below, the `as_text` filter is used to assert that `''` is an
empty string. In a native rendering, `''` would be coerced to the Python 
keyword `None`. This specification is necessary in `v0.17.0`, but it is not
useful or necessary in later versions of dbt.

<File name='schema.yml'>

```yml
models:
  - name: orders
    columns:
      - name: order_status
        tests:
          - accepted_values:
              values: ['pending', 'shipped', "{{ '' | as_text }}"]

```

</File>

As of `v0.17.1`, native rendering does not occur by default, and the `as_text`
specification is superfluous.

<File name='schema.yml'>

```yml
models:
  - name: orders
    columns:
      - name: order_status
        tests:
          - accepted_values:
              values: ['pending', 'shipped', '']
```

</File>

<Changelog>

* `v0.17.0`: Native rendering is enabled by default. The `as_text` filter was 
introduced.
* `v0.17.1`: Native rendering is disabled by default. The `as_text` filter works
as before, with no functional effect.

</Changelog>
