---
title: "Model access"
id: model-access
sidebar_label: "Model access"
description: "Define model access with group capabilities"
---

<VersionBlock lastVersion="1.5">

:::info New functionality
This functionality is new in v1.5 — if you have thoughts, participate in [the discussion on GitHub](https://github.com/dbt-labs/dbt-core/discussions/6730)!
:::

:::info "Model access" is not "User access"

**Model groups and access** and **user groups and access** mean two different things. "User groups and access" is a specific term used in dbt Cloud to manage permissions. Refer to [User access](/docs/cloud/manage-access/about-user-access) for more info.

The two concepts will be closely related, as we develop multi-project collaboration workflows this year:
- Users with access to develop in a dbt project can view and modify **all** models in that project, including private models.
- Users in the same dbt Cloud account _without_ access to develop in a project cannot view that project's private models, and they can take a dependency on its public models only.
:::

</VersionBlock>


## Related documentation
* [`groups`](/docs/build/groups)
* [`access`](/reference/resource-properties/access)

## Groups

Models can be grouped under a common designation with a shared owner. For example, you could group together all models owned by a particular team, related to modeling a specific data source (`github`), or 

Why define model `groups`? There are two reasons:
- It turns implicit relationships into an explicit grouping, with a defined owner. By thinking about the interface boundaries _between_ groups, you can have a cleaner (less entangled) DAG. In the future, those interface boundaries could be appropriate as the interfaces between separate projects.
- It enables you to designate certain models as having "private" access—for use exclusively within that group. Other models will be restricted from referencing (taking a dependency on) those models. In the future, they won't be visible to other teams taking a dependency on your project—only "public" models will be.

If you follow our [best practices for structuring a dbt project](/guides/best-practices/how-we-structure/1-guide-overview), you're probably already using subdirectories to organize your dbt project. It's easy to apply a `group` label to an entire subdirectory at once:

<File name="dbt_project.yml">

```yml
models:
  my_project_name:
    marts:
      customers:
        +group: customer_success
      finance:
        +group: finance
```

</File>

Each model can only belong to one `group`, and groups cannot be nested. If you set a different `group` in that model's YAML or in-file config, it will override the `group` applied at the project level.

## Access modifiers

Some models are implementation details, meant for reference only within their group of related models. Other models should be accessible through the [ref](/reference/dbt-jinja-functions/ref) function across groups and projects. Models can set an [access modifier](https://en.wikipedia.org/wiki/Access_modifiers) to indicate their intended level of accessibility.

| Access    | Referenceable by                       |
|-----------|----------------------------------------|
| private   | same group                             |
| protected | same project (or installed as package) |
| public    | any group, package or project          |

If you try to reference a model outside of its supported access, you will see an error:

```shell
dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

By default, all models are `protected`. This means that other models in the same project can reference them, regardless of their group. This is largely for backwards compatability when assigning groups to an existing set of models, as there may already be existing references across group assignments.

However, it is recommended to set the access modifier of a new model to `private` to prevent other project resources from taking dependencies on models not intentionally designed for sharing across groups.

<File name="models/marts/customers.yml">

```yaml
# First, define the group and owner
groups:
  - name: customer_success
    owner:
      name: Customer Success Team
      email: cx@jaffle.shop

# Then, add 'group' + 'access' modifier to specific models
models:
  # This is a public model -- it's a stable & mature interface for other teams/projects
  - name: dim_customers
    group: customer_success
    access: public
    
  # This is a private model -- it's an intermediate transformation intended for use in this context *only*
  - name: int_customer_history_rollup
    group: customer_success
    access: private
    
  # This is a protected model -- it might be useful elsewhere in *this* project,
  # but it shouldn't be exposed elsewhere
  - name: stg_customer__survey_results
    group: customer_success
    access: protected
```

</File>

## FAQs

### How does model access relate to database permissions?

These are different!

Specifying `access: public` on a model does not trigger dbt to automagically grant `select` on that model to every user or role in your data platform when you materialize it. You have complete control over managing database permissions on every model/schema, as makes sense to you & your organization.

Of course, dbt can facilitate this by means of [the `grants` config](/reference/resource-configs/grants), and other flexible mechanisms. For example:
- Grant access to downstream queriers on public models
- Restrict access to private models, by revoking default/future grants, or by landing them in a different schema

As we continue to develop multi-project collaboration, `access: public` will mean that other teams are allowed to start taking a dependency on that model. This assumes that they've requested, and you've granted them access, to select from the underlying dataset.

### What about referencing models from a package?

For historical reasons, it is possible to `ref` a protected model from another project, _if that protected model is installed as a package_. This is useful for packages containing models for a common data source; you can install the package as source code, and run the models as if they were your own.

dbt Core v1.6 will introduce a new kind of `project` dependency, distinct from a `package` dependency, defined in `dependencies.yml`:
```yml
projects:
  - project: jaffle_finance
```

Unlike installing a package, the models in the `jaffle_finance` project will not be pulled down as source code, or selected to run during `dbt run`. Instead, `dbt-core` will expect stateful input that enables it to resolve references to those public models.

Models referenced from a `project`-type dependency must use [two-argument `ref`](#two-argument-variant), including the project name. Only public models can be accessed in this way. That holds true even if the `jaffle_finance` project is _also_ installed as a package (pulled down as source code), such as in a coordinated deployment. If `jaffle_finance` is listed under the `projects` in `dependencies.yml`, dbt will raise an error if a protected model is referenced from outside its project.
