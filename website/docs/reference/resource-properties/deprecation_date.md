---
resource_types: [models]
datatype: deprecation_date
required: no
---

<File name='models/<schema>.yml'>

```yml
models:
  - name: my_model
    description: deprecated
    deprecation_date: 1999-01-01
```
</File>

<File name='models/<schema>.yml'>

```yml
version: 2
models:
  - name: my_model
    description: deprecating in the future
    deprecation_date: 2999-01-01
```

</File>

## Definition

The deprecation date of the model in YAML DateTime format. 

