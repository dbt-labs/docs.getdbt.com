---
title: "Upgrading to 0.14.0"
id: "upgrading-to-0-14-0"
---

This guide outlines migration instructions for:

1. [Upgrading archives to snapshots](#upgrading-to-snapshot-blocks)
2. [Taking advantage of updates to the `generate_schema_name` macro](#upgrading-the-generate_schema_name-signature)
3. [The removal of the `--non-destructive` flag](#non-destructive-runs)
4. [Changes to how incremental models are built on Snowflake](#snowflake-incremental-model-changes)

## Upgrading to Snapshot Blocks

In dbt v0.14.0, `archives` have been replaced by `snapshots`. Snapshots accomplish the same goal as archives, but are more powerful and more flexible. For the complete guide on using snapshots, consult the [snapshot documentation](/docs/build/snapshots).

There are a handful of changes to be aware of as you migrate from archives to snapshots:
- meta column names are now prefixed with `dbt_`
- snapshots are specified in .sql files, whereas archives were specified in the `dbt_project.yml` file

### Snapshot column name changes
This <Term id="table" /> shows the differences between the column names produced by `dbt archive` and `dbt snapshot`. **Note:** These new snapshot meta-column names are _unquoted_. If you're using Snowflake, this means that your snapshot column names will be rendered in upper-case, rather than lower-case.

| Archive Column (quoted) | Snapshot Column (unquoted) |
| ----------------------- | -------------------------- |
| valid_from | dbt_valid_from |
| valid_to | dbt_valid_to |
| scd_id | dbt_scd_id |

### Migrating archives to snapshots
Migrating archives to snapshots involves two different types of changes to your dbt project:

1. renaming columns in your existing archive tables
2. replacing your `archive:` section in `dbt_project.yml` file with `snapshot` blocks

We have provided a migration script in dbt v0.14.0 which accomplishes both of these tasks. This script will:

1. make a backup of your archive tables
2. rename columns as specified in the table above
3. generate snapshot blocks for your existing archives in new .sql files

The provided migration script should be run _once_ by a single dbt user. This database user must have sufficient permissions to operate on existing archive tables in the database.

### Running the migration script

:::caution Custom Materializations

This guide assumes that you are using the built-in archive <Term id="materialization" />. If you are using a custom archive materialization, see the section on "Migrating archives manually" below.

:::

By default, the migration script will not make any changes to your project or database. Instead, it will report on the changes that _should_ be made to migrate your archives to snapshots. To run the migration script in dry-run mode, execute:
```
$ dbt snapshot-migrate --from-archive
```

**Example output:**
```
$ dbt snapshot-migrate --from-archive
Running with dbt=0.14.0
Found 1 archive to migrate

Archive 1 of 1: "analytics"."archived"."orders_archived"
  - Skipping migration in dry-run mode
  - Skipping new snapshot file in dry-run mode

Re-run this script with `--apply` to apply these migrations
```

This command will output a list of archive tables that should be migrated. After verifying the list of archive tables, apply the migration using the `--apply` flag:

```
$ dbt snapshot-migrate --from-archive --apply
```

**Example output**:
```
$ dbt snapshot-migrate --from-archive --apply
Running with dbt=0.14.0
Found 1 archive to migrate

Archive 1 of 1: "analytics"."archived"."orders_archived"
  - Starting table migration
  - Backing up table to "analytics"."archived"."orders_archived_dbt_archive_migration_backup"
  - Finished table migration
  - Wrote new snapshot file to snapshots/orders_archived.sql

The following backup tables were created:
  - "analytics"."archived"."orders_archived_dbt_archive_migration_backup"

The following snapshot files were created:
  - snapshots/orders_archived.sql

After verifying the migrated tables in the database, please drop the backup
tables and remove any archive configs from your dbt_project.yml file.
```

If this step succeeds, then congratulations! Your archives have been migrated to snapshots.

### Completing your migration

After running the script above, it is important to validate the data in your new snapshot tables. Query the snapshot tables to ensure that they exist and feature meta-columns with `dbt_` prefixes.

Next, inspect the new snapshots in your `snapshots/` directory. There should be one snapshot file per archive that exists in your project. If these snapshot files are present and valid, then you can delete the `archive:` section from your `dbt_project.yml` file.

 When you are confident that the migration has completed successfully, you can manually delete the backup tables in your archived schema(s). These backup tables will be suffixed with `_dbt_archive_migration_backup`.

Snapshots participate in the dbt graph, so feel free to replace any `schema.table` references in your model code with `{{ ref('archive_name') }}`. You may also need to make changes to downstream models or reports to account for the changes to your snapshot meta-column names. Consult the [snapshot docs](/docs/build/snapshots) for full usage instructions.

### Migrating archives manually (not recommended)

If you are unable to use the archive migration script, you can instead migrate your archives to snapshots manually. The exact steps required to migrate archives to snapshots vary by database, but broadly, you'll need to rename the archive meta-columns in accordance with the migration table above. Example migration queries (using postgres syntax):
```sql
alter table archived.orders_archived rename "valid_from" to dbt_valid_from;
alter table archived.orders_archived rename "valid_to" to dbt_valid_to;
alter table archived.orders_archived rename "scd_id" to dbt_scd_id;
```

## Upgrading the generate_schema_name signature

In dbt v0.14.0, the `generate_schema_name` macro signature was changed to accept a second argument, `node`. For more information on the new `node` argument, consulting the documentation for [using custom schemas](/docs/build/custom-schemas).

Existing one-argument implementations of `generate_schema_name` macros are still supported, but support for this form of the macro will be dropped in a future release. If you currently have a one-argument version of this macro, you will see a warning when you run your dbt project.

### Example Warning
```
As of dbt v0.14.0, the `generate_schema_name` macro accepts a second "node"
argument. The one-argument form of `generate_schema_name` is deprecated, and
will become unsupported in a future release
```

### Upgrading
To upgrade this macro (and suppress this warning), add a second argument, `node`, to your `generate_schema_name` macro.

<File name='generate_schema_name.sql'>

```jinja2
{% macro generate_schema_name(schema_name, node) -%}
  ... your logic here ...
{%- endmacro %}
```

</File>


## Non-Destructive runs

The `--non-destructive` flag was removed from dbt in v0.14.0. This flag existed as a workaround for the lack of late-binding <Term id="view">views</Term> in Amazon Redshift. With the introduction of the [with no schema binding](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html) clause for Redshift views, non-destructive runs are no longer necessary.

The `--non-destructive` flag was problematic for a few reasons:

1. It used a `truncate` statement which committed the existing transaction. This means that non-destructive runs were not atomic, and errors in a model build could leave you with empty tables!
2. It made the dbt's materializations incredibly complicated and hard to maintain
3. It skipped building views entirely, which is rarely desirable
4. It failed in tricky and pernicious ways when columns were added or removed from table models

Snowflake, BigQuery, SparkSQL, and Presto users should be unaffected by this change as there is limited merit to using the `--non-destructive` flag on these databases.

Redshift users should consider using the [bind: false](/reference/resource-configs/redshift-configs#late-binding-views) config to instruct dbt to create unbound views.

Postgres users should ensure that they use table or incremental models for relations which are queried by end-users.

## Snowflake Incremental Model Changes

In dbt v0.14.0, the implementation of `incremental` models on Snowflake has changed. By default, dbt will use a [merge](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) statement to atomically upsert records into a <Term id="table" /> incrementally. Previous versions of dbt used a two-step `delete+insert` approach to upsert data.

The `merge` statement requires that records participating in the upsert are unique. If these records are not unique, then the statement will fail with a "nondeterministic merge" error. If you see this error after upgrading to 0.14.0, you can resolve it in one of two ways:

1. Modify your model query logic to ensure that the specified `unique_key` parameter is indeed unique
2. Set the `incremental_strategy` config to `delete+insert` to continue using the previous two-step incremental approach

The `incremental_strategy` config can be set in your `dbt_project.yml` file (if you want to apply this config to all models), or it can be applied in specific models where required.

**Configuring the `incremental_strategy` for all models:**

<File name='dbt_project.yml'>

```yaml
# Your dbt_project.yml file

models:
  incremental_strategy: "delete+insert"
```

</File>

**Configuring the `incremental_strategy for a single model:**

<File name='models/my_model.sql'>

```sql

{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='delete+insert'
  )
}}

select ...
```

</File>
