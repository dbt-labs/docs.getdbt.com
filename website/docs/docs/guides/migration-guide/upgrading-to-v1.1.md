---
title: "Upgrading to v1.1"

---

:::info
v1.1 is currently available as a beta prerelease. Install it from PyPi for your adapter, if available:
```
pip install --pre "dbt-<adapter>~=1.1.0b1"
```
:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/HEAD/CHANGELOG.md)
- [CLI Installation guide](/dbt-cli/install/overview)
- [Cloud upgrade guide](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version)

## Breaking changes

There are no breaking changes for end users of dbt. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For maintainers of adapter plugins

The abstractmethods `get_response` and `execute` now only return `connection.AdapterReponse` in type hints. Previously, they could return a string. We encourage you to update your methods to return an object of class `AdapterResponse`, or implement a subclass specific to your adapter. This also gives you the opportunity to add fields specific to your adapter's query execution, such as `rows_affected` or `bytes_processed`.

### For consumers of dbt artifacts (metadata)

The manifest schema version will be updated to v5. The only change is to the default value of `config` for parsed nodes.

## New and changed documentation

_Note: If you're contributing docs for a new or updated feature in v1.1, please link those docs changes below!_
