---
title: Resource path
description: "Learn how to use resource paths to configure resource types in dbt."
id: resource-path
sidebar_label: "About resource paths"
---

The `resource-path` nomenclature is used in this documentation when documenting how to configure resource types like models, seeds, snapshots, tests, sources, and others, from your `dbt_project.yml` file. 

It represents the nested dictionary keys that provide the path to a directory of that resource type, or a single instance of that resource type by name.

```yml
resource_type:
  project_name:
    directory_name:
      subdirectory_name:
        instance_of_resource_type (by name):
          ...
```

## Example

The following examples are mostly for models and a source, but the same concepts apply for seeds, snapshots, tests, sources, and other resource types.

### Apply config to all models

To apply a configuration to all models, do not use a `<resource-path>`:

<File name='dbt_project.yml'>

```yml
models:
  +enabled: false # this will disable all models (not a thing you probably want to do)
```

</File>

### Apply config to all models in your project

To apply a configuration to all models in _your_ project only, use your [project name](/reference/project-configs/name) as the `<resource-path>`:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    +enabled: false # this will apply to all models in your project, but not any installed packages
```

</File>

### Apply config to all models in a subdirectory

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

### Apply config to all models in one model

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
### Apply config source nested in a subfolder 

To disable a source nested in a YAML file in a subfolder, you will need to supply the path to that YAML file, as well as the source name in the `dbt_project.yml` file.<br /><br /> 
  The following example shows how to disable a source nested in a YAML file in a subfolder: 

  <File name='dbt_project.yml'>

  ```yaml
  sources:
    your_project_name:
      subdirectory_name:
        source_yaml_file_name:
          source_name:
            +enabled: false # This will apply to sources nested in subfolders.
  ```
  </File>
