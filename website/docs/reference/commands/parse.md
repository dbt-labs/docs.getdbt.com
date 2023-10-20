---
title: "About dbt parse command"
sidebar_label: "parse"
description: "Read this guide on how dbt's parse command can be used to parse your dbt project and write detailed timing information."
id: "parse"
---

The `dbt parse` command parses and validates the contents of your dbt project. If your project contains Jinja or YAML syntax errors, the command will fail.

It will also produce an artifact with detailed timing information, which is useful to understand parsing times for large projects. Refer to [Project parsing](/reference/parsing) for more information.

<VersionBlock firstVersion="1.5">

Starting in v1.5, `dbt parse` will write or return a [manifest](/reference/artifacts/manifest-json), enabling you to introspect dbt's understanding of all the resources in your project.

</VersionBlock>

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
