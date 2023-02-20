---
title: "Model access"
---

:::info Beta functionality
This functionality is new in v1.5! These docs exist to provide a high-level overview of what's to come. Specific syntax is liable to change.

For more details, and to leave your feedback, check out the GitHub discussion:
* ["Model groups & access" (dbt-core#6730)](https://github.com/dbt-labs/dbt-core/discussions/6730)
:::

## Related documentation
* TK: `groups`
* TK: `access` modifiers

### Groups

Models can be grouped together under a common designation, with a shared owner.

Why define model `groups`?
- It turns implicit relationships into an explicit grouping
- It enables you to mark certain models as "private," for use _only_ within that group

### Access modifiers

Some models (not all of them) are designed to be shared across groups.

https://en.wikipedia.org/wiki/Access_modifiers

| Keyword   | Meaning              |
|-----------|----------------------|
| private   | same group           |
| protected | same project/package |
| public    | everybody*           |

By default, all models are "protected." This means that they can be referenced by other models in the same project.

:::info Under construction 🚧
More to come! The syntax below is suggestive only, it does not yet work.
:::

<File name="models/marts/customers.yml">

```yaml
groups:
  - name: cx
    owner:
      name: Customer Success Team
      email: cx@jaffle.shop

models:
  - name: dim_customers
    group: cx
    access: public
  # this is an intermediate transformation -- relevant to the CX team only
  - name: int__customer_history_rollup
    group: cx
    access: private
```

</File>
