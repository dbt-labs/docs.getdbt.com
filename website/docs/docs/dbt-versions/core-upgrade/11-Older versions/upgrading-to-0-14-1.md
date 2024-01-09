---
title: "Upgrading to 0.14.1"
id: "upgrading-to-0-14-1"
displayed_sidebar: "docs"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

The dbt v0.14.1 release _does not_ contain any breaking code changes for users upgrading from v0.14.0. If you are upgrading from a version less than 0.14.0, consult the [Upgrading to 0.14.0](upgrading-to-0-14-0) migration guide. The following section contains important information for users of the `check` strategy on Snowflake and BigQuery. Action may be required in your database.

## Changes to the Snapshot "check" algorithm

:::caution Snowflake and BigQuery

The following section only applies to Snapshots running against Snowflake or BigQuery. If you are using a different database, then the following section does not apply to your dbt project.

:::

When a [Snapshot](/docs/build/snapshots) is configured to use the `check` strategy, dbt will compare the specified `check_cols` between the source dataset and the snapshotted dataset to determine if a row in the Snapshot has changed. A logic error in the v0.14.0 release of dbt caused this strategy to fail if the values of the specified `check_cols` for a given row cycled back into a previously known state. Importantly, this issue only affects Snowflake and BigQuery due to their respective uses of the `merge` statement in Snapshots.

In this failure mode, dbt would "finalize" existing records by setting a `dbt_valid_to` date for a changed record without correspondingly inserting a new record for the change. **In this state, the finalized records will no longer be tracked in the Snapshot <Term id="table" />**.

### Resolution

To determine if your Snapshot <Term id="table" /> is affected by this issue, you can run a query to find "stuck" records. These "stuck" records:
 - Are the most recent records for a given `unique_key` in the snapshot
 - Have a value for both `dbt_valid_from` and `dbt_valid_to`

The following query will return rows which meet this criteria:

<File name='snapshot_check_cols_migrate.sql'>

```sql
with base as (

    select *,

        -- Replace `<your unique key>` with your specified unique_key 
        <your unique key> as dbt_unique_key

    -- Replace <your snapshot table> with a snapshot table name
    from <your snapshot table>

),

ranked as (

    select *,
        row_number() over (
            partition by dbt_unique_key
            order by dbt_valid_from desc
        ) as change_idx

    from base

),

to_migrate as (

    select *
    from ranked
    where change_idx = 1
    and dbt_valid_to is not null

)

select * from to_migrate
limit 100;
```

</File>

If the above query returns a non-zero number of records, then you will need to manually fix the "stuck" records in this snapshot table.

There are two methods available for resolving this issue. In either case, it is recommended that you upgrade your Snapshot jobs to v0.14.1 as soon as possible to prevent this failure mode from occurring in subsequent snapshots.

### Approach #1: Manually update your snapshot tables

:::caution Warning!

This migration is only required for users of the `check` snapshot strategy on Snowflake and BigQuery. If your project doesn't meet these criteria, then you do not need to migrate your Snapshot tables.

:::

The query shown above will generate a set of rows which are in a "stuck" state. You can use the output of this query to update the records in your snapshot table to become "unstuck". To do this, use an `update` statement that sets the `dbt_valid_to` column to `null` for records identified in the query above. **Use caution when running <Term id="dml" /> directly against a snapshot table. It is a good idea to make a backup of this table before applying running this migration manually!** A sample query has been provided below: please test this query _thoroughly_ before running it in production.

<File name='fix_snapshot_stuck_records.sql'>

```sql

-- Replace <your snapshot table> with a snapshot table name
update <your snapshot table>
set dbt_valid_to = null
where dbt_scd_id in (

  with base as (

      select *,

          -- Replace `<your unique key>` with your specified unique_key 
          <your unique key> as dbt_unique_key

      -- Replace <your snapshot table> with a Snapshot table name
      from <your snapshot table>

  ),

  ranked as (

      select *,
          row_number() over (
              partition by dbt_unique_key
              order by dbt_valid_from desc
          ) as change_idx

      from base

  ),

  to_migrate as (

      select *
      from ranked
      where change_idx = 1
      and dbt_valid_to is not null

  )
 
  select dbt_scd_id from to_migrate

);
```

</File>

### Approach #2: Delete the existing snapshot tables

:::caution Warning!

This migration is only required for users of the `check` snapshot strategy on Snowflake and BigQuery. If your project doesn't meet these criteria, then you do not need to migrate your Snapshot tables.

:::

If you have only recently started snapshotting tables using the `check` strategy, you may simply drop your existing snapshot table(s) and begin recording new snapshot table(s) from scratch. **In general, you should be very careful when operating on snapshot tables manually. Take great care when deleting Snapshot tables.** If you choose to go this route, you _will_ lose data. Balance this tradeoff with the complexity specified in the first approach.

### Getting help

We're happy to help with this migration if you have any questions or issues. Please let us know [on Slack](https://community.getdbt.com) if you'd like a hand!
