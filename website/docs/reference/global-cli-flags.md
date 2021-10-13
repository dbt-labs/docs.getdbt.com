---
title: "Global CLI flags"
id: "global-cli-flags"
---

dbt commands (eg. `run`, `test`, etc) support their own command-specific CLI flags. In addition to these command specific flags, the dbt command itself supports "global" flags applicable to *all* subcommands.

## Version

The `--version`  flag returns information about the currently installed version of dbt.

<File name='Usage'>

```text
$ dbt --version
installed version: 0.15.1
   latest version: 0.15.1

Up to date!
```

</File>

## Record timing info

The `-r` or `--record-timing-info` flag saves performance profiling information to a file. This file can be visualized with `snakeviz` to understand the performance characteristics of a dbt invocation

<File name='Usage'>

```text
$ dbt -r timing.txt run
...

$ snakeviz timing.txt
```

</File>

## Debug
The `-d` or `--debug` flag redirects dbt's debug logs to standard out. The has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file. This output is verbose.

<File name='Usage'>

```text
$ dbt --debug run
...

```

</File>

## Log Formatting

The `--log-format` flag specifies how dbt's logs should be formatted. The value for this flag can be one of: `text`, `json,` or `default`. Use the `json` formatting value in conjunction with the `--debug` flag to produce rich log information which can be piped into monitoring tools for analysis.

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

The `--no-write-json` flag prevents dbt from writing JSON artifacts (eg. `manifest.json`, `run_results.json`) to the `target/` directory. JSON serialization can be slow, and this flag may make invocations of dbt faster.

<File name='Usage'>

```text
$ dbt --no-write-json run
```

</File>

## Strict

The `-S` or `--strict` flag is _only_ for use during dbt development. It performs extra validation of dbt objects and internal consistency checks during compilation. Use of this flag incurs a significant performance penalty. We use it only when running integration tests against proposed changes to dbt.

<File name='Usage'>

```text
$ dbt --strict run
```

</File>

## Warnings as Errors

The `--warn-error` flag converts dbt warnings into errors. If dbt would normally warn, it will instead raise an error. Examples include `--select` selectors that selects nothing, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

<File name='Usage'>

```text
$ dbt --warn-error run
...
```

</File>

## Partial Parsing
The `--partial-parse` and `--no-partial-parse` flags can be used to configure partial parsing in your project, and will override the value set in `profiles.yml`. See [the docs on parsing](parsing#partial-parsing) for more details.

<File name='Usage'>

```text
$ dbt --partial-parse run
```

</File>

## Experimental parser
The `--use-experimental-parser` flag will statically analyze model files in your project and, if possible, extract needed information 3x faster than a full Jinja render. See [the docs on parsing](parsing#experimental-parser) for more details.

<File name='Usage'>

```text
$ dbt --use-experimental-parser run
```

</File>
