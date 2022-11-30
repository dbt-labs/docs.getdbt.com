---
title: "parse"
id: "parse"
---

<Changelog>

New in `v0.19.0`

</Changelog>

## Overview

The `dbt parse` command parses your dbt project and writes detailed timing information. If your project contains Jinja or YAML syntax errors, the command will fail.

### Usage
```
$ dbt parse
Running with dbt=0.19.0
11:53:29 | Start parsing.
11:53:29 | Macro manifest loaded
11:53:29 | Dependencies loaded
11:53:29 | ManifestLoader created
11:53:29 | Manifest loaded
11:53:29 | Parse results written
11:53:29 | Manifest created
11:53:29 | Manifest checked
11:53:29 | Flat graph built
11:53:29 | Manifest loaded
11:53:29 | Performance info: target/perf_info.json
11:53:29 | Done.
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
