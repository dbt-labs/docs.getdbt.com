The `<resource-path>` nomenclature is used in this documentation when documenting how to configure a model, seed, or snapshot, from your `dbt_project.yml` file. It represents the nested dictionary keys that provide the path to either a directory of models, or a single model.

## Example
:::info

This example is for models, but the same concepts apply for seeds and snapshots.

:::

To apply a configuration to all models, do not use a `<resource-path>`:

<File name='dbt_project.yml'>

```yml
models:
  +enabled: false # this will disable all models (not a thing you probably want to do)
```

</File>

To apply a configuration to all models in _your_ project only, use your [project name](/reference/project-configs/name) as the `<resource-path>`:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    +enabled: false # this will apply to all models in your project, but not any installed packages
```

</File>

To apply a configuration to all models in a subdirectory of your project, e.g. `staging`, nest the directory under the project name:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    staging:
      +enabled: false # this will apply to all models in the `staging/` directory of your project
```

</File>

In the following project, this would apply to models in the `staging/` directory, but not the `marts/` directory:
```
.
├── dbt_project.yml
└── models
    ├── marts
    └── staging

```

To apply a configuration to one model, nest the full path under the project name. For a model at `/staging/stripe/payments.sql`, this would look like:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    staging:
      stripe:
        payments:
          +enabled: false # this will apply to only one model
```

</File>

In the following project, this would only apply to the `payments` model:

```
.
├── dbt_project.yml
└── models
    ├── marts
    │   └── core
    │       ├── dim_customers.sql
    │       └── fct_orders.sql
    └── staging
        ├── jaffle_shop
        │   ├── customers.sql
        │   └── orders.sql
        └── stripe
            └── payments.sql

```
