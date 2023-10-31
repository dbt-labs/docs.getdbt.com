---
title: " About doc function"
sidebar_label: "doc"
id: "doc"
description: "Use the `doc` to reference docs blocks in description fields."
---

The `doc` function is used to reference docs blocks in the description field of schema.yml files. It is analogous to the `ref` function. For more information, consult the [Documentation guide](/docs/collaborate/documentation).

Usage:

<File name='orders.md'>

```jinja2

{% docs orders %}

# docs
- go
- here
 
{% enddocs %}
```

</File>



<File name='schema.yml'>

```yaml

version: 2
models:
  - name: orders
    description: "{{ doc('orders') }}"
```

</File>
