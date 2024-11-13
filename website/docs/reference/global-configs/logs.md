---
title: "Logs"
id: "logs"
sidebar: "logs"
---

### Log Formatting

dbt outputs logs to two different locations: CLI console and the log file.

The `LOG_FORMAT` and `LOG_FORMAT_FILE` configs specify how dbt's logs should be formatted, and they each have the same options: `json`, `text`, and `debug`.

<File name='Usage'>

```text
dbt --log-format json run
```

</File>

The `text` format is the default for console logs and has plain text messages prefixed with a simple timestamp:

```
23:30:16  Running with dbt=1.8.0
23:30:17  Registered adapter: postgres=1.8.0
```

The `debug` format is the default for the log file and is the same as the `text` format but with a more detailed timestamp and also includes the [`invocation_id`](/reference/dbt-jinja-functions/invocation_id), [`thread_id`](/reference/dbt-jinja-functions/thread_id), and [log level](/reference/global-configs/logs#log-level) of each message:

```
============================== 16:12:08.555032 | 9089bafa-4010-4f38-9b42-564ec9106e07 ==============================
16:12:08.555032 [info ] [MainThread]: Running with dbt=1.8.0
16:12:08.751069 [info ] [MainThread]: Registered adapter: postgres=1.8.0
```

The `json` format outputs fully structured logs in the <Term id="json" /> format:

```json
{"data": {"log_version": 3, "version": "=1.8.0"}, "info": {"category": "", "code": "A001", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Running with dbt=1.8.0", "name": "MainReportVersion", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:54.993336Z"}}
{"data": {"adapter_name": "postgres", "adapter_version": "=1.8.0"}, "info": {"category": "", "code": "E034", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Registered adapter: postgres=1.8.0", "name": "AdapterRegistered", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:56.437986Z"}}
```

When the `LOG_FORMAT` is set explicitly, it will take affect in both the console and log files whereas the `LOG_FORMAT_FILE` only affects the log file.

<File name='Usage'>

```text
dbt --log-format-file json run
```

</File>

:::tip Tip: verbose structured logs

Use `json` formatting value in conjunction with the `DEBUG` config to produce rich log information which can be piped into monitoring tools for analysis:

```text
dbt --debug --log-format json run
```

See [structured logging](/reference/events-logging#structured-logging) for more details.

:::

### Log Level

The `LOG_LEVEL` config sets the minimum severity of events captured in the console and file logs. This is a more flexible alternative to the `--debug` flag. The available options for the log levels are `debug`, `info`, `warn`, `error`, or `none`.

Setting the `--log-level` will configure console and file logs. 


```text
dbt --log-level debug run
```

To set the file log level as a different value than the console, use the `--log-level-file` flag. 


```text
dbt --log-level-file error run
```

### Debug-level logging

The `DEBUG` config redirects dbt's debug logs to standard output. This has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file. This output is verbose.

The `--debug` flag is also available via shorthand as `-d`.

<File name='Usage'>

```text
dbt --debug run
...

```

</File>  


### Log and target paths

By default, dbt will write logs to a directory named `logs/`, and all other artifacts to a directory named `target/`. Both of those directories are located relative to `dbt_project.yml` of the active project.

Just like other global configs, it is possible to override these values for your environment or invocation by using CLI options (`--target-path`, `--log-path`) or environment variables (`DBT_TARGET_PATH`, `DBT_LOG_PATH`).


### Suppress non-error logs in output

By default, dbt shows all logs in standard out (stdout). You can use the `QUIET` config to show only error logs in stdout. Logs will still include the output of anything passed to the [`print()`](/reference/dbt-jinja-functions/print) macro.  For example, you might suppress all but error logs to more easily find and debug a jinja error.

<File name='profiles.yml'>

```yaml
config:
  quiet: true
```

</File>

Supply the `-q` or `--quiet` flag to `dbt run` to show only error logs and suppress non-error logs.

```text
dbt --quiet run
...
```

### dbt list logging

In [dbt version 1.5](/docs/dbt-versions/core-upgrade/upgrading-to-v1.5#behavior-changes), we updated the logging behavior of the [dbt list](/reference/commands/list) command to include `INFO` level logs by default.


You can use either of these parameters to ensure clean output that's compatible with downstream processes, such as piping results to [`jq`](https://jqlang.github.io/jq/manual/), a file, or another process:

- `dbt --log-level warn list` (recommended; equivalent to previous default)
- `dbt --quiet list` (suppresses all logging less than `ERROR` level, except for "printed" messages and list output)


### Logging relational cache events

import LogLevel from '/snippets/_log-relational-cache.md';

<LogLevel
event={<a href="https://docs.getdbt.com/reference/global-configs/cache">relational cache</a>}
/>

### Color

You can set the color preferences for the file logs only within `profiles.yml` or using the `--use-colors-file / --no-use-colors-file` flags.

<File name='profiles.yml'>

```yaml
config:
  use_colors_file: False
```

</File>

```text
dbt --use-colors-file run
dbt --no-use-colors-file run
```
