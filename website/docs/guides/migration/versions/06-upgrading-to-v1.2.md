---
title: "Upgrading to v1.2 (prerelease)"
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/dbt-cli/install/overview)
- [Cloud upgrade guide](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version)

<Snippet src="available-prerelease-beta-banner" />

## Breaking changes

There are no breaking changes for end users of dbt. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

## For maintainers of adapter plugins

### Cross-database Macros

In [dbt-core#5298](https://github.com/dbt-labs/dbt-core/pull/5298), we migrated a collection of ["cross-database macros"](cross-database-macros) from [dbt-utils](https://github.com/dbt-labs/dbt-utils) to dbt-core. Default implementations are automatically inherited by adapters and included in the testing suite. Adapter maintainers may need to override the implementation of one or more macros to align with database-specific syntax or optimize performance. For details on the testing suite, see: ["Testing a new adapter"](testing-a-new-adapter).

The TL;DR rationale for this work is:
1. Simplify dbt-utils development
2. Allow some packages to no longer depend on dbt-utils as a package
3. Provide adapter maintainers tests that can but used in the adapter repo CI, as opposed to in a shim package

As for how to make it happen, looking at the following PRs for dbt-Labs-maintained adapters show it clearly:

- [dbt-bigquery#192](https://github.com/dbt-labs/dbt-bigquery/pull/192) 
- [dbt-redshift#120](https://github.com/dbt-labs/dbt-redshift/pull/120) 
- [dbt-snowflake#162](https://github.com/dbt-labs/dbt-snowflake/pull/162) 


### Grants

Managing access grants is one of the most asked for features from dbt users. We’re delivering this capability, but naturally there’s variance across data platforms as to how grants work, so time for adapter maintainers to roll their sleeves up. You might get lucky and not have to override any of them, but in case you do, below are descriptions of the new methods and macros, grouped into level of complexity (start with the easy ones first!)

:::info Note
This new functionality does not add users, only grants access. You'll have to handle adding users elsewhere, and it has [implications for the GRANT adapter tests](#testing-grants-for-your-adapter).
:::

Pull requests for adding grants for dbt Labs-maintained adapters should be very useful as a reference, for example [dbt-bigquery#212](https://github.com/dbt-labs/dbt-bigquery/pull/212).

#### Overrideable macros and methods

The two macros below are simple Boolean-toggles (i.e. `True/False` value) indicating whether certain features are available for your database. The default of both of these macros are `True`, because we believe that all databases should support these ergonomic features. However, we've built for flexibility, so overriding these macros for your adapter, will handle the case where your database doesn't support these features.

| macro | description | global project’s default | example override |
| --- | --- | --- | --- |
| `copy_grants()` | when an object is fully replaced on your database, do grants copy over? e.g. on Postgres this is never true, on Spark this is different for views vs. non-Delta tables vs. Delta tables, on Snowflake it depends on the user-supplied `copy_grants` configuration. true by default, which means “play it safe”: grants MIGHT have copied over, so dbt will run an extra query to check them + calculate diffs. | [`default__copy_grants()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L3-L21)| [`snowflake__copy_grants()`](https://github.com/dbt-labs/dbt-snowflake/blob/d53c327e20c91522b4792ede75bbe50e16a9d9c3/dbt/include/snowflake/macros/adapters.sql#L297-L300) |
| `support_multiple_grantees_per_dcl_statement()` | does this database support `grant {privilege} to user_a, user_b, ...`? or do `user_a` + `user_b` need their own separate grant statements? | [`default__support_multiple_grantees_per_dcl_statement()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L24-L39) | [`spark__support_multiple_grantees_per_dcl_statement()`](https://github.com/dbt-labs/dbt-spark/blob/9109fe1babaab92cbe1c58868977c7a9c998c2a8/dbt/include/spark/macros/apply_grants.sql#L28-L30) |

If the above macros do not suffice, then at least one of these `get_*_sql()` macros will need to be overwritten. They're all one-liners and might need small syntax tweaks to work on your database.

| macro | description | global project’s version | example override |
| --- | --- | --- | --- |
| `get_show_grant_sql()` | SQL that returns the `CURRENT` grants (privilege-grantee pairs) for a given relation | [`default__get_show_grant_sql()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L63-L65) | [`redshift__get_show_grant_sql()`](https://github.com/dbt-labs/dbt-redshift/blob/9a3492a1c3394496c9061252d54c87caa112821a/dbt/include/redshift/macros/adapters/apply_grants.sql#L1-L27) |
| `get_grant_sql()` | generate a GRANT statement for a given relation given a privilege-grantee(s) pairing. grantees will be a list of grantees if supported by this database, otherwise just one. | [`default__get_grant_sql()`](https://github.com/dbt-labs/dbt-core/blob/ct-660-grant-sql/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L36-L45) | [`spark__get_grant_sql()`](https://github.com/dbt-labs/dbt-spark/blob/bff1348931efb60a41831429c795498008d2d3ac/dbt/include/spark/macros/apply_grants.sql#L17-L29) |
| `get_revoke_sql()` | generate a REVOKE statement for a given relation given a privilege-grantee(s) pairing. grantees will be a list of grantees if supported by this database, otherwise just one. | [`default__get_revoke_sql()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L81-L83) | [`bigquery__get_revoke_sql()`](https://github.com/dbt-labs/dbt-bigquery/blob/942d460fc60beb87325871903b26afee7e5f4d85/dbt/include/bigquery/macros/adapters/apply_grants.sql#L18-L20) |
| any custom materialization (or override of a default materialization) | you have to add the lines for fetching and applying the grants `{% set grant_config = config.get('grants') %}` and `{% do apply_grants(target_relation, grant_config) %}` by default, the `should_revoke` argument of `apply_grants` is `True`. dbt will first run a query to “show” grants, then calculate diffs, then apply revoke/grant statements. you can use the `should_revoke` macro to determine whether this extra step is necessary. in cases where dbt is fully replacing an object, or creating one for the first time, grants may not be carried over — so it may be more efficient to skip the “show” step and just add the grants. |  | BigQuery’s [custom](https://github.com/dbt-labs/dbt-bigquery/blob/942d460fc60beb87325871903b26afee7e5f4d85/dbt/include/bigquery/macros/materializations/incremental.sql#L155-L156) incremental [materialization](https://github.com/dbt-labs/dbt-bigquery/blob/942d460fc60beb87325871903b26afee7e5f4d85/dbt/include/bigquery/macros/materializations/incremental.sql#L204) |

If the above sets of macros still aren't cutting it, here's the final depth of complexity in which to wade.

| macro | description | global project’s version | example override |
| --- | --- | --- | --- |
| `get_dcl_statement_list()` | Unpacks grant_config. For each privilege-grantee(s) pairing, call either get_grant_sql or get_revoke_sql and return a list of all needed statements | [`default__get_dcl_statement_list()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L92-L112) |  |
| `call_dcl_statements()` | Call all DCL statements, i.e. actually run them against the database. This is the culmination of apply_grants. By default, this generates one big string (every grant/revoke statement, separated by ;), but some adapters will need to execute these differently. | [`default__call_dcl_statements()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/include/global_project/macros/adapters/apply_grants.sql#L119-L132) |  |
| `Adapter.standardize_grants_dict()` | Input: result from query to “show grants” Returns: a dictionary of structure `{"privilege_name": [list, of, grantees], ...}` —> matches the structure of the user-supplied `grant_config` | (this is a python method in the  `core/dbt/adapters/base/impl.py`'s [`BaseAdapter.standardize_grants_dict()`](https://github.com/dbt-labs/dbt-core/blob/c25260e5dd2afa237a30db115605ece9629443d1/core/dbt/adapters/base/impl.py#L542-L567) |  |

##### Testing grants with your adapter

The tests for grants are implemented in the same way as the pytest tests that were introduced in dbt-core v1.1.0, in that they are importable and can you create adapter-specific child classes of each test in your repo. for example see how [dbt-bigquery implements the tests](https://github.com/dbt-labs/dbt-bigquery/blob/main/tests/functional/adapter/test_grants.py). Notice the `BaseGrantsBigQuery` in which the mapping dict of standard privileges to BigQuery-specific privilege names.

```python
class BaseGrantsBigQuery(BaseGrants):
    def privilege_grantee_name_overrides(self):
        return {
            "select": "roles/bigquery.dataViewer",
            "insert": "roles/bigquery.dataEditor",
            "fake_privilege": "roles/invalid",
            "invalid_user": "user:fake@dbtlabs.com",
        }
```

It is also worth noting that in your test database, you need to have create three users. If your integration test database is persistent, you'll only need to add the users to the database once, if the database is set up and torn down within the CI testing, you'll need to have the users added as part of your CI testing (or even the docker image).


In the example test.env, the users are [prescribed as environment variables](https://github.com/dbt-labs/dbt-snowflake/blob/1247bbabad12f264b1880d429e6fd025544ffe38/test.env.example#L33-L35) as follows:

```bash
DBT_TEST_USER_1=dbt_test_role_1
DBT_TEST_USER_2=dbt_test_role_2
DBT_TEST_USER_3=dbt_test_role_3
```

### Materialization inheritance!

Via a community contribution from the folks at Layer.ai, [dbt-core#5348](https://github.com/dbt-labs/dbt-core/pull/5348) enables materializations to be inherited from parent adapters in much the same was as macros are dispatched.

this is a big deal for folks who are inheriting adapters, e.g. as dbt-synapse does with dbt-sqlserver, and for the family of adapters inherit from dbt-spark today.

### New basic tests to implement in adapterland: `BaseDocsGenerate` and `BaseDocsGenReferences`

[dbt-core#5058](https://github.com/dbt-labs/dbt-core/pull/5058) is another step along [the path of converting all our functional tests](https://github.com/dbt-labs/dbt-core/issues/4788) to the new framework in order to empower  adapter maintainers and other contributors to make use of the same tests that the core team uses for their own adapters. Effectively, this test is validates an adapter's ability to correctly generate the catalog that serves as the static backend of a project docs site.
If your adapter does not add extra relation-level metadata (e.g. table size (rows + bytes), last modified timestamp) which is the case by default, then you can follow the same inherit and `pass` pattern to enable your version of `BaseDocsGenerate` and `BaseDocsGenReferences`. However, if you are supplementing the catalog with more metadata, you'll have to:
- Add a method that defines stats for this adapter [e.g. dbt-bigquerys](https://github.com/dbt-labs/dbt-bigquery/blob/main/tests/functional/adapter/expected_stats.py)
- Reimplement the `expected_catalog` fixture, [passing the above into `model_stats` and `seed_stats`](https://github.com/dbt-labs/dbt-bigquery/blob/0212fd621ede4c24929a008de718a7e45bc32cec/tests/functional/adapter/test_basic.py#L68-L81)


Example PRs:
- [dbt-bigquery#190](https://github.com/dbt-labs/dbt-bigquery/pull/190)
- [dbt-redshift#116](https://github.com/dbt-labs/dbt-redshift/pull/116/)

### More python functions now available in the dbt jinja context

python’s `set` and `zip` , and the most of the `itertools`  are available in the dbt-jinja context. Yay! ([dbt-core#5107](https://github.com/dbt-labs/dbt-core/pull/5107 ) and [dbt-core#5140](https://github.com/dbt-labs/dbt-core/pull/5140)). THere's no explicit action needed here, only mentioning in case it enables some jinja simplifications.

### Slight change to the default seed materialization

**who:** folks who override the entire seed materialization, and anyone who overrides materializations for small reasons. this is a great example of how the global_project can be modified to reduce boiler plate within adapters.

**what:** a new macro,  [`get_csv_sql()`](https://github.com/dbt-labs/dbt-core/blob/0cacfd0f8898434bf97386742453a4f61378a732/core/dbt/include/global_project/macros/materializations/seeds/helpers.sql#L47-L55), was added to `macros/materializations/seeds/helpers.sql` 

**why**  transactions are no longer the default behavior for dbt-snowflake, however, they’re still needed for bundling the seed table creation and insertion. So now we have a new default macro so that dbt-snowflake can implement a version that makes the two statements happen in the same transaction

**more info** check out the issue ([dbt-core#5206](https://github.com/dbt-labs/dbt-core/issues/5206)) and PR ([dbt-core#5207](https://github.com/dbt-labs/dbt-core/pull/5207))

## New and changed documentation

- **[Grants](/reference/resource-configs/grants)**: You should now manage access to the datasets you're producing with dbt by using grants instead of using hooks.  If you already use post-hook to apply simple grants, moving to the grants feature will allow you to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your duplicated or boilerplate code.


https://github.com/dbt-labs/docs.getdbt.com/labels/dbt-core%20v1.2
