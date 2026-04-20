---
title: "Manifest JSON file"
sidebar_label: "Manifest"
---

import ManifestVersions from '/snippets/_manifest-versions.md';

<ManifestVersions />

<br />

**Produced by**: Any [dbt command](/category/list-of-commands) that parses the project. This includes all commands, _except_ [`deps`](/reference/commands/deps), [`clean`](/reference/commands/clean), [`debug`](/reference/commands/debug), and [`init`](/reference/commands/init).

After executing a dbt command, the `manifest.json` file can be found in the project's `target/` directory:

- If developing locally: Open the `target/` directory in your project folder
- In the <Constant name="studio_ide" />: Open the `target/` directory in the file tree
- In <Constant name="dbt_platform" /> jobs: Download the `manifest.json` from the [artifacts](/reference/artifacts/dbt-artifacts) tab for a given job run

This file contains a full representation of your dbt project's resources (models, tests, macros, and more), including all node configurations and resource properties. Even if you're only running some models or tests, all resources will appear in the manifest (unless they are disabled) with most of their properties. Some properties, such as `compiled_sql`, are included only for executed nodes.

Today, dbt uses this file to populate the [docs site](/docs/explore/build-and-view-your-docs), and to perform [state comparison](/reference/node-selection/syntax#about-node-selection). Members of the community also use it to analyze project health, such as checking for missing descriptions or tests.

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `nodes`: Dictionary of all analyses, models, seeds, snapshots, and tests.
- `sources`: Dictionary of sources
- `metrics`: Dictionary of metrics
- `exposures`: Dictionary of exposures
- `groups`: Dictionary of groups (**Note:** Added in v1.5)
- `macros`: Dictionary of macros
- `docs`: Dictionary of `docs` blocks
- `parent_map`: Dictionary that contains the first-order parents of each resource
- `child_map`: Dictionary that contains the first-order children of each resource
- `group_map`: Dictionary that maps group names to their resource nodes
- `selectors`: Expanded dictionary representation of [YAML `selectors`](/reference/node-selection/yaml-selectors)
- `disabled`: Array of resources with `enabled: false`

### Resource details

All resources nested within `nodes`, `sources`, `metrics`, `exposures`, `macros`, and `docs` have the following base properties:

- `name`: Resource name
- `unique_id`: `<resource_type>.<package>.<resource_name>`, same as dictionary key
- `package_name`: Name of package that defines this resource
- `root_path`: Absolute file path of this resource's package. (**Note:** This was removed for most node types in <Constant name="core" /> v1.4 / manifest v8 to reduce duplicative information across nodes, but it is still present for seeds.)
- `path`: Relative file path of this resource's definition within its "resource path" (`model-paths`, `seed-paths`, and more).
- `original_file_path`: Relative file path of this resource's definition, including its resource path.

Each has several additional properties related to its resource type.

### dbt JSON schema
You can refer to the [dbt JSON schema](https://schemas.getdbt.com/) for information on describing and consuming dbt-generated artifacts. 

**Note**: The `manifest.json` version number is related to (but not _equal_ to) your dbt version, so you _must_ use the correct `manifest.json` version for your dbt version. To find the correct `manifest.json` version, select the dbt version on the top navigation (such as `v1.5`). 

Refer to the table at the beginning of [this page](/reference/artifacts/manifest-json) to understand how the manifest version matches the dbt version.
