---
title: "About dbt ls (list) command"
sidebar_label: "ls (list)"
description: "Read this guide on how dbt's ls (list) command can be used to list resources in your dbt project."
id: "list"
---

The `dbt ls` command lists resources in your dbt project. It accepts selector arguments that are similar to those provided in [dbt run](/reference/commands/run). `dbt list` is an alias for `dbt ls`. While `dbt ls` will read your [connection profile](/docs/core/connect-data-platform/connection-profiles) to resolve [`target`](/reference/dbt-jinja-functions/target)-specific logic, this command will not connect to your database or run any queries.

### Usage
```
dbt ls
     [--resource-type {model,semantic_model,source,seed,snapshot,metric,test,exposure,analysis,default,all}]
     [--select SELECTION_ARG [SELECTION_ARG ...]]
     [--models SELECTOR [SELECTOR ...]]
     [--exclude SELECTOR [SELECTOR ...]]
     [--selector YML_SELECTOR_NAME]
     [--output {json,name,path,selector}]
     [--output-keys KEY_NAME [KEY_NAME]]
```

See [resource selection syntax](/reference/node-selection/syntax) for more information on how to select resources in dbt

**Arguments**:
- `--resource-type`: This flag restricts the "resource types" returned by dbt in the `dbt ls` command. By default, all resource types are included in the results of `dbt ls` except for the analysis type.
- `--select`: This flag specifies one or more selection-type arguments used to filter the nodes returned by the `dbt ls` command
- `--models`: Like the `--select` flag, this flag is used to select nodes. It implies `--resource-type=model`, and will only return models in the results of the `dbt ls` command. Supported for backwards compatibility only.
- `--exclude`: Specify selectors that should be _excluded_ from the list of returned nodes.
- `--selector`: This flag specifies one named selector, defined in a `selectors.yml` file.
- `--output`: This flag controls the format of output from the `dbt ls` command.
- `--output-keys`: If `--output json`, this flag controls which node properties are included in the output.

Note that the `dbt ls` command does not include models which are disabled or schema tests which depend on models which are disabled. All returned resources will have a `config.enabled` value of `true`.

### Example usage

**Listing models by package**
```
$ dbt ls --select snowplow.*
snowplow.snowplow_base_events
snowplow.snowplow_base_web_page_context
snowplow.snowplow_id_map
snowplow.snowplow_page_views
snowplow.snowplow_sessions
...
```

**Listing tests by tag name**
```
$ dbt ls --select tag:nightly --resource-type test
my_project.schema_test.not_null_orders_order_id
my_project.schema_test.unique_orders_order_id
my_project.schema_test.not_null_products_product_id
my_project.schema_test.unique_products_product_id
...
```

**Listing schema tests of incremental models**
```
$ dbt ls --select config.materialized:incremental,test_type:schema
model.my_project.logs_parsed
model.my_project.events_categorized
```

**Listing JSON output**
```
$ dbt ls --select snowplow.* --output json
{"name": "snowplow_events", "resource_type": "model", "package_name": "snowplow",  ...}
{"name": "snowplow_page_views", "resource_type": "model", "package_name": "snowplow",  ...}
...
```

**Listing JSON output with custom keys**

<VersionBlock lastVersion="1.4">

```
$ dbt ls --select snowplow.* --output json --output-keys "name resource_type description"
{"name": "snowplow_events", "description": "This is a pretty cool model",  ...}
{"name": "snowplow_page_views", "description": "This model is even cooler",  ...}
...
```
</VersionBlock>

<VersionBlock firstVersion="1.5">

```
$ dbt ls --select snowplow.* --output json --output-keys name resource_type description
{"name": "snowplow_events", "description": "This is a pretty cool model",  ...}
{"name": "snowplow_page_views", "description": "This model is even cooler",  ...}
...
```

</VersionBlock>

<VersionBlock firstVersion="1.6">

**Listing Semantic models**

```
$ dbt ls -s +semantic_model:number                      

```

</VersionBlock>

**Listing file paths**
```
dbt ls --select snowplow.* --output path
models/base/snowplow_base_events.sql
models/base/snowplow_base_web_page_context.sql
models/identification/snowplow_id_map.sql
...
```
