---
title: "Upgrading to 1.0.0"

---

:::info Prerelease

dbt v1.0.0-b1 is currently available. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt-core).

:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/HEAD/CHANGELOG.md)

## Breaking changes

- The two type of test definitions are now "singular" and "generic" (instead of "data" and "schema", respectively). The `test_type:` selection method accepts `test_type:singular` and `test_type:generic`. (It will also accept test_type:schema and test_type:data for backwards compatibility.) **Not backwards compatible:** The `--data` and `--schema` flags to dbt test are no longer supported, and tests no longer have the tags `'data'` and `'schema'` automatically applied.
- TODO: add deprecation info

## New and changed documentation

- [Tests](building-a-dbt-project/tests), [test selection](test-selection-examples), [selection methods](node-selection/methods): Update `test_type:` selection method. Remove references to `--schema` and `--data` flags.
- [Parsing](parsing): partial parsing and static parsing have been turned on by default.
- [Global configs](global-configs) have been standardized. Related updates to [global CLI flags](global-cli-flags) and [`profiles.yml`](profiles.yml).

### Elsewhere in Core
- [model-paths](model-paths) have replaced `source-paths` in `dbt-project.yml.
- [seed-paths](seed-paths) have replaced `data-paths` in `dbt-project.yml with a default value of `seeds`.
- The default value of [test-paths](test-paths) has been updated to be the plural `tests`.
- The default value of [analysis-paths](analysis-paths) has been updated to be the plural `analyses`.
- The [packages-install-path](packages-install-path) was updated from `modules-path` with a default value of `dbt-packages` instead of `dbt-modules`.

