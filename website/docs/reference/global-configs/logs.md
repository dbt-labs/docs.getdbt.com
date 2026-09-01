---
title: "Logs"
id: "logs"
sidebar: "logs"
---

### Log formatting

dbt outputs logs to two different locations: CLI console and the log file.

<VersionBlock lastVersion="1.99">

The `LOG_FORMAT` and `LOG_FORMAT_FILE` configs specify how dbt's logs should be formatted, and they each have the same options: `json`, `text`, and `debug`.

</VersionBlock>

<VersionBlock firstVersion="2.0">

The `LOG_FORMAT` and `LOG_FORMAT_FILE` configs specify how dbt's logs should be formatted. Shared options are `text`, `json`, and `default`. The `otel` option is available for `LOG_FORMAT` only (console output). Setting `--log-format-file otel` has no effect.

The `otel` format streams [OpenTelemetry](https://opentelemetry.io/)-style structured telemetry to the console. It uses a different schema than <Constant name="core" />'s `json` logs. For JSONL files, Parquet export, OTLP, and how this maps to <Constant name="core" /> structured logging, refer to [<Constant name="fusion" /> telemetry and observability](/reference/telemetry-observability).

<File name='Usage'>

```text
dbt build --log-format otel
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.99">

<File name='Usage'>

```text
dbt run --log-format json
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.99">

The `text` format is the default for console logs and has plain text messages prefixed with a simple timestamp:

```
23:30:16  Running with dbt=1.8.0
23:30:17  Registered adapter: postgres=1.8.0
```

</VersionBlock>

<VersionBlock firstVersion="2.0">

The `text` format is the default for console logs and prints plain text progress messages:

```
dbt-fusion 2.0.0-preview.181
   Loading ~/.dbt/profiles.yml
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

The `debug` format is the default for the log file and is the same as the `text` format but with a more detailed timestamp and also includes the [`invocation_id`](/reference/dbt-jinja-functions/invocation_id), [`thread_id`](/reference/dbt-jinja-functions/thread_id), and [log level](/reference/global-configs/logs#log-level) of each message:

```
============================== 16:12:08.555032 | 9089bafa-4010-4f38-9b42-564ec9106e07 ==============================
16:12:08.555032 [info ] [MainThread]: Running with dbt=1.8.0
16:12:08.751069 [info ] [MainThread]: Registered adapter: postgres=1.8.0
```

</VersionBlock>

The `json` format outputs fully structured logs in the <Term id="json" /> format:

<VersionBlock firstVersion="2.0">

```json
{"data": {"log_version": 3, "version": "=2.0.0-preview.181"}, "info": {"category": "", "code": "A001", "extra": {}, "invocation_id": "019fb7d4-ce89-7712-8d06-5ad013a23be9", "level": "info", "msg": "Running with dbt-fusion=2.0.0-preview.181", "name": "MainReportVersion", "pid": 92554, "thread": "tokio-rt-worker", "ts": "2026-07-31T11:00:04.877509Z"}}
{"data": {"msg": "Loading ~/.dbt/profiles.yml"}, "info": {"category": "", "code": "", "extra": {}, "invocation_id": "019fb7d4-ce89-7712-8d06-5ad013a23be9", "level": "info", "msg": "Loading ~/.dbt/profiles.yml", "name": "Generic", "pid": 92554, "thread": "tokio-rt-worker", "ts": "2026-07-31T11:00:04.882928Z"}}
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```json
{"data": {"log_version": 3, "version": "=1.8.0"}, "info": {"category": "", "code": "A001", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Running with dbt=1.8.0", "name": "MainReportVersion", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:54.993336Z"}}
{"data": {"adapter_name": "postgres", "adapter_version": "=1.8.0"}, "info": {"category": "", "code": "E034", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Registered adapter: postgres=1.8.0", "name": "AdapterRegistered", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:56.437986Z"}}
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

When the `LOG_FORMAT` is set explicitly, it will take effect in both the console and log files, whereas the `LOG_FORMAT_FILE` only affects the log file.

</VersionBlock>

<VersionBlock firstVersion="2.0">

When the `LOG_FORMAT` is set explicitly to `text`, `json`, or `default`, it takes effect in both the console and log files. The `otel` value applies to console output only. Use `LOG_FORMAT_FILE` to set a different format for the log file (`text`, `json`, or `default`).

</VersionBlock>

<File name='Usage'>

```text
dbt run --log-format-file json
```

</File>

<VersionBlock lastVersion="1.99">

:::tip Tip: verbose structured logs

Use `json` formatting value in conjunction with the `DEBUG` config to produce rich log information which can be piped into monitoring tools for analysis:

```text
dbt run --debug --log-format json
```

Refer to [structured logging](/reference/events-logging#structured-logging) for more details.

:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

:::tip Tip: structured observability

Use `--log-format otel` to stream OpenTelemetry-style telemetry to the console, or use `--otel-file-name` and related flags for file and platform integrations. Refer to [<Constant name="fusion" /> telemetry and observability](/reference/telemetry-observability).

For JSON-formatted log lines, use `--log-format json` with the `DEBUG` config:

```text
dbt build --debug --log-format json
```

:::

</VersionBlock>

### Log Level

The `LOG_LEVEL` config sets the minimum severity of events captured in the console and file logs. This is a more flexible alternative to the `--debug` flag. The available options for the log levels are `debug`, `info`, `warn`, `error`, or `none`.

- Setting the `--log-level` will configure console and file logs. 

  ```text
  dbt run --log-level debug
  ```

- Setting the `LOG_LEVEL` to `none` will disable information from being sent to either the console or file logs. 
  
  ```text
  dbt run --log-level none
  ```

- To set the file log level as a different value than the console, use the `--log-level-file` flag. 

  ```text
  dbt run --log-level-file error
  ```

- To only disable writing to the logs file but keep console logs, set `LOG_LEVEL_FILE` config to none.
  ```text
  dbt run --log-level-file none
  ```

### Debug-level logging

The `DEBUG` config redirects dbt's debug logs to standard output. This has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file. This output is verbose.

The `--debug` flag is also available via shorthand as `-d`.

<File name='Usage'>

```text
dbt run --debug
```

</File>  


### Log and target paths

By default, dbt will write logs to a directory named `logs/`, and all other artifacts to a directory named `target/`. Both of those directories are located relative to `dbt_project.yml` of the active project.

Just like other global configs, it is possible to override these values for your environment or invocation by using CLI options (`--target-path`, `--log-path`) or environment variables (<VersionBlock lastVersion="1.10">`DBT_TARGET_PATH`, `DBT_LOG_PATH`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_TARGET_PATH`, `DBT_ENGINE_LOG_PATH`</VersionBlock>).


### Suppress non-error logs in output

By default, dbt shows all logs in standard out (stdout). You can use the `QUIET` config to show only error logs in stdout. Logs will still include the output of anything passed to the [`print()`](/reference/dbt-jinja-functions/print) macro.  For example, you might suppress all but error logs to more easily find and debug a Jinja error.

<File name='profiles.yml'>

```yaml
config:
  quiet: true
```

</File>

Supply the `-q` or `--quiet` flag to `dbt run` to show only error logs and suppress non-error logs.

```text
dbt run --quiet
```

### dbt list logging

In [dbt version 1.5](/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.5#behavior-changes), we updated the logging behavior of the [dbt list](/reference/commands/list) command to include `INFO` level logs by default.


You can use either of these parameters to ensure clean output that's compatible with downstream processes, such as piping results to [`jq`](https://jqlang.github.io/jq/manual/), a file, or another process:

- `dbt list --log-level warn` (recommended; equivalent to previous default)
- `dbt list --quiet` (suppresses all logging less than `ERROR` level, except for "printed" messages and list output)


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
dbt run --use-colors-file
dbt run --no-use-colors-file
```
