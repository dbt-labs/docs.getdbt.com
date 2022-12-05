---
title: "Upgrading to dbt utils 1.0"
---

# Upgrading to dbt utils 1.0

For the first time, dbt utils is crossing the major version boundary. From [last month’s blog post](https://www.getdbt.com/blog/announcing-dbt-v1.3-and-utils/): 

> It’s time to formalise what was already unofficial policy: you can rely on dbt utils in the same way as you do dbt Core, with stable interfaces and consistent and intuitive naming.

Just like the switch to dbt Core 1.0 last year, there are some breaking changes as we standardised and prepared for the future. Most changes can be handled with find-and-replace; if you need help, post on the [Community Forum](https://discourse.getdbt.com) or in #package-ecosystem on Slack. 

## New features

- `get_single_value()` is an easy way to pull a single value from a SQL query, instead of having to access the `[0][0]`th element of a `run_query` result.
- `safe_divide()` returns null when the denominator is 0, instead of throwing a divide-by-zero error.
- The new `not_empty_string` test is an easier wrapper than using `expression_is_true` to check the length of a column.

## Enhancements

- Many tests are more meaningful when run against subgroups of a table, e.g. validating that recent data exists for every turnstile. Add the new `group_by_columns` argument to your tests to do so. Check out [https://www.emilyriederer.com/post/grouping-data-quality/](https://www.emilyriederer.com/post/grouping-data-quality/) for more information.
- With the addition of an on-by-default `quote_identifiers` flag in the `star()` macro, you can now disable quoting if necessary.

## Fixes

- `union()` now includes/excludes columns case-insensitively
- `slugify()` prefixes an underscore when the first char is a digit
- The `expression_is_true` test doesn’t output `*` unless storing failures, a cost improvement for BigQuery.

## Breaking Changes

- `surrogate_key()` has been replaced by `generate_surrogate_key()`. The original treated null values and blank strings the same, which could lead to duplicate keys being created.  `generate_surrogate_key()` does not have this flaw. Compare the [surrogate keys calculated for these columns](https://docs.google.com/spreadsheets/d/1qWfdbieUOSgkzdY0kmJ9iCgdqyWccA0R-6EW0EgaMQc/edit#gid=0):

![A table comparing the behaviour of surrogate_key and generate_surrogate_key](/img/guides/migration/versions/surrogate_key_behaviour.png)

Changing the calculation method for surrogate keys, even for the better, could have significant consequences in downstream uses (such as snapshots and incremental models which use this column as their `unique_key`). Because of this, it is possible to opt in to the legacy behaviour by setting the following variable in your dbt project:

```yaml
#dbt_project.yml
vars:
  surrogate_key_treat_nulls_as_empty_strings: true #turn on legacy behaviour
```

By creating a new macro instead of updating the behaviour of the old one, we are requiring all projects who use this macro to make an explicit decision about which approach is better for their context. **Our recommendation is that existing users should opt into the legacy behaviour** unless you are confident that either a) your surrogate keys never contained nulls, or b) your surrogate keys are not used for incremental models, snapshots or other stateful artifacts and so can be regenerated with new values without issue.

⚠️ **Warning to package maintainers:** you can not assume one behaviour or the other, as each project can customise their behaviour.

- The `expression_is_true` test no longer has a dedicated `condition` argument. Instead, use `where` which is [now available natively to all tests](https://docs.getdbt.com/reference/resource-configs/where):

```yaml
version: 2

models:
  - name: old_syntax
    tests:
      - dbt_utils.expression_is_true:
          expression: "col_a + col_b = total"
					#replace this...
          condition: "created_at > '2018-12-31'" 

  - name: new_syntax
    tests:
      - dbt_utils.expression_is_true:
          expression: "col_a + col_b = total"
					# ...with this...
          where: "created_at > '2018-12-31'"
```

- The deprecated `unique_where` and `not_null_where` tests have been removed, because [where is now available natively to all tests](https://docs.getdbt.com/reference/resource-configs/where). To migrate, find and replace `dbt_utils.unique_where` with `unique` and `dbt_utils.not_null_where` with `not_null`.
- `dbt_utils.current_timestamp()` is replaced by `dbt.current_timestamp()`. Note that Postgres and Snowflake’s implementation of `dbt.current_timestamp()` differs from the old `dbt_utils` one ([full details here](https://github.com/dbt-labs/dbt-utils/pull/597#issuecomment-1231074577)). If you use Postgres or Snowflake and need identical backwards-compatible behaviour, use `dbt.current_timestamp_backcompat()`. This discrepancy will hopefully be reconciled in a future version of dbt Core.
- All other cross-db macros have moved to the dbt namespace, with no changes necessary other than swapping out `dbt_utils.` for `dbt.`. See [https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros) for the full list.
    - In your code editor, you can do a global find and replace with regex: `\{\{\s*dbt_utils\.(any_value|bool_or|cast_bool_to_text|concat|dateadd|datediff|date_trunc|escape_single_quotes|except|hash|intersect|last_day|length|listagg|position|replace|right|safe_cast|split_part|string_literal|type_bigint|type_float|type_int|type_numeric|type_string|type_timestamp|type_bigint|type_float|type_int|type_numeric|type_string|type_timestamp|except|intersect|concat|hash|length|position|replace|right|split_part|escape_single_quotes|string_literal|any_value|bool_or|listagg|cast_bool_to_text|safe_cast|dateadd|datediff|date_trunc|last_day)` → `{{ dbt.$1`
- The `insert_by_period` materialization has been moved to the [experimental-features repo](https://github.com/dbt-labs/dbt-labs-experimental-features/tree/main/insert_by_period). To continue to use it, add this to your packages.yml file:

```yaml
packages:
  - git: https://github.com/dbt-labs/dbt-labs-experimental-features
    subdirectory: insert_by_period
    revision: XXXX #optional but highly recommended. Provide a full git sha hash, e.g. 1c0bfacc49551b2e67d8579cf8ed459d68546e00. If not provided, uses the current HEAD.
```

- `safe_add()` only works with a list of arguments; use `{{ dbt_utils.safe_add(['column_1', 'column_2']) }}` instead of varargs `{{ dbt_utils.safe_add('column_1', 'column_2') }}`.
- Several long-promised deprecations to `deduplicate()` have been applied:
    - The `group_by` argument is replaced by `partition_by`.
    - `relation_alias` is removed. If you need an alias, you can pass it directly to the `relation` argument.
    - `order_by` is now mandatory. Pass a static value like `1` if you don’t care how they are deduplicated.
- The deprecated `table` argument has been removed from `unpivot()`. Use `relation` instead.


## Resolving error messages
### `'dict object' has no attribute MACRO_NAME`

Cause: No macro called `MACRO_NAME` exists. This is most likely because the macro has moved to the `dbt` namespace (see above). It could also be because you haven’t run dbt deps or have misspelled a macro’s name.

Resolution: Replace references to [cross-database macros](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros) with `dbt.MACRO_NAME()`.

### `macro 'dbt_macro__generate_surrogate_key' takes not more than 1 argument(s)`

Cause: `generate_surrogate_key()` requires a single argument containing a list of columns, not a set of varargs. 

Resolution: Change to `{{ dbt_utils.generate_surrogate_key(['column_1', 'column_2']) }}` - note the square brackets around the first example.

### `dbt_utils.surrogate_key has been replaced by dbt_utils.generate_surrogate_key`

Cause: `surrogate_key()` has been deprecated. 

Resolution: Decide whether you need to enable backwards compatibility (above). Find and replace `dbt_utils.surrogate_key` with `dbt_utils.generate_surrogate_key`.


### `macro 'dbt_macro__test_expression_is_true' takes no keyword argument 'condition'`

Cause: `condition` has been removed from the `expression_is_true` test, now that `where` is available on all tests automatically.

Resolution: Replace `condition` with `where`.

### `No materialization 'insert_by_period' was found for adapter`

Cause: `insert_by_period` has moved to the experimental features repo (see above).

Resolution: Install the package as described above.
