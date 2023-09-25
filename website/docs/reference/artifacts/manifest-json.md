---
title: "Manifest JSON file"
sidebar_label: "Manifest"
---

| dbt Core version | Manifest version                                              |
|------------------|---------------------------------------------------------------|
| v1.6             | [v10](https://schemas.getdbt.com/dbt/manifest/v10/index.html) |
| v1.5             | [v9](https://schemas.getdbt.com/dbt/manifest/v9/index.html)   |
| v1.4             | [v8](https://schemas.getdbt.com/dbt/manifest/v8/index.html)   |
| v1.3             | [v7](https://schemas.getdbt.com/dbt/manifest/v7/index.html)   |
| v1.2             | [v6](https://schemas.getdbt.com/dbt/manifest/v6/index.html)   |
| v1.1             | [v5](https://schemas.getdbt.com/dbt/manifest/v5/index.html)   |
| v1.0             | [v4](https://schemas.getdbt.com/dbt/manifest/v4/index.html)   |

**Produced by:** Any command that parses your project. This includes all commands **except** [`deps`](/reference/commands/deps), [`clean`](/reference/commands/clean), [`debug`](/reference/commands/debug), [`init`](/reference/commands/init)

This single file contains a full representation of your dbt project's resources (models, tests, macros, etc), including all node configurations and resource properties. Even if you're only running some models or tests, all resources will appear in the manifest (unless they are disabled) with most of their properties. (A few node properties, such as `compiled_sql`, only appear for executed nodes.)

Today, dbt uses this file to populate the [docs site](/docs/collaborate/documentation), and to perform [state comparison](/reference/node-selection/syntax#about-node-selection). Members of the community have used this file to run checks on how many models have descriptions and tests.

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `nodes`: Dictionary of all analyses, models, seeds, snapshots, and tests.
- `sources`: Dictionary of sources.
- `metrics`: Dictionary of metrics.
- `exposures`: Dictionary of exposures.
- `groups`: Dictionary of groups. (**Note:** Added in v1.5)
- `macros`: Dictionary of macros.
- `docs`: Dictionary of `docs` blocks.
- `parent_map`: Dictionary that contains the first-order parents of each resource.
- `child_map`: Dictionary that contains the first-order children of each resource.
- `group_map`: Dictionary that maps group names to their resource nodes.
- `selectors`: Expanded dictionary representation of [YAML `selectors`](/reference/node-selection/yaml-selectors).
- `disabled`: Array of resources with `enabled: false`.

### Resource details

All resources nested within `nodes`, `sources`, `metrics`, `exposures`, `macros`, and `docs` have the following base properties:

- `name`: Resource name.
- `unique_id`: `<resource_type>.<package>.<resource_name>`, same as dictionary key
- `package_name`: Name of package that defines this resource.
- `root_path`: Absolute file path of this resource's package. (**Note:** This is removed for most node types in dbt Core v1.4 / manifest v8 to reduce duplicative information across nodes, but it is still present for seeds.)
- `path`: Relative file path of this resource's definition within its "resource path" (`model-paths`, `seed-paths`, etc.).
- `original_file_path`: Relative file path of this resource's definition, including its resource path.

Each has several additional properties related to its resource type.

### dbt JSON Schema
You can refer to [dbt JSON Schema](https://schemas.getdbt.com/) for info on describing and consuming dbt generated artifacts. 

**Note**: The `manifest.json` version number is related to (but not _equal_ to) your dbt version, so you _must_ use the correct `manifest.json` version for your dbt version. To find the correct `manifest.json` version, select the dbt version on the top navigation (such as `v1.5`). 

Refer to the table at the beginning of [this page](/reference/artifacts/manifest-json) to understand how the Manifest version matches the dbt version.
