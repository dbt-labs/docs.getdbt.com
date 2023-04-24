---
title: "Model access"
id: model-access
sidebar_label: "Model access"
description: "Define model access with group capabilities"
---

:::info New functionality
This functionality is new in v1.5.
:::

:::info Model access != User access

**Model groups and access** are dbt-core constructs, distinct from **user groups and access** in dbt Cloud. For docs on the latter, see: ["About user access"](about-user-access).

The two concepts will be closely related, as we develop multi-project collaboration workflows this year:
- Users with access to develop in a dbt project can view and modify **all** models in that project, including private models.
- Users in the same dbt Cloud account _without_ access to develop in a project cannot view that project's private models, and they can take a dependency on its public models only.
:::

## Related documentation
* [`groups`](build/groups)
* [`access`](resource-properties/access)

## Groups

Models can be grouped under a common designation with a shared owner.

Why define model `groups`?
- It turns implicit relationships into an explicit grouping
- It enables you to mark specific models as "private," for use _only_ within that group

## Access modifiers

Some models are implementation details, meant for reference only within their group of related models. Other models should be accessible through the [ref](ref) function across groups and projects. Models can set an [access modifier](https://en.wikipedia.org/wiki/Access_modifiers) to indicate their intended level of accessibility.

| Access    | Referenceable by                       |
|-----------|----------------------------------------|
| private   | same group                             |
| protected | same project (or installed as package) |
| public    | any group, package or project          |

By default, all models are `protected`. This means that other models in the same project can reference them, regardless of their group. This is largely for backwards compatability when assigning groups to an existing set of models, as there may already be existing references across group assignments.

However, it is recommended to set the access modifier of a new model to `private` to prevent other project resources from taking dependencies on models not intentionally designed for sharing across groups.

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

### Accessing models from a package

For historical reasons, it is possible to `ref` a protected model from another project, _if that protected model is installed as a package_. This is useful for packages containing models for a common data source; you can install the package as source code, and run the models as if they were your own.

dbt Core v1.6 will introduce a new kind of `project` dependency, distinct from a `package` dependency, defined in `dependencies.yml`:
```yml
projects:
  - project: jaffle_finance
```

Unlike installing a package, the models in the `jaffle_finance` project will not be pulled down as source code, or selected to run during `dbt run`. Instead, `dbt-core` will expect stateful input that enables it to resolve references to those public models.

Models referenced from a `project`-type dependency must use [two-argument `ref`](#two-argument-variant), including the project name. Only public models can be accessed in this way. That holds true even if the `jaffle_finance` project is _also_ installed as a package (pulled down as source code), such as in a coordinated deployment. If `jaffle_finance` is listed under the `projects` in `dependencies.yml`, dbt will raise an error if a protected model is referenced from outside its project.
