---
title: "Project Parsing"
description: "Read this guide to understand the project parsing configuration in dbt."
---

## Related documentation
- The `dbt parse` [command](/reference/commands/parse)
- Partial parsing [profile config](/docs/core/connect-data-platform/profiles.yml#partial_parse) and [CLI flags](/reference/global-cli-flags#partial-parsing)
- Experimental parser [CLI flag](/reference/global-cli-flags#experimental-parser)

## What is parsing?

At the start of every dbt invocation, dbt reads all the files in your project, extracts information, and constructs a manifest containing every object (model, source, macro, etc). Among other things, dbt uses the `ref()`, `source()`, and `config()` macro calls within models to set properties, infer dependencies, and construct your project's DAG.

Parsing projects can be slow, especially as projects get bigger—hundreds of models, thousands of files—which is frustrating in development. There are a handful of ways to optimize dbt performance today:
- LibYAML bindings for PyYAML
- Partial parsing, which avoids re-parsing unchanged files between invocations
- An experimental parser, which extracts information from simple models much more quickly
- [RPC server](/reference/commands/rpc), which keeps a manifest in memory, and re-parses the project at server startup/hangup

These optimizations can be used in combination to reduce parse time from minutes to seconds. At the same time, each has some known limitations, so they are disabled by default.

## PyYAML + LibYAML

dbt uses [PyYAML](https://pyyaml.org/wiki/PyYAML) to read and validate YAML files in your project. PyYAML is written in pure Python, but it can leverage [LibYAML](https://pyyaml.org/wiki/LibYAML) (written in C, much faster) if it's available in your system. Whenever it parses your project, dbt will always check first to see if LibYAML is available.

You can test to see if LibYAML is installed by running this command in the environment where you've installed dbt:
```
python -c "from yaml import CLoader"
```

## Partial parsing

After parsing your project, dbt stores an internal project manifest in a file called `partial_parse.msgpack`. When partial parsing is enabled, dbt will use that internal manifest to determine which files have been changed (if any) since it last parsed the project. Then, it will _only_ parse the changed files, or files related to those changes.

Starting in v1.0, partial parsing is **on** by default. In development, partial parsing can significantly reduce the time spent waiting at the start of a run, which translates to faster dev cycles and iteration.

The [`PARTIAL_PARSE` global config](/reference/global-configs/parsing) can be enabled or disabled via `profiles.yml`, environment variable, or CLI flag.

### Known limitations

Parse-time attributes (dependencies, configs, and resource properties) are resolved using the parse-time context. When partial parsing is enabled, and certain context variables change, those attributes will _not_ be re-resolved, and are likely to become stale.

In particular, you may see **incorrect results** if these attributes depend on "volatile" context variables, such as [`run_started_at`](/reference/dbt-jinja-functions/run_started_at), [`invocation_id`](/reference/dbt-jinja-functions/invocation_id), or [flags](/reference/dbt-jinja-functions/flags). These variables are likely (or even guaranteed!) to change in each invocation. dbt Labs _strongly discourages_ you from using these variables to set parse-time attributes (dependencies, configs, and resource properties).

Starting in v1.0, dbt _will_ detect changes in environment variables. It will selectively re-parse only the files that depend on that [`env_var`](/reference/dbt-jinja-functions/env_var) value. (If the env var is used in `profiles.yml` or `dbt_project.yml`, a full re-parse is needed.) However, dbt will _not_ re-render **descriptions** that include env vars. If your descriptions include frequently changing env vars (this is highly uncommon), we recommend that you fully re-parse when generating documentation: `dbt --no-partial-parse docs generate`.

If certain inputs change between runs, dbt will trigger a full re-parse. The results will be correct, but the full re-parse may be quite slow. Today those inputs are:
- `--vars`
- `profiles.yml` content (or `env_var` values used within)
- `dbt_project.yml` content (or `env_var` values used within)
- installed packages
- dbt version
- certain widely-used macros (for example, [builtins](/reference/dbt-jinja-functions/builtins), overrides, or `generate_x_name` for `database`/`schema`/`alias`)

If you're triggering [CI](/docs/deploy/continuous-integration) job runs, the partial parsing benefits are not available on a new pull request (PR) or new branch. However, they are available on subsequent commits to that new PR or branch. 

If you ever get into a bad state, you can disable partial parsing and trigger a full re-parse by setting the `PARTIAL_PARSE` global config to false, or by deleting `target/partial_parse.msgpack` (e.g. by running `dbt clean`).

## Static parser

At parse time, dbt needs to extract the contents of `ref()`, `source()`, and `config()` from all models in the project. Traditionally, dbt has extracted those values by rendering the Jinja in every model file, which can be slow. In v0.20, we introduced a new way to statically analyze model files, leveraging [`tree-sitter`](https://github.com/tree-sitter/tree-sitter), which we're calling an "experimental parser". You can see the code for an initial Jinja2 grammar [here](https://github.com/dbt-labs/tree-sitter-jinja2).

Starting in v1.0, the experimental parser is **on** by default. We believe it can offer *some* speedup to 95% of projects. You may optionally turn it off using the [`STATIC_PARSER` global config](/reference/global-configs/parsing).

For now, the static parser only works with models, and models whose Jinja is limited to those three special macros (`ref`, `source`, `config`). The experimental parser is at least 3x faster than a full Jinja render. Based on testing with data from dbt Cloud, we believe the current grammar can statically parse 60% of models in the wild. So for the average project, we'd hope to see a 40% speedup in the model parser.

## Experimental parser

We plan to make iterative improvements to static parsing in future versions, and to use random sampling (via anonymous usage tracking) to verify that it yields correct results. You can opt into the latest "experimental" version of the static parser using the [`USE_EXPERIMENTAL_PARSER` global config](/reference/global-configs/parsing).
