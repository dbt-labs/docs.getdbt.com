---
title: "Upgrading to 1.0.0"

---

:::info Prerelease

dbt-core v1.0.0-b2 is currently available. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt-core).

:::

### Resources

- [Discourse](https://discourse.getdbt.com/t/3180)
- [Changelog](https://github.com/dbt-labs/dbt-core/blob/HEAD/CHANGELOG.md)

## Breaking changes

- The two type of test definitions are now "singular" and "generic" (instead of "data" and "schema", respectively). The `test_type:` selection method accepts `test_type:singular` and `test_type:generic`. (It will also accept test_type:schema and test_type:data for backwards compatibility.) **Not backwards compatible:** The `--data` and `--schema` flags to dbt test are no longer supported, and tests no longer have the tags `'data'` and `'schema'` automatically applied.
- The `dbt-rpc` server has been split apart from `dbt-core`, to be packaged, distributed, and installed separately. Instead of `dbt rpc`, use `dbt-rpc serve`.

**Deprecations:** Several under-the-hood changes from past minor versions, tagged with deprecation warnings, have now been fully deprecated.
- The `packages` argument of [dispatch](dispatch) has been deprecated and will raise an exception when used.
- The "adapter_macro" macro has been deprecated. Instead, use the [dispatch](dispatch) method to find a macro and call the result.
- The `release` arg has been removed from the `execute_macro` method.
- 

## New and changed documentation

- [Tests](building-a-dbt-project/tests), [test selection](test-selection-examples), [selection methods](node-selection/methods): Update `test_type:` selection method. Remove references to `--schema` and `--data` flags.
- [Parsing](parsing): partial parsing and static parsing have been turned on by default.
- [Global configs](global-configs) have been standardized. Related updates to [global CLI flags](global-cli-flags) and [`profiles.yml`](profiles.yml).

## Selection
- Add `result:<status>` subselectors for smarter reruns when dbt models have errors and tests fail. See examples: [Pro-tips for Workflows](/docs/guides/best-practices.md#pro-tips-for-workflows)

### Elsewhere in Core
- [model-paths](model-paths) have replaced `source-paths` in `dbt-project.yml.
- [seed-paths](seed-paths) have replaced `data-paths` in `dbt-project.yml with a default value of `seeds`.
- The default value of [test-paths](test-paths) has been updated to be the plural `tests`.
- The default value of [analysis-paths](analysis-paths) has been updated to be the plural `analyses`.
- The [packages-install-path](packages-install-path) was updated from `modules-path`.  Additionally the default value is now `dbt-packages` instead of `dbt-modules`.  You may need to update this value in [`clean-targets`](clean-targets).
- Default for `quote-columns` is now `True` for all adapters other than Snowflake.

### Plugins
- [dbt RPC Server](rpc) has been split out from `dbt-core` and is now packaged separately. Its functionality will be fully deprecated by the end of 2022, in favor of a new dbt Server.
