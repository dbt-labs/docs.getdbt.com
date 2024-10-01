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


Converting any warnings to errors may suit your needs perfectly, but there may be some warnings you just don't care about, and some you care about a lot. The `WARN_ERROR_OPTIONS` config gives you more granular control over _exactly which types of warnings_ are treated as errors. 

<VersionBlock lastVersion="1.7">

Warnings that should be treated as errors can be specified through `include` and/or `exclude` parameters. Warning names can be found in [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

The `include` parameter can be set to `"all"` or `"*"` to treat all warnings as exceptions, or to a list of specific warning names to treat as exceptions. When `include` is set to `"all"` or `"*"`, the optional `exclude` parameter can be set to exclude specific warnings from being treated as exceptions.

</VersionBlock>

<VersionBlock firstVersion="1.8">

- Warnings that should be treated as errors can be specified through `error` and/or `warn` parameters. Warning names can be found in [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

- The `error` parameter can be set to `"all"` or `"*"` to treat all warnings as exceptions, or to a list of specific warning names to treat as exceptions. When `error` is set to `"all"` or `"*"`, the optional `warn` parameter can be set to exclude specific warnings from being treated as exceptions.

- Use the `silence` parameter to ignore warnings through project flags, without needing to re-specify the silence list every time. For example, to silence deprecation warnings or certain warnings you want to ignore across your project, you can specify them in the `silence` parameter. This is useful in large projects where certain warnings aren't critical and can be ignored to keep the noise low and logs clean.


<File name='dbt_project.yml'>

```yaml
name: "my_dbt_project"
tests:
  +enabled: True
flags:
  warn_error_options:
    error: # Previously called "include"
    warn: # Previously called "exclude"
    silence: # To silence or ignore warnings
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>


:::info `WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive
`WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive. You can only specify one, even when you're specifying the config in multiple places (e.g. env var + CLI flag), otherwise, you'll see a usage error.
:::

<VersionBlock lastVersion="1.7">

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

Values for `error`, `warn`, and/or `silence` should be passed on as arrays. For example, `dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run` not `dbt --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}' run`.


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

<VersionBlock firstVersion="1.8">

```text
dbt --warn-error-options '{"error": "all"}' run
...
```

```text
dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run
...
```


```text
dbt --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}' run
...
```

```text
DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
...
```

<File name='profiles.yml'>

```yaml
config:
  warn_error_options:
    error: # Previously called "include"
    warn: # Previously called "exclude"
      - NoNodesForSelectionCriteria
    silence: # Silence or ignore warnings
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>
