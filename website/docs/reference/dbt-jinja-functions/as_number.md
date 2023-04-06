---
title: "as_number"
id: "as_number"
description: "Use this filter to convert Jinja-compiled output to a numeric value.."
---

The `as_number` Jinja filter will coerce Jinja-compiled output into a numeric
value (integer or float), or return an error if it cannot be represented as
a number.

### Usage

In the example below, the `as_number` filter is used to coerce an environment
variables into a numeric value to dynamically control the connection port.

<File name='profiles.yml'>

```yml
my_profile:
  outputs:
    dev:
      type: postgres
      port: "{{ env_var('PGPORT') | as_number }}"
```

</File>

<Changelog>

* `v0.17.1`: Native rendering is disabled by default. The `as_number` filter was 
introduced.

</Changelog>
