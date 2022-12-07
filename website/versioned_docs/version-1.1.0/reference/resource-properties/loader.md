---
resource_types: sources
datatype: string
---

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    database: <database_name>
    loader: <string>
    tables:
      - ...

```

</File>

## Definition
Describe the tool that loads this source into your warehouse. Note that this property is for documentation purposes only — dbt does not meaningfully use this.

## Examples
### Indicate which EL tool loaded data

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    loader: fivetran
    tables:
      - name: orders
      - name: customers

  - name: stripe
    loader: stitch
    tables:
      - name: payments
```

</File>
