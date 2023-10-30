---
title: "Upgrading to 0.16.0"
id: "upgrading-to-0-16-0"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

dbt v0.16.0 contains many new features, bug fixes, and improvements. This guide
covers all of the important information to consider when upgrading from an earlier
version of dbt to 0.16.0.

## Articles:
 - [BigQuery incremental model changes](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982)
 - [BigQuery incremental model performance bechmarking](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981)

## Breaking changes

The following changes may require you to change the code in your dbt project
after upgrading to v0.16.0.

### Seed type inference
A number of improvements have been made to the type-inference logic in dbt. dbt
previously errantly converted string values in [seed CSV files](/docs/build/seeds)
like `sunday` or `March` into date timestamps in the year `0001`.
This was obviously incorrect and has now been remedied, but if you
_relied_ on this functionality, then this represents a breaking change. See
[this pull request](https://github.com/dbt-labs/dbt-core/pull/1920) for more
information on the change.

### One-argument generate_schema_name deprecation
Support for the one-argument variant of `generate_schema_name` macros (deprecated
in a previous release) are no longer supported. If you are using the one-argument
variant of `generate_schema_name`, see [the docs on custom schemas](/docs/build/custom-schemas)
for an example of how to use the two-argument variant of `generate_schema_name`.

### BigQuery partition_by syntax

The `partition_by` config for BigQuery models now accepts a dictionary containing
the following keys:
- `field`: The field name in the <Term id="table" /> to partition by
- `data_type`: The data type for the partitioning field (`date`, `timestamp`, `datetime`, `int64`)
- `range`: Only required if the `data_type` is `int64` (for range bucket partitioning)

If a string is provided as the `partition_by` config for a model on BigQuery, dbt
will attempt to parse that string out to a field and data_type representation. A future
release of dbt will remove the ability for `partition_by` configs to be configured
using a string.

See the docs on [BigQuery partitioning](/reference/resource-configs/bigquery-configs#partition-clause) for
more information on the updated `partition_by` syntax for BigQuery models. See also
[this guide](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982) for
more information on how dbt leverages this new syntax to make incremental models build
faster and cheaper.

### Source test argument compilation
Source test arguments are now handled the same way as model test arguments.
If you are providing jinja expressions in Source table schema tests, then this
is a breaking change for your project. See [this pull request](https://github.com/dbt-labs/dbt-core/pull/2150)
for more information on the change.

### Debug log timestamp formatting
The format of timestamps in debug logs has changed. Previously, a comma (`,`)
was used to separate the seconds and microseconds in debug log timestamps. If you are
programmatically consuming the debug logs emitted by dbt, this could be a breaking change.
See [this pull request](https://github.com/dbt-labs/dbt-core/pull/2099) for more
information on the change.

### Docrefs removed from manifest
`docrefs` are no longer present in the compiled `manifest.json` file. If you are programmatically
consuming the `manifest.json` file emitted by dbt and making use of the `docrefs` field
in the manifest, then this is a breaking change. See [this pull request](https://github.com/dbt-labs/dbt-core/pull/2096) for more information no the change.

### get_catalog macro interface change
`get_catalog` macros should now accept two arguments: a Relation pointing to an
information schema, and a list of schemas to search for in the supplied information schema.
If you are overriding the `get_catalog` macro in your project, you can find more
information about this change in [this pull request](https://github.com/dbt-labs/dbt-core/pull/2037).

### snowflake__list_schemas macro interface change
The `snowflake__list_schemas` macro should now return an Agate dataframe with a
column named `"name"`. If you are overriding the `snowflake__list_schemas` macro in your
project, you can find more information about this change in [this pull request](https://github.com/dbt-labs/dbt-core/pull/2171).

### Snowflake databases wih 10,000 schemas
dbt no longer supports running against Snowflake databases containing more than
10,000 schemas. This is due limitations of the `show schemas in database` query
that dbt now uses to find schemas in a Snowflake database. If your dbt project
is running against a Snowflake database containing more than 10,000 schemas, you should
not upgrade to dbt v0.16.0.

If this change is applicable to your dbt project, please let us know in a dbt
issue or in the dbt Slack.

## Python requirements

If you are installing dbt in a Python environment alongside other Python modules,
please be mindful of the following changes to dbt's Python dependencies:

- Added dependency on `'cffi>=1.9,<1.14',` to fix `snowflake-connector-python` issues
- Changed upper bound `'requests<2.23.0',` to fix `snowflake-connector-python` issues
- Added dependency on `'idna<2.9'` to fix `snowflake-connector-python` issues
- Changed `snowflake-connector-python` to `2.2.1`
- Increased `google-cloud-bigquery` to `>=1.22.0` to add support for integer bucket partitioning
- Changed upper bound on `Jinja2 < 3`

## New and changed documentation
- [BigQuery partitioning configs](/reference/resource-configs/bigquery-configs)
- [Select specific seeds to run with `--select`](/reference/commands/seed)
- [New `generate_database_name` macro](/docs/build/custom-databases#generate_database_name)
- [New `dbt_project.yml context`](/reference/dbt-jinja-functions/dbt-project-yml-context)
- [New configurations for schema.yml files](/reference/configs-and-properties)
- [New configurations for Source declarations](/docs/build/sources)
- [New Postgres connection configs](/docs/core/connect-data-platform/postgres-setup)
- [New Snowflake KeyPair auth configs](/docs/core/connect-data-platform/snowflake-setup)
- [New `builtins` jinja context variable](/reference/dbt-jinja-functions/builtins)
- [New `fromyaml` context method](/reference/dbt-jinja-functions/fromyaml)
- [New `toyaml` context method](/reference/dbt-jinja-functions/toyaml)
- [New `project_name` context variable](/reference/dbt-jinja-functions/project_name)
- [New `dbt_version` context variable](/reference/dbt-jinja-functions/dbt_version)
- [New `database_schemas` variable in the `on-run-end` context](/reference/dbt-jinja-functions/on-run-end-context)
