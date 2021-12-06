---
title: "Global Configs"
id: "global-configs"
---

### About Global Configs

Global configs enable you to fine-tune how dbt runs projects on your machine—whether your personal laptop, an orchestration tool running remotely, or (in some cases) dbt Cloud. They differ from [project configs](reference/dbt_project.yml) and [resource configs](reference/configs-and-properties), which tell dbt _what_ to run.

Global configs control things like the visual output of logs, the manner in which dbt parses your project, and what to do when dbt finds a version mismatch or a failing model.

These configs are "global" because they are available for all dbt commands, and because they apply across all projects run on the same machine.

Starting in v1.0, you can set global configs in three places. When all three are set, command line flags take precedence, then environment variables, and last profile configs.

#### Command line flags

Command line (CLI) flags immediately follow `dbt` and precede your subcommand. When set, CLI flags override environment variables and profile configs. You can use `--this-config` CLI flag to turn on boolean configs, and a `--no-this-config` CLI flag to turn off boolean configs:

<File name='CLI flags'>

```text
$ dbt --<this-config> <subcommand>
$ dbt --no-this-config

```

</File>

#### Environment variables

Environment variables contain a `DBT_` prefix

<File name='Env var'>

```text

$ export DBT_THIS_CONFIG=True
$ dbt run

```

</File>

#### Profile (or user) configurations

You can set profile (or user) configurations in the `config:` block of `profiles.yml`. You would use the profile config to set defaults for all projects running on your local machine.

<File name='profiles.yml'>

```yaml

config:
  this_config: true

```

</File>

## Failing fast

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

## Checking version compatibility

Projects are recommended to set [dbt version requirements](require-dbt-version), especially if they use features that are newer, or which may break in future versions of dbt Core. By default, if you run a project with an incompatible dbt version, dbt will raise an error.

You can use the `VERSION_CHECK` config to disable this check and suppress the error message:
```
$ dbt --no-version-check run
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

## Debug-level logging
The `DEBUG` config redirects dbt's debug logs to standard out. The has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file. This output is verbose.

The `--debug` flag is also available via shorthand as `-d`.

<File name='Usage'>

```text
$ dbt --debug run
...

```

</File>

## Log Formatting

The `LOG_FORMAT` config specifies how dbt's logs should be formatted. The value for this flag can be one of: `text`, `json,` or `default`. Use the `json` formatting value in conjunction with `DEBUG` flag to produce rich log information which can be piped into monitoring tools for analysis.

When `json` log formatting is used, each log line will have the following JSON properties:
- timestamp: when the log line was printed
- message: the textual log message
- channel: the source for the log (eg. `dbt`, or `some_module`)
- level: an integer indicating the log level for the log line (10=info, 11=debug, ...)
- levelname: a string representation of the log level
- thread_name: the thread in which the log message was produced
- process: the PID for the running dbt invocation which produced this log message
- extra: a dictionary containing "extra" information about the log line. This contents of this dictionary vary based on the specific log message that is being emitted. This dictionary contains programmatically accessible information to contextualize the log message.

<File name='Usage'>

```text
$ dbt --log-format json run
{"timestamp": "2019-11-24T18:51:48.683295Z", "message": "Running with dbt=0.15.0", "channel": "dbt", "level": 11, "levelname": "INFO", "thread_name": "MainThread", "process": 94207, "extra": {"run_state": "internal"}}
{"timestamp": "2019-11-24T18:51:49.386586Z", "message": "Found 3 models, 0 tests, 1 snapshot, 0 analyses, 120 macros, 0 operations, 2 seed files, 1 source", "channel": "dbt", "level": 11, "levelname": "INFO", "thread_name": "MainThread", "process": 94207, "extra": {"run_state": "internal"}}
```

</File>

## Writing JSON artifacts

The `WRITE_JSON` config determines whether dbt writes JSON artifacts (eg. `manifest.json`, `run_results.json`) to the `target/` directory. JSON serialization can be slow, and turning this flag off _might_ make invocations of dbt faster. Alternatively, you might disable this config if you want to perform a dbt operation and avoid overwriting artifacts from a previous run step.

<File name='Usage'>

```text
$ dbt --no-write-json run
```

</File>

## Strict

As of v1.0, the `-S` or `--strict` flag has been deprecated.

## Warnings as Errors

Turning on the `WARN_ERROR` config will convert dbt warnings into errors. Any time dbt would normally warn, it will instead raise an error. Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

<File name='Usage'>

```text
$ dbt --warn-error run
...
```

</File>

## Partial Parsing
The `PARTIAL_PARSE` config can turn partial parsing on or off in your project. See [the docs on parsing](parsing#partial-parsing) for more details.

<File name='profiles.yml'>

```yaml

config:
  partial_parse: true

```

</File>

<File name='Usage'>

```text
$ dbt --no-partial-parse run
```

</File>

## Static parser
The `STATIC_PARSER` config can enable or disable use of the static parser. See [the docs on parsing](parsing#static-parser) for more details.

<File name='profiles.yml'>

```yaml

config:
  static_parser: true

```

</File>

## Experimental parser
With the `USE_EXPERIMENTAL_PARSER` config, you can opt into the latest and greatest experimental version of the static parser, which is still being sampled for 100% correctness. See [the docs on parsing](parsing#experimental-parser) for more details.

<File name='profiles.yml'>

```yaml

config:
  use_experimental_parser: true

```

</File>

## Use colors

By default, dbt will colorize the output it prints in your terminal. You can turn this off by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  use_colors: False
```

```
$ dbt --use-colors run
$ dbt --no-use-colors run
```

</File>


## Printer width

By default, dbt will print out lines padded to 80 characters wide. You can change this setting by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  printer_width: 120
```

</File>

## Send anonymous usage stats

We want to build the best version of dbt possible, and a crucial part of that is understanding how users work with dbt. To this end, we've added some simple event tracking to dbt (using Snowplow). We do not track credentials, model contents or model names (we consider these private, and frankly none of our business).

Usage statistics are fired when dbt is invoked and when models are run. These events contain basic platform information (OS + python version). You can see all the event definitions in [`tracking.py`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/tracking.py).

By default this is turned on – you can opt out of event tracking at any time by adding the following to your `profiles.yml` file:
```yaml
config:
  send_anonymous_usage_stats: False
```

