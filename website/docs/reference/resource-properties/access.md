---
resource_types: [models]
datatype: access
required: no
---

:::info Beta functionality
This functionality is new in v1.5. These docs exist to provide a high-level overview of what's to come. The specific syntax is liable to change.
:::

<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    access: private | protected | protected
```

</File>

## Definition
The access level of the model you are declaring properties for.

Some models (not all) are designed to be referenced through the [ref](ref) function across [groups](build/groups).

| Access    | Referenceable by              |
|-----------|-------------------------------|
| private   | same group                    |
| protected | same project/package          |
| public    | any group, package or project |

## Default

By default, all models are "protected." This means that other models in the same project can reference them.
