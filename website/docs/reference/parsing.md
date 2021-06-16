---
title: "Project Parsing"
---

## Related documentation
- The `dbt parse` [command](parse)
- Partial parsing [profile config](profiles.yml#partial_parse) and [CLI flags](global-cli-flags#partial-parsing)
- Experimental parser [CLI flag](global-cli-flags#experimental-parser)

## What is parsing?

At the start of every dbt invocation, dbt reads all the files in your project, extracts information, and constructs a manifest containing every object (model, source, macro, etc). Among other things, dbt uses the `ref()`, `source()`, and `config()` macro calls within models to set properties, infer dependencies, and construct your project's DAG.

Parsing projects can be slow, especially as projects get bigger—hundreds of models, thousands of files—which is frustrating ind evelopment. There are three performance optimizations that dbt offers today:
- Partial parsing, which avoids re-parsing unchanged files between invocations
- An experimental parser, which extracts information from simple models much more quickly
- [RPC server](rpc), which keeps a manifest in memory, and re-parses the project at server startup/hangup

These optimizations can be used in combination to reduce parse time from minutes to seconds. At the same time, each has some known limitations, so they are disabled by default.

## Partial parsing

After parsing your project, dbt stores an internal project manifest in a file called `partial_parse.msgpack`. When partial parsing is enabled, dbt will use that internal manifest to determine which files have been changed (if any) since it last parsed the project. Then, it will _only_ parse the changed files, or files related those changes.

Partial parsing is off by default, and it can be enabled via [profile config](profiles.yml#partial_parse) or [CLI flags](global-cli-flags#partial-parsing). In development, partial parsing can significantly reduce the time spent waiting at the start of a run, which translates to faster dev cycles and iteration.

### Known limitations

Use caution when enabling partial parsing in dbt, as there are known limitations today:
- A change in environment variables does not trigger a re-parse. Files which depend on [`env_var`](env_var) may be incorrect on subsequent parses.
- Changes to macros called within a model's `config()` block will not result in re-parsing that model.
- A file that depends on "volatile" Jinja variables, such as [`run_started_at`](run_started_at) or [`invocation_id`](invocation_id), will quickly get stale. A file is not re-parsed in subsequent invocations if the file's contents have not changed.
- If certain inputs change between runs, dbt will trigger a full re-parse. Today those inputs are:
    - `--vars`
    - `profiles.yml` content
    - `dbt_project.yml` content
    - installed packages
    - dbt version

If you ever get into a bad state, you can disable partial parsing and trigger a full re-parse with the `--no-partial-parse` CLI flag, or by deleting `target/partial_parse.msgpack.`

## Experimental parser

At parse time, dbt needs to extract the contents of `ref()`, `source()`, and `config()` from all models in the project. Traditionally, dbt has extracted those values by rendering the Jinja in every model file, which can be slow. In v0.20.0, we're trying out a new way to statically analyze model files, leveraging [`tree-sitter`](https://github.com/tree-sitter/tree-sitter), which we're calling an "experimental parser". You can see the code for an initial Jinja2 grammar [here](https://github.com/fishtown-analytics/tree-sitter-jinja2).

```
dbt --use-experimental-parser parse
dbt --use-experimental-parser run
dbt --use-experimental-parser test
```

For now, the experimental parser only works with models, and models whose Jinja is limited to those three special macros (`ref`, `source`, `config`). The experimental parser is at least 3x faster than a full Jinja render. Based on testing with data from dbt Cloud, we believe the current grammar can statically parse 60% of models in the wild. So for the average project, we'd hope to see a 40% speedup in the model parser. You can check this by running `dbt parse` and `dbt --use-experimental-parser parse`, and comparing `target/perf_info.json` produced by each.

The experimental parser is off by default. We believe it can offer *some* speedup to 95% of projects.

### Known Limitations

Do not use the experimental parser if you've overridden the `ref`, `source`, or `config` macro with a custom implementation.
