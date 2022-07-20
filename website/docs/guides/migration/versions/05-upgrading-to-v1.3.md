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

The manifest schema version will be updated to `v7` to reflect two changes associated with Python models:
- Renamed `raw_sql` to `raw_code`
- Renamed `compiled_sql` to `compiled_code`

For users of [state-based selection](understanding-state): This release includes logic providing backwards and forwards compatibility for older manifest versions. While running dbt Core v1.3, it should be possible to use `state:modified --state ...` selection against a manifest produced by dbt Core v1.0+.

## For maintainers of adapter plugins

_GitHub discussion forthcoming_

## New and changed documentation

- **[Python models](building-models-with-python)** are natively supported in `dbt-core` for the first time, on data warehouses that support Python runtimes.

https://github.com/dbt-labs/docs.getdbt.com/labels/dbt-core%20v1.3
