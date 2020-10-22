---
title: Manifest
---

_Produced by:_
- `dbt compile`
- `dbt run`
- `dbt test`
- `dbt seed`
- `dbt snapshot`
- `dbt docs generate`
- `dbt source snapshot-freshness`
- `dbt ls`

This file contains a full representation of your dbt project in a single file. Resources like models, tests, and macros are all represented inside of this file. The docs site uses this file to render information about your models, their tests, their relationships, and so on. Members of the community have used this file to run checks on how many models have descriptions and tests.

### Top-level keys

- [`metadata`](dbt-artifacts#common-metadata)
- `nodes`: Dictionary of all analyses, models, seeds, snapshots, and tests.
- `sources`: Dictionary of sources.
- `exposures`: Dictionary of exposures.
- `macros`: Dictionary of macros.
- `docs`: Dictionary of `docs` blocks.
- `parent_map`: Dictionary that contains the first-order parents of each resource.
- `child_map`: Dictionary that contains the first-order children of each resource.
- `disabled`: Array of resources with `enabled: false`.

### Resource details

All resources nested within `nodes`, `sources`, `exposures`, `macros`, and `docs` have the following base properties:

- `name`: Resource name.
- `unique_id`: `<resource_type>.<package>.<resource_name>`, same as dictionary key
- `package_name`: Name of package that defines this resource.
- `root_path`: Absolute file path of this resource's package.
- `path`: Relative file path of this resource's definition within its "resource path" (`source-paths`, `data-paths`, etc.).
- `original_file_path`: Relative file path of this resource's definition, including its resource path.

Each has several additional properties based on its resource type.
