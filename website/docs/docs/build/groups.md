---
title: "Add groups to your DAG"
sidebar_label: "Groups"
id: "groups"
description: "When you define groups in dbt projects, you turn implicit relationships into an explicit grouping."
keywords:
  - groups access mesh
---

:::info New functionality
This functionality is new in v1.5.
:::

## Related docs

* [Model Access](/docs/collaborate/govern/model-access#groups)
* [Group configuration](/reference/resource-configs/group)
* [Group selection](/reference/node-selection/methods#the-group-method)

## About groups 

A group is a collection of nodes within a dbt DAG. Groups are named, and every group has an `owner`. They enable intentional collaboration within and across teams by restricting [access to private](/reference/resource-configs/access) models.

Group members may include models, tests, seeds, snapshots, analyses, and metrics. (Not included: sources and exposures.) Each node may belong to only one group.

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

Use the `group` configuration to add one or more models to a group.

<Tabs>
<TabItem value="project" label="Project-level">

<File name='dbt_project.yml'>

```yml
models:
  marts:
    finance:
      +group: finance
```

</File>

</TabItem>

<TabItem value="model-yaml" label="Model-level">

<File name='models/schema.yml'>

```yml
models:
  - name: model_name
    config:
      group: finance
```

</File>

</TabItem>

<TabItem value="model-file" label="In-file">

<File name='models/model_name.sql'>

```sql
{{ config(group = 'finance') }}

select ...
```

</File>

</TabItem>

</Tabs>

### Referencing a model in a group

By default, all models within a group have the `protected` [access modifier](/reference/resource-configs/access). This means they can be referenced by downstream resources in _any_ group in the same project, using the [`ref`](/reference/dbt-jinja-functions/ref) function. If a grouped model's `access` property is set to `private`, only resources within its group can reference it. 

<File name='models/schema.yml'>

```yml
models:
  - name: finance_private_model
    access: private
    config:
      group: finance

  # in a different group!
  - name: marketing_model
    config:
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
