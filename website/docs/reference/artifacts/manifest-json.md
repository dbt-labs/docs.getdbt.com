---
title: Manifest
---
<VersionBlock firstVersion="1.4">
**dbt Core v1.4 produces schema**: [`v8`](https://schemas.getdbt.com/dbt/manifest/v8/index.html)
</VersionBlock>

<VersionBlock lastVersion="1.3">
**dbt Core v1.3 produces schema**: [`v7`](https://schemas.getdbt.com/dbt/manifest/v7/index.html)
</VersionBlock>

<VersionBlock lastVersion="1.2">
**dbt Core v1.2 produces schema**: [`v6`](https://schemas.getdbt.com/dbt/manifest/v6/index.html)
</VersionBlock>

<VersionBlock lastVersion="1.1">
**dbt Core v1.1 produces schema**: [`v5`](https://schemas.getdbt.com/dbt/manifest/v5/index.html)
</VersionBlock>

<VersionBlock lastVersion="1.0">
**dbt Core v1.0 produces schema**: [`v4`](https://schemas.getdbt.com/dbt/manifest/v4/index.html)
</VersionBlock>

**Produced by:** [`build`](commands/build) [`compile`](commands/compile) [`docs generate`](commands/cmd-docs) [`list`](commands/list) [`seed`](commands/seed) [`snapshot`](commands/snapshot) [`source freshness`](commands/source) [`test`](commands/test) [`run`](commands/run) [`run-operation`](commands/run-operation)


This single file contains a full representation of your dbt project's resources (models, tests, macros, etc), including all node configurations and resource properties. Even if you're only running some models or tests, all resources will appear in the manifest (unless they are disabled) with most of their properties. (A few node properties, such as `compiled_sql`, only appear for executed nodes.)

Today, dbt uses this file to populate the [docs site](documentation), and to perform [state comparison](/docs/deploy/about-state). Members of the community have used this file to run checks on how many models have descriptions and tests.

### Top-level keys

- [`metadata`](dbt-artifacts#common-metadata)
- `nodes`: Dictionary of all analyses, models, seeds, snapshots, and tests.
- `sources`: Dictionary of sources.
- `exposures`: Dictionary of exposures.
- `macros`: Dictionary of macros.
- `docs`: Dictionary of `docs` blocks.
- `parent_map`: Dictionary that contains the first-order parents of each resource.
- `child_map`: Dictionary that contains the first-order children of each resource.
- `selectors`: Expanded dictionary representation of [YAML `selectors`](yaml-selectors).
- `disabled`: Array of resources with `enabled: false`.

### Resource details

All resources nested within `nodes`, `sources`, `exposures`, `macros`, and `docs` have the following base properties:

- `name`: Resource name.
- `unique_id`: `<resource_type>.<package>.<resource_name>`, same as dictionary key
- `package_name`: Name of package that defines this resource.
- `root_path`: Absolute file path of this resource's package.
- `path`: Relative file path of this resource's definition within its "resource path" (`model-paths`, `seed-paths`, etc.).
- `original_file_path`: Relative file path of this resource's definition, including its resource path.

Each has several additional properties related to its resource type.
