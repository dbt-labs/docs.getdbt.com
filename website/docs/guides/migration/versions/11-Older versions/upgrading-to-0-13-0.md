---
title: "Upgrading to 0.13.0"
id: "upgrading-to-0-13-0"
---

## Breaking changes

### on-run-start and on-run-end

The special Jinja variable `{{this}}` is no longer implemented for `on-run-start` and `on-run-end` hooks. 

Use a variable from the [`{{ target }}` context](/reference/dbt-jinja-functions/target) or [`on-run-end` context](/reference/dbt-jinja-functions/on-run-end-context) instead.

### Adapter methods

A number of materialization-specific adapter methods have changed in breaking ways. If you use these adapter methods in your macros or <Term id="materialization">materializations</Term>, you may need to update your code accordingly.
  - query_for_existing - **removed**, use [get_relation](/reference/dbt-jinja-functions/adapter#get_relation) instead.
  - [get_missing_columns](/reference/dbt-jinja-functions/adapter#get_missing_columns) - changed to take `Relation`s instead of schemas and identifiers
  - [expand_target_column_types](/reference/dbt-jinja-functions/adapter#expand_target_column_types) - changed to take a `Relation` instead of schema, identifier
  - [get_relation](/reference/dbt-jinja-functions/adapter#get_relation) - added a `database` argument
  - [create_schema](/reference/dbt-jinja-functions/adapter#create_schema) - added a `database` argument
  - [drop_schema](/reference/dbt-jinja-functions/adapter#drop_schema) - added a `database` argument

## End of support

Version 1 schema.yml specs (deprecated in 0.11.0) are no longer supported. Please use the version 2 spec instead.

See the [0.11.0 migration guide](upgrading-to-0-11-0.md#schemayml-v2-syntax) for details.
