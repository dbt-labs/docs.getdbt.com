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

## Definition
The access level of the model you are declaring properties for.

Some models (not all) are designed to be referenced through the [ref](/reference/dbt-jinja-functions/ref) function across [groups](/docs/build/groups).

| Access    | Referenceable by              |
|-----------|-------------------------------|
| private   | same group                    |
| protected | same project/package          |
| public    | any group, package or project |

## Default

By default, all models are "protected." This means that other models in the same project can reference them.
