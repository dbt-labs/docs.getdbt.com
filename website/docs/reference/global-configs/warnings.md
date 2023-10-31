---
title: "Warnings"
id: "warnings"
sidebar: "Warnings"
---

Turning on the `WARN_ERROR` config will convert dbt warnings into errors. Any time dbt would normally warn, it will instead raise an error. Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

<File name='Usage'>

```text
dbt --warn-error run
...
```
</File>

<VersionBlock firstVersion="1.4">

Converting any and all warnings to errors may suit your needs perfectly, but there may be some warnings you just don't care about, and some you care about a lot.

The `WARN_ERROR_OPTIONS` config gives you more granular control over _exactly which types of warnings_ are treated as errors. Warnings that should be treated as errors can be specified through `include` and/or `exclude` parameters. Warning names can be found in [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

The `include` parameter can set to `"all"` or `"*"` to treat all warnings as exceptions, or to a list of specific warning names to treat as exceptions. When include is set to `"all"` or `"*"`, the optional `exclude` parameter can be set to exclude specifc warnings from being treated as exceptions.

:::info `WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive
`WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive. You can only specify one, even when you're specifying the config in multiple places (e.g. env var + CLI flag), otherwise you'll see a usage error.
:::

```text
dbt --warn-error-options '{"include": "all"}' run
...
```

```text
dbt --warn-error-options '{"include": "all", "exclude": ["NoNodesForSelectionCriteria"]}' run
...
```


```text
dbt --warn-error-options '{"include": ["NoNodesForSelectionCriteria"]}' run
...
```

```text
DBT_WARN_ERROR_OPTIONS='{"include": ["NoNodesForSelectionCriteria"]}' dbt run
...
```

<File name='profiles.yml'>

```yaml

config:
  warn_error_options:
    include: all
    exclude: 
      - NoNodesForSelectionCriteria

```
</File>

</VersionBlock>
