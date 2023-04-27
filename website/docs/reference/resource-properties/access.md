---
resource_types: [models]
datatype: access
required: no
---

:::info New functionality
This functionality is new in v1.5.
:::

<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    access: private | protected | public
```

</File>

Access modifiers may be applied to models one-by-one in yaml properties. It is not currently possible to configure `access` for multiple models at once. A group or subfolder contains models with a variety of access levels, and designating a model with `access: public` should always be a conscious and intentional choice.

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
