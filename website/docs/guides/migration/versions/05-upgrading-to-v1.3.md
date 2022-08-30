---
title: "Trying out v1.3 (beta)"
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/dbt-cli/install/overview)
- [Cloud upgrade guide](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version)

## Breaking changes

There are no breaking changes for end users of dbt. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For consumers of dbt artifacts (metadata)

The manifest schema version will be updated to `v7` to reflect three changes associated with Python models:
- Renamed `raw_sql` to `raw_code`
- Renamed `compiled_sql` to `compiled_code`
- A new top-level node property, `language` (`'sql'` or `'python'`)

For users of [state-based selection](understanding-state): This release includes logic providing backwards and forwards compatibility for older manifest versions. While running dbt Core v1.3, it should be possible to use `state:modified --state ...` selection against a manifest produced by dbt Core v1.0+.

## For maintainers of adapter plugins

_GitHub discussion forthcoming_

**Notes:**
- The `statement` and `create_table_as` macros accept a new argument, `language`, with a default value of `'sql'`

## New and changed documentation

- **[Python models](building-models/python-models)** are natively supported in `dbt-core` for the first time, on data warehouses that support Python runtimes.

Docs in progress: [Issues labeled "dbt-core v1.3"](https://github.com/dbt-labs/docs.getdbt.com/issues?q=is%3Aissue+label%3A%22dbt-core+v1.3%22+)

- **[`node_color` now a supported `docs` attribute](/docs/reference/resource-configs/docs.md)**: You can add custom colors to the dbt docs lineage(DAG) graph. For the first time, you can physically visualize layers within the DAG, such as bronze, silver, and gold.