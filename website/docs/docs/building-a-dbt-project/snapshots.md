---
title: "Snapshots"
id: "snapshots"
---

## Related documentation
* [Snapshot configurations](reference/snapshot-configs.md)
* The `dbt snapshot` [command](docs/running-a-dbt-project/command-line-interface/snapshot.md)

## Getting started
Commonly, analysts need to "look back in time" at some previous state of data in their mutable tables. While some source data systems are built in a way that makes accessing historical data possible, this is often not the case. dbt provides a mechanism, Snapshots, which records changes to a mutable table over time.

### What are Snapshots?
Snapshots implement [type-2 Slowly Changing Dimensions](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row) over mutable source tables. These Slowly Changing Dimensions (or SCDs) identify how a row in a table changes over time. Imagine you have an `orders` table where the `status` field can be overwritten as the order is processed.

| order_id | status | updated_at |
| -------- | ------ | ---------- |
| 1 | pending | 2019-01-01 |

Now, imagine that the order goes from "pending" to "shipped". That same record will now look like:

| order_id | status | updated_at |
| -------- | ------ | ---------- |
| 1 | shipped | 2019-01-02 |

This order is now in the "shipped" state, but we've lost the information about when the order was last in the "pending" state. This makes it difficult (or impossible) to analyze how long it took for an order to ship. dbt can "snapshot" these changes to help you understand how values in a row change over time. Here's an example of a snapshot table for the previous example:

| order_id | status | updated_at | dbt_valid_from | dbt_valid_to |
| -------- | ------ | ---------- | -------------- | ------------ |
| 1 | pending | 2019-01-01 | 2019-01-01 | 2019-01-02 |
| 1 | shipped | 2019-01-02 | 2019-01-02 | `null` |

dbt creates this Snapshot table by copying the structure of your source table, and then adding some helpful metadata fields. The `dbt_valid_from` and `dbt_valid_to` columns indicate the historical state for a given record. The current value for a row is represented with a `null` value for `dbt_valid_to`.

## Example
To add a snapshot to your project:
1. Create a file in your `snapshots` directory with a `.sql` file extension, e.g. `snapshots/orders.sql`
2. Use a `snapshot` block to define the start and end of a snapshot:

<File name='snapshots/order.sql'>

```sql
{% snapshot orders_snapshot %}

{% endsnapshot %}
```

</File>

3. Write a `select` statement within the snapshot block (tips for writing a good snapshot query are below). This select statement defines the results that you want to snapshot over time. You can use `sources` and `refs` here.

<File name='snapshots/order.sql'>

```sql
{% snapshot orders_snapshot %}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

4. Check whether the result set of your query includes a reliable timestamp column that indicates when a record was last updated. For our example, the `updated_at` column reliably indicates record changes, so we can use the `timestamp` strategy. If your query result set does not have a reliable timestamp, you'll need to instead use the `check` strategy — more details on this below.

5. Add configurations to your snapshot using a `config` block (more details below). You can also configure your snapshot from your `dbt_project.yml` file ([docs](snapshot-configs)).

<File name='snapshots/order.sql'>

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

6. Run the `dbt snapshot` [command](snapshot) — for our example a new table will be created at `analytics.snapshots.orders_snapshot`. Changing the `target_database` configuration, the `target_schema` configuration and the name of the snapshot (as defined in `{% snapshot .. %}`) will change how dbt names this table.

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

10. Schedule the `snapshot` command to run regularly — snapshots are only useful if you run them frequently.


## How does dbt know which rows have changed?
Snapshot "strategies" define how dbt knows if a row has changed. There are two strategies built-in to dbt, but other strategies can be created as macros in dbt projects. While each strategy requires its own configuration, the `unique_key` config is required for _all_ snapshot strategies.

### Timestamp strategy (recommended)
The `timestamp` strategy uses an `updated_at` field to determine if a row has changed. If the configured `updated_at` column for a row is more recent than the last time the snapshot ran, then dbt will invalidate the old record and record the new one. If the timestamps are unchanged, then dbt will not take any action.

The `timestamp` strategy requires the following configurations:

| Config | Description | Example |
| ------ | ----------- | ------- |
| updated_at | A column or expression which represents when the source row was last updated | `updated_at` |

**Example usage:**

<File name='snapshots/timestamp_example.sql'>

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



<Callout type="warning" title="check_cols = 'all'">

The `check` snapshot strategy can be configured to track changes to _all_ columns by supplying `check_cols = 'all'`. It is better to explicitly enumerate the columns that you want to check. Consider using a [surrogate key](https://github.com/fishtown-analytics/dbt-utils#surrogate_key-source) to condense many columns into a single column.

</Callout>


**Example Usage**

<File name='snapshots/check_example.sql'>

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

## Configuring snapshots

There are a number of snapshot-specific configurations:

| Config | Description | Required? | Example |
| ------ | ----------- | --------- | ------- |
| [target_database](target_database) | The database that dbt should render the snapshot table into | No | analytics |
| [target_schema](target_schema) | The schema that dbt should render the snapshot table into | Yes | snapshots |
| [strategy](strategy) | The snapshot strategy to use. One of `timestamp` or `check` | Yes | timestamp |
| [unique_key](unique_key) | A primary key column or expression for the record | Yes | order_id |
| [check_cols](check_cols) | If using the `check` strategy, then the columns to check | Only if using the `check` strategy | ["status"] |
| [updated_at](updated_at) | If using the `timestamp` strategy, the timestamp column to compare | Only if using the `timestamp` strategy | updated_at |

A number of other configurations are also supported (e.g. `tags` and `post-hook`), check out the full list [here](snapshot-configs).

Snapshots can be configured from both your `dbt_project.yml` file and a `config` block, check out the [configuration docs](snapshot-configs) for more information.


## Configuration best practices
### Use the `timestamp` strategy where possible
This strategy handles column additions and deletions better than the `check_cols` strategy.

### Ensure your unique key is really unique
The unique key is used by dbt to match rows up, so it's extremely important to make sure this key is actually unique! If you're snapshotting a source, I'd recommend adding a uniqueness test to your source ([example](https://github.com/fishtown-analytics/jaffle_shop/blob/demo/master/models/staging/jaffle_shop/jaffle_shop.yml#L22)).

### Use a `target_schema` that is separate to your analytics schema
Snapshots cannot be rebuilt. As such, it's a good idea to put snapshots in a separate schema so end users know they are special. From there, you may want to set different privileges on your snapshots compared to your models, and even run them as a different user (or role, depending on your warehouse) to make it very difficult to drop a snapshot unless you really want to.

## Snapshot query best practices
With regards to the specific query to write in your snapshot, we recommend that you:
* **Snapshot source data.** Your models should then select from these snapshots, treating them like regular data sources. As much as possible, snapshot your source data in its raw form and use downstream models to clean up the data
* **Use the `source` function in your query.** This helps when understanding data lineage in your project.
* **Include as many columns as possible.** In fact, go for `select *` if performance permits! Even if a column doesn't feel useful at the moment, it might be better to snapshot it in case it becomes useful – after all, you won't be able to recreate the column later.
* **Avoid joins in your snapshot query.** Joins can make it difficult to build a reliable `updated_at` timestamp. Instead, snapshot the two tables separately, and join them in downstream models.
* **Limit the amount of transformation in your query.** If you apply business logic in a snapshot query, and this logic changes in the future, it can be impossible (or, at least, very difficult) to apply the change in logic to your snapshots.

Basically – keep your query as simple as possible! Some reasonable exceptions to these recommendations include:
* Selecting specific columns if the table is wide.
* Doing light transformation to get data into a reasonable shape, for example, unpacking a JSON blob to flatten your source data into columns.

## Snapshot meta-fields
Snapshot tables will be created as a clone of your source dataset, plus some addition meta-fields.

| Field | Meaning | Usage |
| ----- | ------- | ----- |
| dbt_valid_from | The timestamp when this snapshot row was first inserted | This column can be used to order the different "versions" of a record. |
| dbt_valid_to | The timestamp when this row row became invalidated. | The most recent snapshot record will have `dbt_valid_to` set to `null`. |
| dbt_scd_id | A unique key generated for each snapshotted record. | This is used internally by dbt |
| dbt_updated_at | The updated_at timestamp of the source record when this snapshot row was inserted. | This is used internally by dbt |


## FAQs

<FAQ src="run-one-snapshot" />
<FAQ src="snapshot-frequency" />
<FAQ src="snapshot-schema-changes" />
<FAQ src="snapshot-hooks" />
<FAQ src="snapshot-target-schema" />
