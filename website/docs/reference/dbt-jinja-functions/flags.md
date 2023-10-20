---
title: "About flags variable"
sidebar_label: "flags"
id: "flags"
description: "The `flags` variable contains values of flags provided on the cli."
---

The `flags` variable contains values of flags provided on the command line.

__Example usage:__

<File name='flags.sql'>

```sql
{% if flags.FULL_REFRESH %}
drop table ...
{% else %}
-- no-op
{% endif %}
```

</File>

The list of available flags is defined in the [`flags` module](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/flags.py) within `dbt-core`.

Recommended use cases include:
- different <Term id="materialization" /> logic based on "run modes," such as `flags.FULL_REFRESH` and `flags.STORE_FAILURES`
- running hooks conditionally based on the current command / task type, via `flags.WHICH`

**Note:** It is _not_ recommended to use flags as an input to parse-time configurations, properties, or dependencies (`ref` + `source`). Flags are likely to change in every invocation of dbt, and their parsed values will become stale (and yield incorrect results) in subsequent invocations that have partial parsing enabled. For more details, see [the docs on parsing](/reference/parsing).


<VersionBlock firstVersion="1.3">

### invocation_args_dict

For the full set of information passed from the CLI—subcommand, flags, arguments—you can use `invocation_args_dict`. This is equivalent to the `args` dictionary in [`run_results.json`](/reference/artifacts/run-results-json).

<File name='models/my_model.sql'>

```sql
-- invocation_args_dict:
-- {{ invocation_args_dict }}

-- dbt_metadata_envs:
-- {{ dbt_metadata_envs }}

select 1 as id
```

</File>

<VersionBlock firstVersion="1.3" lastVersion="1.5">

```shell
$ DBT_ENV_CUSTOM_ENV_MYVAR=myvalue dbt compile -s my_model
```

<File name='target/compiled/my_project/models/my_model.sql'>

```sql
-- invocation_args_dict:
-- {'write_json': True, 'use_colors': True, 'printer_width': 80, 'version_check': True, 'partial_parse': True, 'static_parser': True, 'profiles_dir': '/Users/.../.dbt', 'send_anonymous_usage_stats': False, 'event_buffer_size': 100000, 'quiet': False, 'no_print': False, 'parse_only': False, 'which': 'compile', 'rpc_method': 'compile', 'indirect_selection': 'eager'}

-- dbt_metadata_envs:
-- {'MYVAR': 'myvalue'}

select 1 as id
```

</File>

</VersionBlock>


<VersionBlock firstVersion="1.6">

The `invocation_command` key within `invocation_args_dict` includes the entire subcommand when it compiles:

```shell
$ DBT_ENV_CUSTOM_ENV_MYVAR=myvalue dbt compile -s my_model

12:10:22  Running with dbt=1.6.0-b8
12:10:22  Registered adapter: postgres=1.6.0-b8
12:10:22  Found 1 seed, 1 model, 349 macros
12:10:22
12:10:22  Concurrency: 5 threads (target='dev')
12:10:22
12:10:22  Compiled node 'my_model' is:
-- invocation_args_dict:
-- {'log_format_file': 'debug', 'log_level': 'info', 'exclude': (), 'send_anonymous_usage_stats': True, 'which': 'compile', 'defer': False, 'output': 'text', 'log_format': 'default', 'macro_debugging': False, 'populate_cache': True, 'static_parser': True, 'vars': {}, 'warn_error_options': WarnErrorOptions(include=[], exclude=[]), 'quiet': False, 'select': ('my_model',), 'indirect_selection': 'eager', 'strict_mode': False, 'version_check': False, 'enable_legacy_logger': False, 'log_path': '/Users/jerco/dev/scratch/testy/logs', 'profiles_dir': '/Users/jerco/.dbt', 'invocation_command': 'dbt compile -s my_model', 'log_level_file': 'debug', 'project_dir': '/Users/jerco/dev/scratch/testy', 'favor_state': False, 'use_colors_file': True, 'write_json': True, 'partial_parse': True, 'printer_width': 80, 'print': True, 'cache_selected_only': False, 'use_colors': True, 'introspect': True}

-- dbt_metadata_envs:
-- {'MYVAR': 'myvalue'}

select 1 as id
```

</VersionBlock>

</VersionBlock>
