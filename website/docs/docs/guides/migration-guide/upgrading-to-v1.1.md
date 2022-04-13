---
title: "Upgrading to v1.1 (prerelease)"

---

:::info Beta
v1.1 is currently available as a beta prerelease. Install it from PyPi [for your adapter](available-adapters), if available:
```
pip install "dbt-<adapter>~=1.1.0b1"
```
:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/HEAD/CHANGELOG.md)
- [CLI Installation guide](/dbt-cli/install/overview)
- [Cloud upgrade guide](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version)

## Breaking changes

There are no breaking changes for end users of dbt. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For maintainers of adapter plugins

We have reworked the testing suite for adapter plugin functionality. For details on the new testing suite, see: ["Testing a new adapter"](testing-a-new-adapter)

The abstract methods `get_response` and `execute` now only return `connection.AdapterReponse` in type hints. Previously, they could return a string. We encourage you to update your methods to return an object of class `AdapterResponse`, or implement a subclass specific to your adapter. This also gives you the opportunity to add fields specific to your adapter's query execution, such as `rows_affected` or `bytes_processed`.

### For consumers of dbt artifacts (metadata)

The manifest schema version will be updated to v5. The only change is to the default value of `config` for parsed nodes.

## New and changed documentation

_Note: If you're contributing docs for a new or updated feature in v1.1, please link those docs changes below!_

- [**Incremental models**](configuring-incremental-models) can now accept a list of multiple columns as their `unique_key`, for models that need a combination of columns to uniquely identify each row. This is supported by the most common data warehouses, for incremental strategies that make use of the `unique_key` config (`merge` and `delete+insert`).
- [**Generic tests**](resource-properties/tests) can define custom names. This is useful to "prettify" the synthetic name that dbt applies automatically. It's needed to disambiguate the case when the same generic test is defined multiple times with different configurations.
- [Python compatibility](install-python-compatibility): dbt Core officially supports Python 3.10

### For users of specific adapter plugins

- **dbt-bigquery:** Support for finer-grained configuration of query timeout and retry when defining your [connection profile](bigquery-profile).
- **dbt-spark** added support for a [`session` connection method](spark-profile#session), for use with a pySpark session, to support rapid iteration when developing advanced or experimental functionality. This connection method is not recommended for new users, and it is not supported in dbt Cloud.
