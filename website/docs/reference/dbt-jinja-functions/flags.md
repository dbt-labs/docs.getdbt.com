---
title: "flags"
id: "flags"
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

**Note:** It is _not_ recommended to use flags as an input to parse-time configurations, properties, or dependencies (`ref` + `source`). Flags are likely to change in every invocation of dbt, and their parsed values will become stale (and yield incorrect results) in subsequent invocations that have partial parsing enabled. For more details, see [the docs on parsing](parsing).

<VersionBlock firstVersion="1.3">

### invocation_args_dict

For the full set of information passed from the CLI—subcommand, flags, arguments—you can use `invocation_args_dict`. This is equivalent to the `args` dictionary in [`run_results.json`](run-results-json).

```sql
-- models/my_model.sql
-- {{ invocation_args_dict }}
-- {{ dbt_metadata_envs }}

select 1 as id
```
Compiles to:
```sql
-- {'write_json': True, 'use_colors': True, 'printer_width': 80, 'version_check': True, 'partial_parse': True, 'static_parser': True, 'profiles_dir': '/Users/.../.dbt', 'send_anonymous_usage_stats': False, 'event_buffer_size': 100000, 'quiet': False, 'no_print': False, 'parse_only': False, 'which': 'compile', 'rpc_method': 'compile', 'indirect_selection': 'eager'}

select 1 as id
```

</VersionBlock>
