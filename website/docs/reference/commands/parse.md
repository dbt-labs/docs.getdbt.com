---
title: "About dbt parse command"
sidebar_label: "parse"
description: "Read this guide on how dbt's parse command can be used to parse your dbt project and write detailed timing information."
id: "parse"
---

The `dbt parse` command parses and validates the contents of your dbt project. If your project contains Jinja or YAML syntax errors, the command will fail.

It will also produce an artifact with detailed timing information, which is useful to understand parsing times for large projects. Refer to [Project parsing](/reference/parsing) for more information.

Starting in v1.5, `dbt parse` will write or return a [manifest](/reference/artifacts/manifest-json), enabling you to introspect dbt's understanding of all the resources in your project. Since `dbt parse` doesn't connect to your warehouse, [this manifest will not contain any compiled code](/faqs/Warehouse/db-connection-dbt-compile).

By default, the <Constant name="studio_ide" /> will attempt a "partial" parse, which means it'll only check changes since the last parse (new or updated parts of your project when you make changes). Since the <Constant name="studio_ide" /> automatically parses in the background whenever you save your work, manually running `dbt parse` yourself is likely to be fast because it's just looking at recent changes.

As an option, you can tell dbt to check the entire project from scratch by using the `--no-partial-parse` flag. This makes dbt perform a full re-parse of the project, not just the recent changes.

```
$ dbt parse
13:02:52  Running with dbt=1.5.0
13:02:53  Performance info: target/perf_info.json
```

<File name='target/perf_info.json'>

```json
{
    "path_count": 7,
    "is_partial_parse_enabled": false,
    "parse_project_elapsed": 0.20151838900000008,
    "patch_sources_elapsed": 0.00039490800000008264,
    "process_manifest_elapsed": 0.029363873999999957,
    "load_all_elapsed": 0.240095269,
    "projects": [
        {
            "project_name": "my_project",
            "elapsed": 0.07518750299999999,
            "parsers": [
                {
                    "parser": "model",
                    "elapsed": 0.04545303199999995,
                    "path_count": 1
                },
                {
                    "parser": "operation",
                    "elapsed": 0.0006415469999998535,
                    "path_count": 1
                },
                {
                    "parser": "seed",
                    "elapsed": 0.026538173000000054,
                    "path_count": 2
                }
            ],
            "path_count": 4
        },
        {
            "project_name": "dbt_postgres",
            "elapsed": 0.0016448299999998195,
            "parsers": [
                {
                    "parser": "operation",
                    "elapsed": 0.00021672399999994596,
                    "path_count": 1
                }
            ],
            "path_count": 1
        },
        {
            "project_name": "dbt",
            "elapsed": 0.006580432000000025,
            "parsers": [
                {
                    "parser": "operation",
                    "elapsed": 0.0002488560000000195,
                    "path_count": 1
                },
                {
                    "parser": "docs",
                    "elapsed": 0.002500640000000054,
                    "path_count": 1
                }
            ],
            "path_count": 2
        }
    ]
}
```

</File>

<VersionBlock firstVersion="2.0">

## dbt Information Schema

You can use `--generate-info-schema` with `dbt parse` to write the [dbt Information Schema](/reference/info-schema) to `target/info_schema/` in a versioned subdirectory (currently `v1/`). The Information Schema exposes your project's metadata as queryable SQL tables (similar to a database's `INFORMATION_SCHEMA`) so you can query models, sources, and more without parsing `manifest.json`:

```shell
dbt parse --generate-info-schema
```

Because `dbt parse` doesn't connect to your warehouse, the Information Schema it produces is structural only &mdash; no column types, no column-level lineage, and no runtime results.

</VersionBlock>
