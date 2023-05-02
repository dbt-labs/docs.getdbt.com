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

Some models (not all) are designed to be referenced through the [ref](/reference/dbt-jinja-functions/ref) function across [groups](/docs/build/groups).

| Access    | Referenceable by              |
|-----------|-------------------------------|
| private   | same group                    |
| protected | same project/package          |
| public    | any group, package or project |

If you try to reference a model outside of its supported access, you will see an error:

```shell
dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## Default

By default, all models are "protected." This means that other models in the same project can reference them.

## Related docs

* [Model Access](/docs/collaborate/govern/model-access#groups)
* [Group configuration](/reference/resource-configs/group)
