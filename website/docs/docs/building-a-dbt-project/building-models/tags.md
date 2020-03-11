---
title: "Using tags"
id: "tags"
---

## Overview
dbt models can be "tagged" with labels to support easy categorization and graph selection. Tags can be used in many different ways. Here are some examples:
- tag models with how frequently they should be run (eg. `hourly` vs. `nightly`)
- tag models by their data source
- tag models that contain PII

## Configuration
Like all dbt configurations, tags can be applied in the `dbt_project.yml` file, or directly inside of a model sql file using `{{ config() }}`.

### Using dbt_project.yml
Tags accumulate hierarchically, so multiple tags can be set for a model using the folder hierarchy. Tags can be provided either as a string, or as a list of strings, as shown below.

<File name='dbt_project.yml'>

```yaml
# The following dbt_project.yml configures a project that looks like this:
# .
# └── models
#     ├── csvs
#     │   └── goals.sql
#     └── events
#         └── stg_events.sql

name: my_project
version: 1.0.0


models:
  my_project:
    tags: "nightly"

    csvs:
      tags: "manual"
      
    events:
      tags: ["events", "hourly"]
      materialized: table
```

</File>

The configuration above results in the following tag settings:

| Model | Tags |
| ----- | ---- |
| csvs/goals.sql | `nightly`, `manual` |
| events/stg_events.sql | `nightly`, `events`, `hourly` |

### Using config()

Tags can be configured using the `config()` function inside of a model.

<File name='models/my_model.sql'>

```sql

{{ config(tags=["events", "hourly"]) }}

select * from ...
```

</File>

## Selecting models with tags

The `--models` syntax to [dbt run](run) supports the specification of tags. To select models by their tags, use the `tag:` selector, followed by the name of the tag to select. For example:

```
# Run all models tagged "nightly"
$ dbt run --model tag:nightly

# Run all models tagged "nightly", except those that are tagged hourly
$ dbt run --model tag:nightly --exclude tag:hourly
```

For a full specification of the `--models` and `--exclude` flags, check out the [dbt run](run) documentation.
