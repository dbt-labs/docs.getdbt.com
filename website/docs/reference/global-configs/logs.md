---
title: "Logs"
id: "logs"
sidebar: "logs"
---

### Log Formatting

The `LOG_FORMAT` config specifies how dbt's logs should be formatted. If the value of this config is `json`, dbt will output fully structured logs in <Term id="json" /> format; otherwise, it will output text-formatted logs that are sparser for the CLI and more detailed in `logs/dbt.log`.

<File name='Usage'>

```text
dbt --log-format json run
{"code": "A001", "data": {"v": "=1.0.0"}, "invocation_id": "1193e449-4b7a-4eb1-8e8e-047a8b3b7973", "level": "info", "log_version": 1, "msg": "Running with dbt=1.0.0", "node_info": {}, "pid": 35098, "thread_name": "MainThread", "ts": "2021-12-03T10:46:59.928217Z", "type": "log_line"}
```

</File>

<VersionBlock firstVersion="1.5">

To set the `LOG_FORMAT_FILE` type output for the file without impacting the console log format, use the `log-format-file` flag.


```text
dbt --log-format-file json run
```

</VersionBlock>

:::tip Tip: verbose structured logs

Use `json` formatting value in conjunction with the `DEBUG` config to produce rich log information which can be piped into monitoring tools for analysis:

```text
dbt --debug --log-format json run
```

See [structured logging](/reference/events-logging#structured-logging) for more details.

:::

<VersionBlock firstVersion="1.5">

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


</VersionBlock>

### Debug-level logging

The `DEBUG` config redirects dbt's debug logs to standard output. This has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file. This output is verbose.

The `--debug` flag is also available via shorthand as `-d`.

<File name='Usage'>

```text
dbt --debug run
...

```

</File>  

<VersionBlock firstVersion="1.2">

### Log and target paths

By default, dbt will write logs to a directory named `logs/`, and all other artifacts to a directory named `target/`. Both of those directories are located relative to `dbt_project.yml` of the active project—that is, the root directory from which dbt is run.

Just like other global configs, it is possible to override these values for your environment or invocation by using CLI flags (`--target-path`, `--log-path`) or environment variables (`DBT_TARGET_PATH`, `DBT_LOG_PATH`).

Unlike the other global configs documented on this page, which can be set in `profiles.yml`, the project paths are configured in `dbt_project.yml`. This is because `profiles.yml` and `dbt_project.yml` are most often located in separate file systems on your machine, and the log and artifact paths are always defined relative to the location of `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
[target-path](target-path): "other-target"
[log-path](log-path): "other-logs"
```

</File>

</VersionBlock>

### Suppress non-error logs in output

By default, dbt shows all logs in standard out (stdout). You can use the `QUIET` config to show only error logs in stdout. Logs will still include the output of anything passed to the `print()` macro.  For example, you might suppress all but error logs to more easily find and debug a jinja error.

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

<VersionBlock firstVersion="1.5">

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

</VersionBlock>
