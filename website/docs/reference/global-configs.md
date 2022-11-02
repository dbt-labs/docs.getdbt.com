---
title: "Global Configs"
id: "global-configs"
---

## About Global Configs

Global configs enable you to fine-tune _how_ dbt runs projects on your machine—whether your personal laptop, an orchestration tool running remotely, or (in some cases) dbt Cloud. In general, they differ from most [project configs](reference/dbt_project.yml) and [resource configs](reference/configs-and-properties), which tell dbt _what_ to run.

Global configs control things like the visual output of logs, the manner in which dbt parses your project, and what to do when dbt finds a version mismatch or a failing model. These configs are "global" because they are available for all dbt commands, and because they can be set for all projects running on the same machine or in the same environment.

Starting in v1.0, you can set global configs in three places. When all three are set, command line flags take precedence, then environment variables, and last yaml configs (usually `profiles.yml`).

## Command line flags

Command line (CLI) flags immediately follow `dbt` and precede your subcommand. When set, CLI flags override environment variables and profile configs.

Use this non-boolean config structure, replacing  `<THIS-CONFIG>` with the config you are enabling or disabling, `<SETTING>` with the new setting for the config, and `<SUBCOMMAND>`  with the command this config applies to:

<File name='CLI flags'>


```text

$ --<THIS-CONFIG>=<SETTING> <SUBCOMMAND>

```

</File>

Non-boolean config examples:

<File name='CLI flags'>


```text

$ dbt --printer-width=80 run
$ dbt --indirect-selection=eager test

```

</File>

To turn on boolean configs, you would use the `--<THIS-CONFIG>` CLI flag, and a `--no-<THIS-CONFIG>` CLI flag to turn off boolean configs, replacing `<THIS-CONFIG>` with the config you are enabling or disabling and `<SUBCOMMAND>`  with the command this config applies to.

Boolean config structure:

<File name='CLI flags'>


```text
$ dbt --<THIS-CONFIG> <SUBCOMMAND>
$ dbt --no-<THIS-CONFIG> <SUBCOMMAND>

```

</File>

Boolean config example:

<File name='CLI flags'>


```text

$ dbt --version-check run
$ dbt --no-version-check run

```

</File>

## Environment variables

Environment variables contain a `DBT_` prefix

<File name='Env var'>

```text

$ export DBT_<THIS-CONFIG>=True
$ dbt run

```

</File>

## Yaml configurations

For most global configurations, you can set "user profile" configurations in the `config:` block of `profiles.yml`. This style of configuration sets default values for all projects using this profile directory—usually, all projects running on your local machine.

<File name='profiles.yml'>

```yaml

config:
  <THIS-CONFIG>: true

```

</File>

<VersionBlock firstVersion="1.2">

The exception: Some global configurations are actually set in `dbt_project.yml`, instead of `profiles.yml`, because they control where dbt places logs and artifacts. Those file paths are always relative to the location of `dbt_project.yml`. For more details, see ["Log and target paths"](#log-and-target-paths) below.

</VersionBlock>

<VersionBlock firstVersion="1.1">

### Cache database objects for selected resource

:::caution Experimental config flag
This should be considered an _unstable_ config flag because it is experimental and subject to change. We reserve the right to make breaking changes to this config flag.
:::

At the start of runs, dbt caches metadata about all the objects in all the schemas where it might materialize resources (such as models). By default, dbt caches all schemas related to the project. When this config is enabled, dbt will only cache schemas related to selected resources for the current run. This can offer significant speed improvements when running a small subset of a large project.

For example, to improve speed and performance while focused on developing Salesforce models, which are materialized into their own dedicated schema, you would select those models and pass the `cache-selected-only` flag:

```text

$ dbt --cache-selected-only run --select salesforce

```

The previous example enables you to start working with your salesforce models, and dbt will only cache those models instead of the entire project.

To set the config in your `profile.yml`:
<File name='profiles.yml'>

```yaml

config:
  cache_selected_only: true

```

</File>

</VersionBlock>

### Checking version compatibility

Projects are recommended to set [dbt version requirements](require-dbt-version), especially if they use features that are newer, or which may break in future versions of dbt Core. By default, if you run a project with an incompatible dbt version, dbt will raise an error.

You can use the `VERSION_CHECK` config to disable this check and suppress the error message:

```
$ dbt --no-version-check run
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

### Debug-level logging

The `DEBUG` config redirects dbt's debug logs to standard out. The has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file. This output is verbose.

The `--debug` flag is also available via shorthand as `-d`.

<File name='Usage'>

```text
$ dbt --debug run
...

```

</File>  

### Experimental parser

With the `USE_EXPERIMENTAL_PARSER` config, you can opt into the latest and greatest experimental version of the static parser, which is still being sampled for 100% correctness. See [the docs on parsing](parsing#experimental-parser) for more details.

<File name='profiles.yml'>

```yaml

config:
  use_experimental_parser: true

```

</File>

### Failing fast

Supply the `-x` or `--fail-fast` flag to `dbt run` to make dbt exit immediately if a single resource fails to build. If other models are in-progress when the first model fails, then dbt will terminate the connections for these still-running models.

For example, you can select four models to run, but if a failure occurs in the first model, the failure will prevent other models from running:

```text
$ dbt -x run --threads 1
Running with dbt=1.0.0
Found 4 models, 1 test, 1 snapshot, 2 analyses, 143 macros, 0 operations, 1 seed file, 0 sources

14:47:39 | Concurrency: 1 threads (target='dev')
14:47:39 |
14:47:39 | 1 of 4 START table model test_schema.model_1........... [RUN]
14:47:40 | 1 of 4 ERROR creating table model test_schema.model_1.. [ERROR in 0.06s]
14:47:40 | 2 of 4 START view model test_schema.model_2............ [RUN]
14:47:40 | CANCEL query model.debug.model_2....................... [CANCEL]
14:47:40 | 2 of 4 ERROR creating view model test_schema.model_2... [ERROR in 0.05s]

Database Error in model model_1 (models/model_1.sql)
  division by zero
  compiled SQL at target/run/debug/models/model_1.sql

Encountered an error:
FailFast Error in model model_1 (models/model_1.sql)
  Failing early due to test failure or runtime error
```

### Log Formatting

The `LOG_FORMAT` config specifies how dbt's logs should be formatted. If the value of this config is `json`, dbt will output fully structured logs in <Term id="json" /> format; otherwise, it will output text-formatted logs that are sparser for the CLI and more detailed in `logs/dbt.log`.

<File name='Usage'>

```text
$ dbt --log-format json run
{"code": "A001", "data": {"v": "=1.0.0"}, "invocation_id": "1193e449-4b7a-4eb1-8e8e-047a8b3b7973", "level": "info", "log_version": 1, "msg": "Running with dbt=1.0.0", "node_info": {}, "pid": 35098, "thread_name": "MainThread", "ts": "2021-12-03T10:46:59.928217Z", "type": "log_line"}
```

:::tip Tip: verbose structured logs

Use `json` formatting value in conjunction with the `DEBUG` config to produce rich log information which can be piped into monitoring tools for analysis:

```text
$ dbt --debug --log-format json run
```

See [structured logging](events-logging#structured-logging) for more details.

:::

</File>

### Partial Parsing

The `PARTIAL_PARSE` config can turn partial parsing on or off in your project. See [the docs on parsing](parsing#partial-parsing) for more details.

<File name='profiles.yml'>

```yaml

config:
  partial_parse: true

```

</File>

<File name='Usage'>

```text
dbt --no-partial-parse run
```

</File>

### Printer width

By default, dbt will print out lines padded to 80 characters wide. You can change this setting by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  printer_width: 120
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

### Send anonymous usage stats

We want to build the best version of dbt possible, and a crucial part of that is understanding how users work with dbt. To this end, we've added some simple event tracking to dbt (using Snowplow). We do not track credentials, raw model contents or model names (we consider these private, and frankly none of our business).

Usage statistics are fired when dbt is invoked and when models are run. These events contain basic platform information (OS + python version) and metadata such as whether the invocation succeeded, how long it took, an anonymized hash key representing the raw model content, and number of nodes that were run. You can see all the event definitions in [`tracking.py`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/tracking.py).

By default this is turned on – you can opt out of event tracking at any time by adding the following to your `profiles.yml` file:

```yaml
config:
  send_anonymous_usage_stats: False
```

You can also use the DO_NOT_TRACK environmental variable to enable or disable sending anonymous data. For more information, see [Environmental variables](/docs/build/environment-variables).

`DO_NOT_TRACK=1` is the same as `DBT_SEND_ANONYMOUS_USAGE_STATS=False`
`DO_NOT_TRACK=0` is the same as `DBT_SEND_ANONYMOUS_USAGE_STATS=True`

### Static parser

The `STATIC_PARSER` config can enable or disable use of the static parser. See [the docs on parsing](parsing#static-parser) for more details.

<File name='profiles.yml'>

```yaml

config:
  static_parser: true

```

</File>

### Strict

As of v1.0, the `-S` or `--strict` flag has been deprecated.

<VersionBlock firstVersion="1.1">

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
$ dbt --quiet run
...

```

### Suppress `print()` messages in stdout

By default, dbt includes `print()` messages in standard out (stdout). You can use the `NO_PRINT` config to prevent these messages from showing up in stdout.

<File name='profiles.yml'>

```yaml
config:
  no_print: true
```

</File>

Supply `--no-print` flag to `dbt run` to suppress `print()` messages from showing in stdout.

```text
$ dbt --no-print run
...

```

</VersionBlock>

### Use colors

By default, dbt will colorize the output it prints in your terminal. You can turn this off by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  use_colors: False
```

```text
$ dbt --use-colors run
$ dbt --no-use-colors run
```

</File>

### Warnings as Errors

Turning on the `WARN_ERROR` config will convert dbt warnings into errors. Any time dbt would normally warn, it will instead raise an error. Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

<File name='Usage'>

```text
$ dbt --warn-error run
...
```

</File>

### Writing JSON artifacts

The `WRITE_JSON` config determines whether dbt writes JSON artifacts (eg. `manifest.json`, `run_results.json`) to the `target/` directory. JSON serialization can be slow, and turning this flag off _might_ make invocations of dbt faster. Alternatively, you might disable this config if you want to perform a dbt operation and avoid overwriting artifacts from a previous run step.

<File name='Usage'>

```text
dbt --no-write-json run
```

</File>
