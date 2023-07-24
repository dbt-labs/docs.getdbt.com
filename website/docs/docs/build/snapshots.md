---
title: "Add snapshots to your DAG"
sidebar_label: "Snapshots"
description: "Read this tutorial to learn how to use snapshots when building in dbt."
id: "snapshots"
---

## Related documentation
* [Snapshot configurations](/reference/snapshot-configs)
* [Snapshot properties](/reference/snapshot-properties)
* [`snapshot` command](/reference/commands/snapshot)


### What are snapshots?
Analysts often need to "look back in time" at previous data states in their mutable tables. While some source data systems are built in a way that makes accessing historical data possible, this is not always the case. dbt provides a mechanism, **snapshots**, which records changes to a mutable <Term id="table" /> over time.

Snapshots implement [type-2 Slowly Changing Dimensions](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row) over mutable source tables. These Slowly Changing Dimensions (or SCDs) identify how a row in a table changes over time. Imagine you have an `orders` table where the `status` field can be overwritten as the order is processed.

| id | status | updated_at |
| -- | ------ | ---------- |
| 1 | pending | 2019-01-01 |

Now, imagine that the order goes from "pending" to "shipped". That same record will now look like:

| id | status | updated_at |
| -- | ------ | ---------- |
| 1 | shipped | 2019-01-02 |

This order is now in the "shipped" state, but we've lost the information about when the order was last in the "pending" state. This makes it difficult (or impossible) to analyze how long it took for an order to ship. dbt can "snapshot" these changes to help you understand how values in a row change over time. Here's an example of a snapshot table for the previous example:

| id | status | updated_at | dbt_valid_from | dbt_valid_to |
| -- | ------ | ---------- | -------------- | ------------ |
| 1 | pending | 2019-01-01 | 2019-01-01 | 2019-01-02 |
| 1 | shipped | 2019-01-02 | 2019-01-02 | `null` |

In dbt, snapshots are `select` statements, defined within a snapshot block in a `.sql` file (typically in your `snapshots` directory). You'll also need to configure your snapshot to tell dbt how to detect record changes.

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_database='analytics',
      target_schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

:::info Preview or Compile Snapshots in IDE

It is not possible to "preview data" or "compile sql" for snapshots in dbt Cloud. Instead, run the `dbt snapshot` command in the IDE by completing the following steps.

:::

When you run the [`dbt snapshot` command](/reference/commands/snapshot):
* **On the first run:** dbt will create the initial snapshot table — this will be the result set of your `select` statement, with additional columns including `dbt_valid_from` and `dbt_valid_to`. All records will have a `dbt_valid_to = null`.
* **On subsequent runs:** dbt will check which records have changed or if any new records have been created:
  - The `dbt_valid_to` column will be updated for any existing records that have changed
  - The updated record and any new records will be inserted into the snapshot table. These records will now have `dbt_valid_to = null`

Snapshots can be referenced in downstream models the same way as referencing models — by using the [ref](/reference/dbt-jinja-functions/ref) function.

## Example

To add a snapshot to your project:

1. Create a file in your `snapshots` directory with a `.sql` file extension, e.g. `snapshots/orders.sql`
2. Use a `snapshot` block to define the start and end of a snapshot:

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{% endsnapshot %}
```

</File>

3. Write a `select` statement within the snapshot block (tips for writing a good snapshot query are below). This select statement defines the results that you want to snapshot over time. You can use `sources` and `refs` here.

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

4. Check whether the result set of your query includes a reliable timestamp column that indicates when a record was last updated. For our example, the `updated_at` column reliably indicates record changes, so we can use the `timestamp` strategy. If your query result set does not have a reliable timestamp, you'll need to instead use the `check` strategy — more details on this below.

5. Add configurations to your snapshot using a `config` block (more details below). You can also configure your snapshot from your `dbt_project.yml` file ([docs](/reference/snapshot-configs)).

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_database='analytics',
      target_schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

6. Run the `dbt snapshot` [command](/reference/commands/snapshot) — for our example a new table will be created at `analytics.snapshots.orders_snapshot`. You can change the `target_database` configuration, the `target_schema` configuration and the name of the snapshot (as defined in `{% snapshot .. %}`) will change how dbt names this table.

```
$ dbt snapshot
Running with dbt=0.16.0

15:07:36 | Concurrency: 8 threads (target='dev')
15:07:36 |
15:07:36 | 1 of 1 START snapshot snapshots.orders_snapshot...... [RUN]
15:07:36 | 1 of 1 OK snapshot snapshots.orders_snapshot..........[SELECT 3 in 1.82s]
15:07:36 |
15:07:36 | Finished running 1 snapshots in 0.68s.

Completed successfully

Done. PASS=2 ERROR=0 SKIP=0 TOTAL=1
```

7. Inspect the results by selecting from the table dbt created. After the first run, you should see the results of your query, plus the [snapshot meta fields](#snapshot-meta-fields) as described below.

8. Run the `snapshot` command again, and inspect the results. If any records have been updated, the snapshot should reflect this.

9. Select from the `snapshot` in downstream models using the `ref` function.

<File name='models/changed_orders.sql'>

```sql
select * from {{ ref('orders_snapshot') }}
```

</File>

10. Schedule the `snapshot` command to run regularly — snapshots are only useful if you run them frequently.


## Detecting row changes
Snapshot "strategies" define how dbt knows if a row has changed. There are two strategies built-in to dbt — `timestamp` and `check`.

### Timestamp strategy (recommended)
The `timestamp` strategy uses an `updated_at` field to determine if a row has changed. If the configured `updated_at` column for a row is more recent than the last time the snapshot ran, then dbt will invalidate the old record and record the new one. If the timestamps are unchanged, then dbt will not take any action.

The `timestamp` strategy requires the following configurations:

| Config | Description | Example |
| ------ | ----------- | ------- |
| updated_at | A column which represents when the source row was last updated | `updated_at` |

**Example usage:**

<File name='snapshots/orders_snapshot_timestamp.sql'>

```sql
{% snapshot orders_snapshot_timestamp %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

### Check strategy
The `check` strategy is useful for tables which do not have a reliable `updated_at` column. This strategy works by comparing a list of columns between their current and historical values. If any of these columns have changed, then dbt will invalidate the old record and record the new one. If the column values are identical, then dbt will not take any action.

The `check` strategy requires the following configurations:

| Config | Description | Example |
| ------ | ----------- | ------- |
| check_cols | A list of columns to check for changes, or `all` to check all columns | `["name", "email"]` |



:::caution check_cols = 'all'

The `check` snapshot strategy can be configured to track changes to _all_ columns by supplying `check_cols = 'all'`. It is better to explicitly enumerate the columns that you want to check. Consider using a <Term id="surrogate-key" /> to condense many columns into a single column.

:::


**Example Usage**

<File name='snapshots/orders_snapshot_check.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          target_schema='snapshots',
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>


### Hard deletes (opt-in)

Rows that are deleted from the source query are not invalidated by default. With the config option `invalidate_hard_deletes`, dbt can track rows that no longer exist. This is done by left joining the snapshot table with the source table, and filtering the rows that are still valid at that point, but no longer can be found in the source table. `dbt_valid_to` will be set to the current snapshot time.

This configuration is not a different strategy as described above, but is an additional opt-in feature. It is not enabled by default since it alters the previous behavior.

For this configuration to work with the `timestamp` strategy, the configured `updated_at` column must be of timestamp type. Otherwise, queries will fail due to mixing data types.

**Example Usage**

<File name='snapshots/orders_snapshot_hard_delete.sql'>

```sql
{% snapshot orders_snapshot_hard_delete %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
          invalidate_hard_deletes=True,
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>


## Configuring snapshots
### Snapshot configurations
There are a number of snapshot-specific configurations:

| Config | Description | Required? | Example |
| ------ | ----------- | --------- | ------- |
| [target_database](/reference/resource-configs/target_database) | The database that dbt should render the snapshot table into | No | analytics |
| [target_schema](/reference/resource-configs/target_schema) | The schema that dbt should render the snapshot table into | Yes | snapshots |
| [strategy](/reference/resource-configs/strategy) | The snapshot strategy to use. One of `timestamp` or `check` | Yes | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | A <Term id="primary-key" /> column or expression for the record | Yes | id |
| [check_cols](/reference/resource-configs/check_cols) | If using the `check` strategy, then the columns to check | Only if using the `check` strategy | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | If using the `timestamp` strategy, the timestamp column to compare | Only if using the `timestamp` strategy | updated_at |
| [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) | Find hard deleted records in source, and set `dbt_valid_to` current time if no longer exists | No | True |

A number of other configurations are also supported (e.g. `tags` and `post-hook`), check out the full list [here](/reference/snapshot-configs).

Snapshots can be configured from both your `dbt_project.yml` file and a `config` block, check out the [configuration docs](/reference/snapshot-configs) for more information.

Note: BigQuery users can use `target_project` and `target_dataset` as aliases for `target_database` and `target_schema`, respectively.


### Configuration best practices
#### Use the `timestamp` strategy where possible
This strategy handles column additions and deletions better than the `check` strategy.

#### Ensure your unique key is really unique
The unique key is used by dbt to match rows up, so it's extremely important to make sure this key is actually unique! If you're snapshotting a source, I'd recommend adding a uniqueness test to your source ([example](https://github.com/dbt-labs/jaffle_shop/blob/8e7c853c858018180bef1756ec93e193d9958c5b/models/staging/schema.yml#L26)).

#### Use a `target_schema` that is separate to your analytics schema
Snapshots cannot be rebuilt. As such, it's a good idea to put snapshots in a separate schema so end users know they are special. From there, you may want to set different privileges on your snapshots compared to your models, and even run them as a different user (or role, depending on your warehouse) to make it very difficult to drop a snapshot unless you really want to.

## Snapshot query best practices

#### Snapshot source data.
Your models should then select from these snapshots, treating them like regular data sources. As much as possible, snapshot your source data in its raw form and use downstream models to clean up the data

#### Use the `source` function in your query.
This helps when understanding <Term id="data-lineage">data lineage</Term> in your project.

#### Include as many columns as possible.
In fact, go for `select *` if performance permits! Even if a column doesn't feel useful at the moment, it might be better to snapshot it in case it becomes useful – after all, you won't be able to recreate the column later.

#### Avoid joins in your snapshot query.
Joins can make it difficult to build a reliable `updated_at` timestamp. Instead, snapshot the two tables separately, and join them in downstream models.

#### Limit the amount of transformation in your query.
If you apply business logic in a snapshot query, and this logic changes in the future, it can be impossible (or, at least, very difficult) to apply the change in logic to your snapshots.

Basically – keep your query as simple as possible! Some reasonable exceptions to these recommendations include:
* Selecting specific columns if the table is wide.
* Doing light transformation to get data into a reasonable shape, for example, unpacking a <Term id="json" /> blob to flatten your source data into columns.

## Snapshot meta-fields

Snapshot <Term id="table">tables</Term> will be created as a clone of your source dataset, plus some additional meta-fields*.

| Field          | Meaning | Usage |
| -------------- | ------- | ----- |
| dbt_valid_from | The timestamp when this snapshot row was first inserted | This column can be used to order the different "versions" of a record. |
| dbt_valid_to   | The timestamp when this row became invalidated. | The most recent snapshot record will have `dbt_valid_to` set to `null`. |
| dbt_scd_id     | A unique key generated for each snapshotted record. | This is used internally by dbt |
| dbt_updated_at | The updated_at timestamp of the source record when this snapshot row was inserted. | This is used internally by dbt |

*The timestamps used for each column are subtly different depending on the strategy you use:

For the `timestamp` strategy, the configured `updated_at` column is used to populate the `dbt_valid_from`, `dbt_valid_to` and `dbt_updated_at` columns.

<details>
<summary>  Details for the timestamp strategy </summary>

Snapshot query results at `2019-01-01 11:00`

| id | status  | updated_at       |
| -- | ------- | ---------------- |
| 1        | pending | 2019-01-01 10:47 |

Snapshot results (note that `11:00` is not used anywhere):

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1        | pending | 2019-01-01 10:47 | 2019-01-01 10:47 |                  | 2019-01-01 10:47 |

Query results at `2019-01-01 11:30`:

| id | status  | updated_at       |
| -- | ------- | ---------------- |
| 1  | shipped | 2019-01-01 11:05 |

Snapshot results (note that `11:30` is not used anywhere):

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1  | pending | 2019-01-01 10:47 | 2019-01-01 10:47 | 2019-01-01 11:05 | 2019-01-01 10:47 |
| 1  | shipped | 2019-01-01 11:05 | 2019-01-01 11:05 |                  | 2019-01-01 11:05 |

</details>

<br/>

For the `check` strategy, the current timestamp is used to populate each column. If configured, the `check` strategy uses the `updated_at` column instead, as with the timestamp strategy.

<details>
<summary>  Details for the check strategy </summary>

Snapshot query results at `2019-01-01 11:00`

| id | status  |
| -- | ------- |
| 1  | pending |

Snapshot results:

| id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- |
| 1  | pending | 2019-01-01 11:00 |                  | 2019-01-01 11:00 |

Query results at `2019-01-01 11:30`:

| id | status  |
| -- | ------- |
| 1  | shipped |

Snapshot results:

| id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| --- | ------- | ---------------- | ---------------- | ---------------- |
| 1   | pending | 2019-01-01 11:00 | 2019-01-01 11:30 | 2019-01-01 11:00 |
| 1   | shipped | 2019-01-01 11:30 |                  | 2019-01-01 11:30 |

</details>


## FAQs
<FAQ path="Runs/run-one-snapshot" />
<FAQ path="Runs/snapshot-frequency" />
<FAQ path="Snapshots/snapshot-schema-changes" />
<FAQ path="Snapshots/snapshot-hooks" />
<FAQ path="Snapshots/snapshot-target-schema" />
<FAQ path="Accounts/configurable-snapshot-path" />
<FAQ path="Snapshots/snapshot-target-is-not-a-snapshot-table" />
