---
title: "[WIP] Configuring resources from the project file"
id: "configuring-resources-from-the-project-file"
---


| Configuration | Models | Seeds | Snapshots | Description |
| ------------- | ------ | ----- | --------- | ----------- |
| enabled | :white-check-mark: | :white-check-mark: | :white-check-mark: | Enable or disable a resource |
| pre-hook | :white-check-mark: | :white-check-mark: |  | Run a SQL [hook](hooks) immediately before a resource is built |
| post-hook | :white-check-mark: | :white-check-mark: |  | Run a SQL [hook](hooks) immediately after a resource is built |
| tags | :white-check-mark: | :white-check-mark: | :white-check-mark: | Tag your resources for easier selection. |
| materialized | :white-check-mark: |  |  | Determine the way dbt will build a model in your warehouse. |
|  |  |  |  |  |

Both methods accept identical configuration options. Configurations applied at a directory-level are applied hierarchically, so configurations for `models/events/base` will take precedence over configurations for `models/events`, for instance.

### 1. Configuring directories of models in `dbt_project.yml`

To configure resources in your `dbt_project.yml` file, use the `models:` configuration option. Be sure to namespace your configurations to your project (shown below):

```yaml
# dbt_project.yml

name: fishtown_analytics

models:
  # Be sure to namespace your model configs to your project name
  fishtown_analytics:
  
    # This configures models found in models/events/
    events:
      enabled: true
      materialized: view
      
      # This configures models found in models/events/base
      # These models will be ephemeral, as the config above is overridden
      base:
        materialized: ephemeral

      ...
```


- also applies to seeds, and NOT snapshots
