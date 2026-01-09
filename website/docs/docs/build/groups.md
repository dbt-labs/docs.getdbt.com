---
title: "Add groups to your DAG"
sidebar_label: "Groups"
id: "groups"
keywords:
  - groups access mesh
---

A group is a collection of nodes within a dbt DAG. Groups are named, and every group has an `owner`. They enable intentional collaboration within and across teams by restricting [access to private](/reference/resource-configs/access) models.

Group members may include models, tests, seeds, snapshots, analyses, and metrics. (Not included: sources and exposures.) Each node may belong to only one group.

### Declaring a group

import DefineGroups from '/snippets/_define-groups.md';

<DefineGroups />

#### Centrally defining a group

To centrally define a group in your project, there are two options:

- Create one `_groups.yml` file in the root of the `models` directory.
- Create one `_groups.yml` file in the root of a `groups` directory. For this option, you also need to configure [`model-paths`](/reference/project-configs/model-paths) in the `dbt_project.yml` file:

  ```yml 
  model-paths: ["models", "groups"]
  ```


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
    config:
      access: private # changed to config in v1.10
      group: finance

  # in a different group!
  - name: marketing_model
    config:
      group: marketing
```
</File>

<File name='models/marketing_model.sql'>

```sql
select * from {{ ref('finance_private_model') }}
```
</File>

```shell
$ dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_private_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## Related docs

* [Model Access](/docs/mesh/govern/model-access#groups)
* [Group configuration](/reference/resource-configs/group)
* [Group selection](/reference/node-selection/methods#group)
