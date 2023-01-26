---
title: "Events and logs"
---

As dbt runs, it generates events. The most common way to see those events is as log messages, written in real time to two places:
- The command line terminal (`stdout`), to provide interactive feedback while running dbt.
- The debug log file (`logs/dbt.log`), to enable detailed [debugging of errors](debugging-errors) when they occur. The text-formatted log messages in this file include all `DEBUG`-level events, as well as contextual information, such as log level and thread name. The location of this file can be configured via [the `log_path` config](log-path).

<File name='CLI'>

```bash
21:35:48  6 of 7 OK created view model dbt_testing.name_list......................... [CREATE VIEW in 0.17s]
```

</File>

<File name='logs/dbt.log'>

```text
============================== 2021-12-02 21:29:35.417263 | c83a0afc-7ed3-49e7-8c0e-797af7f9d7b6 ==============================
21:29:35.417263 [info ] [MainThread]: Running with dbt=1.0.0-rc3
21:29:35.417955 [debug] [MainThread]: running dbt with arguments Namespace(cls=<class 'dbt.task.run.RunTask'>, debug=None, defer=None, exclude=None, fail_fast=None, full_refresh=False, log_cache_events=False, log_format=None, partial_parse=None, printer_width=None, profile=None, profiles_dir='/Users/jerco/.dbt', project_dir=None, record_timing_info=None, rpc_method='run', select=None, selector_name=None, send_anonymous_usage_stats=None, single_threaded=False, state=None, static_parser=None, target=None, threads=None, use_colors=None, use_experimental_parser=None, vars='{}', version_check=None, warn_error=None, which='run', write_json=None)
...
21:29:35.814348 [debug] [Thread-1  ]: On model.my_project.my_table: BEGIN
```

</File>

## Structured logging

_For more details about how the eventing system has been implemented in dbt-core, see the [`events` module README](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/events/README.md)._

<VersionBlock firstVersion="1.4">

Starting in v1.4, the structure of each event in `dbt-core` is backed by a schema defined using [protocol buffers](https://developers.google.com/protocol-buffers). All schemas are defined in the [`types.proto`](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.proto) file within the `dbt-core` codebase.

Every event has the same two top-level keys:
- `info`: Information common to all events. See the table below for the breakdown.
- `data`: Additional structured data specific to this event. If this event relates to a specific node within your dbt project, it will contain a `node_info` dictionary with common attributes.

### `info` fields

| Field       | Description   |
|-------------|---------------|
| `category` | Placeholder for future use (see [dbt-labs/dbt-core#5958](https://github.com/dbt-labs/dbt-core/issues/5958)) |
| `code` | Unique shorthand identifier for this event type, e.g. `A123` |
| `extra` | Dictionary of custom environment metadata, based on environment variables prefixed with `DBT_ENV_CUSTOM_ENV_` |
| [`invocation_id`](invocation_id) | A unique identifier for this invocation of dbt |
| `level` | A string representation of the log level (`debug`, `info`, `warn`, `error`) |
| `log_version` | Integer indicating version |
| `msg` | Human-friendly log message, constructed from structured `data`. **Note**: This message is not intended for machine consumption. Log messages are subject to change in future versions of dbt. |
| `name` | Unique name for this event type, matching the proto schema name |
| `pid` | The process ID for the running dbt invocation which produced this log message |
| `thread_name` | The thread in which the log message was produced, helpful for tracking queries when dbt is run with multiple threads |
| `ts` | When the log line was printed |

### `node_info` fields

For events where it's available, `node_info` will include:

| Field       | Description   |
|-------------|---------------|
| `materialized` | view, table, incremental, etc. |
| `meta` | User-configured [`meta` dictionary](resource-configs/meta) for this node |
| `node_finished_at` | Timestamp when node processing completed |
| `node_name` | Name of this model/seed/test/etc |
| `node_path` | File path to where this resource is defined |
| `node_started_at` | Timestamp when node processing started |
| `node_status` | Current status of the node, either `RunningStatus` (while running) or `NodeStatus` (finished) as defined in [the result contract](https://github.com/dbt-labs/dbt-core/blob/eba90863ed4043957330ea44ca267db1a2d81fcd/core/dbt/contracts/results.py#L75-L88) |
| `resource_type` | `model`, `test`, `seed`, `snapshot`, etc. |
| `unique_id` | The unique identifier for this resource, which can be used to look up more contextual information in the [manifest](artifacts/manifest-json) |

### Example

```json
{
  "data": {
    "description": "sql view model my_dbt_schema.model_a",
    "index": 1,
    "node_info": {
      "materialized": "view",
			"meta": {
				"first": "some_value",
        "second": "1234"
      },
      "node_finished_at": null,
      "node_name": "model_a",
      "node_path": "model_a.sql",
      "node_started_at": "2023-01-11T12:55:57.439506",
      "node_status": "started",
      "resource_type": "model",
      "unique_id": "model.my_dbt_project.model_a"
    },
    "total": 3
  },
  "info": {
    "category": "",
    "code": "Q011",
    "extra": {
      "my_custom_env_var": "my_custom_value"
    },
    "invocation_id": "e5e4e362-5692-4df1-a230-c79e40adbcfb",
    "level": "info",
    "msg": "1 of 3 START sql view model my_dbt_schema.model_a ................................. [RUN]",
    "name": "LogStartLine",
    "pid": 13011,
    "thread": "Thread-1 (worker)",
    "ts": "2023-01-11T12:55:57.440186Z"
  }
}
```

</VersionBlock>

<VersionBlock lastVersion="1.3">

When `json` [log formatting](global-configs#log-formatting) is enabled, dbt will output produce rich, structured log information which can be piped into monitoring tools for analysis, or to power applications with dbt metadata in real time.

Each log line will have the following <Term id="json" /> properties:

| Field       | Description   |
|-------------|---------------|
| `code` | A unique identifier for each event type |
| `data` | A dictionary containing programmatically accessible information about the log line. The contents of this dictionary vary based on the event type which generated this log message. |
| [`invocation_id`](invocation_id) | A unique identifier for this invocation of dbt |
| `level` | A string representation of the log level (`debug`, `info`, `warn`, `error`) |
| `log_version` | Integer indicating version |
| `msg` | The human-friendly log message. **Note**: This message is not intended for machine consumption. Log messages are subject to change in future versions of dbt, and those changes may or may not coincide with a change in `log_version`. |
| `node_info` | If applicable, a dictionary of human- and machine-friendly information about a currently running resource |
| `pid` | The process ID for the running dbt invocation which produced this log message |
| `thread_name` | The thread in which the log message was produced, helpful for tracking queries when dbt is run with multiple threads |
| `ts` | When the log line was printed |
| `type` | Always `log_line` |

If available, `node_info` will include:

| Field       | Description   |
|-------------|---------------|
| `materialized` | view, table, incremental, etc. |
| `node_finished_at` | Timestamp when node processing completed |
| `node_name` | Name of this model/seed/test/etc |
| `node_path` | File path to where this resource is defined |
| `node_started_at` | Timestamp when node processing started |
| `node_status` | Current status of the node, as defined in [the result contract](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/contracts/results.py#L61-L74) |
| `resource_type` | model, test, seed, snapshot, etc. |
| `type` | Always `'node_status'` |
| `unique_id` | The unique identifier for this resource, which can be used to look up contextual information in a [manifest](artifacts/manifest-json) |

### Example

```json
{
	"code": "Q033",
	"data":
	{
		"description": "view model dbt_testing.name_list",
		"index": 7,
		"total": 7
	},
	"invocation_id": "30206572-f52f-4b91-af6d-d2b18fdbbbb8",
	"level": "info",
	"log_version": 1,
	"msg": "7 of 7 START view model dbt_testing.name_list.............................. [RUN]",
	"node_info":
	{
		"materialized": "view",
		"node_finished_at": null,
		"node_name": "male_list_view",
		"node_path": "human/name_list.sql",
		"node_started_at": "2021-12-02T21:47:03.477004",
		"node_status": "started",
		"resource_type": "model",
		"type": "node_status",
		"unique_id": "model.jaffle_shop.name_list"
	},
	"pid": 81915,
	"thread_name": "Thread-4",
	"ts": "2021-12-02T21:47:03.480384Z",
	"type": "log_line"
}
```

</VersionBlock>

## Python interface

:::warning
The `EVENT_HISTORY` object has been deprecated and removed in dbt Core v1.4+
:::

Older versions of `dbt-core` made available a full history of events fired during an invocation, in the form of an `EVENT_HISTORY` object.

The Python interface into events is significantly less mature than the structured logging interface. For all use cases, we recommend parsing JSON-formatted logs.
