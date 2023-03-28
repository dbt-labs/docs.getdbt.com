---
title: "Groups"
id: "groups"
description: "When you define groups in dbt projects, you turn implicit relationships into an explicit grouping."
keywords:
  - groups access mesh
---

## About Groups 

A group is collection of resources within a dbt project. Groups are named, and every group has an `owner`. They enable intentional collaboration within and across teams, by restricting [access to private](access) models

### Declaring a group

Groups are defined in `.yml` files, nested under a `groups:` key.

<File name='models/marts/finance/finance.yml'>

```yaml
groups:
  - name: finance
    owner:
      # 'name' or 'email' is required; additional properties allowed
      email: finance@jaffleshop.com
      slack: finance-data
      github: finance-data-team
```

</File>

### Adding a model to a group

To add a model to a group, add the `group` property to a model entry in a `.yml` file.

<File name='models/schema.yml'>

```yml
models:
  - name: model_name
    group: finance
```

</File>

### Referencing a model in a group

By default, all models within a group are `protected` in access - meaning they can be referenced by downstream resources in _any_ group in the project using the [`ref`](ref) function. If a grouped model's `access` property is set to `private`, only resources within its group will be able to make references to it. 

<File name='models/schema.yml'>

```yml
models:
  - name: finance_model
    access: private
    group: finance
  - name: marketing_model
    group: marketing
```
</File>

<File name='models/marketing_model.sql'>

```sql
select * from {{ ref('finance_model') }}
```
</File>

```shell
$ dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```


## Related docs

* [Model Access](/docs/collaborate/publish/model-access#groups)
* [Group Property](/docs/reference/resource-configs/group)
