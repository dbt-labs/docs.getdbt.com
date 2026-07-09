---
title: "Unique project resource names"
id: "require_unique_project_resource_names"
sidebar_label: "require unique project resource names"
---

| require_unique_project_resource_names | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2025.12 | 1.11.0 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

The `require_unique_project_resource_names` flag enforces uniqueness of resource names within the same package. dbt resources such as models, seeds, snapshots, analyses, tests, and functions share a common namespace. When two resources in the same package have the same name, dbt must decide which one a `ref()` or `source()` refers to. Previously, this check was not always enforced, which meant duplicate names could result in dbt referencing the wrong resource.

The `require_unique_project_resource_names` flag is set to `false` by default. With this setting, if two unversioned resources in the same package share the same name, dbt continues to run and raises a [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation) warning. When set to `true`, dbt raises a `DuplicateResourceNameError` error.

For example, if your project contains a model and a seed named `sales`:

```
models/sales.sql
seeds/sales.csv
```

And a model contains:

```sql
select * from {{ ref('sales') }}
```

When the flag is set to `true`, dbt will raise:

```
DuplicateResourceNameError: Found resources with the same name 'sales' in package 'project': 'model.project.sales' and 'seed.project.sales'. Please update one of the resources to have a unique name.
```

When this error is raised, rename one of the resources or refactor the project structure to avoid name conflicts.
