---
title: "ls (list)"
id: "list"
---

## Overview

The `dbt ls` command lists resources in your dbt project. It accepts selector arguments that are similar to those provided in [dbt run](run). `dbt list` is an alias for `dbt ls`.

### Usage
```
dbt ls
     [--resource-type {source,analysis,model,snapshot,test,seed,default,all}]
     [--select SELECTOR [SELECTOR ...]]
     [--models SELECTOR [SELECTOR ...]]
     [--exclude SELECTOR [SELECTOR ...]]
     [--output {json,name,path,selector}]
```

**Arguments**:
- `--resource-type`: This flag limits the "resource types" that dbt will return in the `dbt ls` command. By default, the following resources are included in the results of `dbt ls`: models, snapshots, seeds, tests, and sources.
- `--select`: This flag specifies one or more "selectors" used to filter the nodes returned by the `dbt ls` command. See the docs on the [resource selection syntax](model-selection-syntax) for more information on selecting resources in dbt
- `--models`: Like the `--select` flag, this flag is used to select nodes. It implies `--resource-type=model`, and will only return models in the results of the `dbt ls` command.
- `--exclude`: Specify selectors that should be _excluded_ from the list of returned nodes.
- `--output`: This flag controls the format of output from the `dbt ls` command.

Note that the `dbt ls` command does not include models which are disabled or schema tests which depend on models which are disabled. All returned resources will have a `config.enabled` value of `true`.

### Example usage

**Listing models by selector**
```
$ dbt ls --models snowplow.*
model.snowplow.snowplow_base_events
model.snowplow.snowplow_base_web_page_context
model.snowplow.snowplow_id_map
model.snowplow.snowplow_page_views
model.snowplow.snowplow_sessions
...
```

**Listing tests by tag name**
```
$ dbt ls --select tag:nightly --resource-type test
model.my_project.orders
model.my_project.order_items
model.my_project.products
...
```

**Listing JSON output**
```
$ dbt ls --models snowplow.* --output json
{"name": "snowplow_events", "resource_type": "model", "package_name": "snowplow",  ...}
{"name": "snowplow_page_views", "resource_type": "model", "package_name": "snowplow",  ...}
...
```

**Listing file paths**
```
dbt ls --models snowplow.* --output path
models/base/snowplow_base_events.sql
models/base/snowplow_base_web_page_context.sql
models/identification/snowplow_id_map.sql
...
```