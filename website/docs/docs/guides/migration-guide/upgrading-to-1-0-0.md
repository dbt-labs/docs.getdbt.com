---
title: "Upgrading to 1.0.0"

---

:::info Prerelease

dbt v1.0.0-b1 is currently available in beta. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt).

:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt/blob/develop/CHANGELOG.md)

## Breaking changes

- The two type of test definitions are now "singular" and "generic" (instead of "data" and "schema", respectively). The `test_type:` selection method accepts `test_type:singular` and `test_type:generic`. (It will also accept test_type:schema and test_type:data for backwards compatibility.) **Not backwards compatible:** The `--data` and `--schema` flags to dbt test are no longer supported, and tests no longer have the tags `'data'` and `'schema'` automatically applied.

## New and changed documentation

- [Tests](building-a-dbt-project/tests), [test selection](test-selection-examples), [selection methods](node-selection/methods): Update `test_type:` selection method. Remove references to `--schema` and `--data` flags.
