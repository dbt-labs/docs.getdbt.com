---
title: "Configuring models"
id: "configuring-models"
---

There are a number of configuration options provided to control how dbt interacts with your models. Understanding these configuration options is core to controlling dbt's behavior and optimizing its usage.

## Supplying configuration values

There are two ways to supply model configuration values:

1. as settings for an entire group of modules, applied at the directory level
2. as settings for an individual model, specified within a given model .sql

Both methods accept identical configuration options. Configurations applied at a directory-level are applied hierarchically, so configurations for `models/events/base` will take precedence over configurations for `models/events`, for instance.

### 1. Configuring directories of models in `dbt_project.yml`

To configure models in your `dbt_project.yml` file, use the `models:` configuration option. Be sure to use namespace your configurations to your project (shown below):

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

      ..."
```

### 2. Configuring a specific model .sql file

Some types of configurations are specific to a particular model. In these cases, placing configurations in the `dbt_project.yml` file can be unwieldy. Instead, you can specify these configurations at the top of a model .sql file.

<File name='models/events/base/base_events.sql'>

```sql
{{
  config(
    materialized = "table",
    sort = 'event_time',
    dist = 'event_id'
  )
}}


select * from ...
```

</File>

Some configurations like `post-hook` and `pre-hook` contain invalid characters (ie. dashes). If you want to specify these configurations inside of a model, you can do so using dbt's alternative configuration syntax:

<File name='models/events/base/base_events.sql'>

```sql
{{
  config({
    "post-hook": "vacuum {{ this }}",
    "materialized": "table"
  })
}}


select * from ...
```

</File>


## Hooks

dbt provides the ability to run arbitrary commands against the database before and after a model is run. These are known as pre- and post-model hooks and configured as such:


```yaml
models:
  project-name:
    pre-hook:       # custom SQL
    post-hook:      # custom SQL"
```

Hooks are extremely powerful, allowing model authors to perform tasks such as inserting records into audit tables, executing `GRANT` statements, and running `VACUUM` commands, among others. To learn more about hooks and see examples, see [our guide on using hooks](hooks).