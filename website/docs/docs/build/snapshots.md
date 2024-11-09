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
| 1 | pending | 2024-01-01 |

Now, imagine that the order goes from "pending" to "shipped". That same record will now look like:

| id | status | updated_at |
| -- | ------ | ---------- |
| 1 | shipped | 2024-01-02 |

This order is now in the "shipped" state, but we've lost the information about when the order was last in the "pending" state. This makes it difficult (or impossible) to analyze how long it took for an order to ship. dbt can "snapshot" these changes to help you understand how values in a row change over time. Here's an example of a snapshot table for the previous example:

| id | status | updated_at | dbt_valid_from | dbt_valid_to |
| -- | ------ | ---------- | -------------- | ------------ |
| 1 | pending | 2024-01-01 | 2024-01-01 | 2024-01-02 |
| 1 | shipped | 2024-01-02 | 2024-01-02 | `null` |


## Configuring snapshots

:::info Previewing or compiling snapshots in IDE not supported

It is not possible to "preview data" or "compile sql" for snapshots in dbt Cloud. Instead, [run the `dbt snapshot` command](#how-snapshots-work) in the IDE.

:::

<VersionBlock lastVersion="1.8" >

- To configure snapshots in versions 1.8 and earlier, refer to [Configure snapshots in versions 1.8 and earlier](#configure-snapshots-in-versions-18-and-earlier). These versions use an older syntax where snapshots are defined within a snapshot block in a `.sql` file, typically located in your `snapshots` directory. 
- Note that defining multiple resources in a single file can significantly slow down parsing and compilation. For faster and more efficient management, consider the updated snapshot YAML syntax, [available in Versionless](/docs/dbt-versions/versionless-cloud) or [dbt Core v1.9 and later](/docs/dbt-versions/core).


</VersionBlock>

<VersionBlock firstVersion="1.9">

Configure your snapshots in YAML files to tell dbt how to detect record changes. Define snapshots configurations in YAML files, alongside your models, for a cleaner, faster, and more consistent set up. 

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: string
    relation: relation # source('my_source', 'my_table') or ref('my_model')
    config:
      [database](/reference/resource-configs/database): string
      [schema](/reference/resource-configs/schema): string
      [alias](/reference/resource-configs/alias): string
      [strategy](/reference/resource-configs/strategy): timestamp | check
      [unique_key](/reference/resource-configs/unique_key): column_name_or_expression
      [check_cols](/reference/resource-configs/check_cols): [column_name] | all
      [updated_at](/reference/resource-configs/updated_at): column_name
      [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes): true | false
      [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names): dictionary

```

</File>

The following table outlines the configurations available for snapshots:

| Config | Description | Required? | Example |
| ------ | ----------- | --------- | ------- |
| [database](/reference/resource-configs/database) | Specify a custom database for the snapshot | No | analytics |
| [schema](/reference/resource-configs/schema) | Specify a custom schema for the snapshot | No | snapshots |
| [alias](/reference/resource-configs/alias)   | Specify an alias for the snapshot | No | your_custom_snapshot |
| [strategy](/reference/resource-configs/strategy) | The snapshot strategy to use. Valid values: `timestamp` or `check` | Yes | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | A <Term id="primary-key" /> column or expression for the record | Yes | id |
| [check_cols](/reference/resource-configs/check_cols) | If using the `check` strategy, then the columns to check | Only if using the `check` strategy | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | If using the `timestamp` strategy, the timestamp column to compare | Only if using the `timestamp` strategy | updated_at |
| [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) | Find hard deleted records in source and set `dbt_valid_to` to current time if the record no longer exists | No | True |
| [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names) | Customize the names of the snapshot meta fields | No | dictionary |

- In versions prior to v1.9, the `target_schema` (required) and `target_database` (optional) configurations defined a single schema or database to build a snapshot across users and environment. This created problems when testing or developing a snapshot, as there was no clear separation between development and production environments.  In v1.9, `target_schema` became optional, allowing snapshots to be environment-aware. By default, without `target_schema` or `target_database` defined, snapshots now use the `generate_schema_name` or `generate_database_name` macros to determine where to build. Developers can still set a custom location with [`schema`](/reference/resource-configs/schema) and [`database`](/reference/resource-configs/database)  configs, consistent with other resource types.
- A number of other configurations are also supported (for example, `tags` and `post-hook`). For the complete list, refer to [Snapshot configurations](/reference/snapshot-configs).
- You can configure snapshots from both the `dbt_project.yml` file and a `config` block. For more information, refer to the [configuration docs](/reference/snapshot-configs).


### Add a snapshot to your project

To add a snapshot to your project follow these steps. For users on versions 1.8 and earlier, refer to [Configure snapshots in versions 1.8 and earlier](#configure-snapshots-in-versions-18-and-earlier). 

1. Create a YAML file in your `snapshots` directory: `snapshots/orders_snapshot.yml` and add your configuration details. You can also configure your snapshot from your `dbt_project.yml` file ([docs](/reference/snapshot-configs)).

    <File name='snapshots/orders_snapshot.yml'>

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: source('jaffle_shop', 'orders')
        config:
          schema: snapshots
          database: analytics
          unique_key: id
          strategy: timestamp
          updated_at: updated_at

    ```
    </File>

2. Since snapshots focus on configuration, the transformation logic is minimal. Typically, you'd select all data from the source. If you need to apply transformations (like filters, deduplication), it's best practice to define an ephemeral model and reference it in your snapshot configuration.

    <File name="models/ephemeral_orders.sql" >

    ```yaml
    {{ config(materialized='ephemeral') }}

    select * from {{ source('jaffle_shop', 'orders') }}
    ```
    </File>

3. Check whether the result set of your query includes a reliable timestamp column that indicates when a record was last updated. For our example, the `updated_at` column reliably indicates record changes, so we can use the `timestamp` strategy. If your query result set does not have a reliable timestamp, you'll need to instead use the `check` strategy — more details on this below.

4. Run the `dbt snapshot` [command](/reference/commands/snapshot)  &mdash; for our example, a new table will be created at `analytics.snapshots.orders_snapshot`. The [`schema`](/reference/resource-configs/schema) config will utilize the `generate_schema_name` macro.

    ```
    $ dbt snapshot
    Running with dbt=1.9.0

    15:07:36 | Concurrency: 8 threads (target='dev')
    15:07:36 |
    15:07:36 | 1 of 1 START snapshot snapshots.orders_snapshot...... [RUN]
    15:07:36 | 1 of 1 OK snapshot snapshots.orders_snapshot..........[SELECT 3 in 1.82s]
    15:07:36 |
    15:07:36 | Finished running 1 snapshots in 0.68s.

    Completed successfully

    Done. PASS=2 ERROR=0 SKIP=0 TOTAL=1
    ```

5. Inspect the results by selecting from the table dbt created (`analytics.snapshots.orders_snapshot`). After the first run, you should see the results of your query, plus the [snapshot meta fields](#snapshot-meta-fields) as described later on.

6. Run the `dbt snapshot` command again and inspect the results. If any records have been updated, the snapshot should reflect this.

7. Select from the `snapshot` in downstream models using the `ref` function.

    <File name='models/changed_orders.sql'>

    ```sql
    select * from {{ ref('orders_snapshot') }}
    ```
    </File>

8.  Snapshots are only useful if you run them frequently &mdash; schedule the `dbt snapshot` command to run regularly.

</VersionBlock>

### Configuration best practices

<Expandable alt_header="Use the timestamp strategy where possible">

This strategy handles column additions and deletions better than the `check` strategy.

</Expandable>

<Expandable alt_header="Ensure your unique key is really unique">

The unique key is used by dbt to match rows up, so it's extremely important to make sure this key is actually unique! If you're snapshotting a source, I'd recommend adding a uniqueness test to your source ([example](https://github.com/dbt-labs/jaffle_shop/blob/8e7c853c858018180bef1756ec93e193d9958c5b/models/staging/schema.yml#L26)).
</Expandable>

<VersionBlock lastVersion="1.8">

<Expandable alt_header="Use a target_schema that is separate to your analytics schema">

Snapshots cannot be rebuilt. As such, it's a good idea to put snapshots in a separate schema so end users know they are special. From there, you may want to set different privileges on your snapshots compared to your models, and even run them as a different user (or role, depending on your warehouse) to make it very difficult to drop a snapshot unless you really want to.

</Expandable>
</VersionBlock>

<VersionBlock firstVersion="1.9">

<Expandable alt_header="Use a schema that is separate to your models' schema">

Snapshots can't be rebuilt. Because of this, it's a good idea to put snapshots in a separate schema so end users know they're special. From there, you may want to set different privileges on your snapshots compared to your models, and even run them as a different user (or role, depending on your warehouse) to make it very difficult to drop a snapshot unless you really want to.

</Expandable>

<Expandable alt_header="Use ephemeral model to clean or transform data before snapshotting">

 If you need to clean or transform your data before snapshotting, create an ephemeral model or a staging model that applies the necessary transformations. Then, reference this model in your snapshot configuration. This approach keeps your snapshot definitions clean and allows you to test and run transformations separately.

</Expandable>
</VersionBlock>

### How snapshots work

When you run the [`dbt snapshot` command](/reference/commands/snapshot):
* **On the first run:** dbt will create the initial snapshot table — this will be the result set of your `select` statement, with additional columns including `dbt_valid_from` and `dbt_valid_to`. All records will have a `dbt_valid_to = null`.
* **On subsequent runs:** dbt will check which records have changed or if any new records have been created:
  - The `dbt_valid_to` column will be updated for any existing records that have changed
  - The updated record and any new records will be inserted into the snapshot table. These records will now have `dbt_valid_to = null`

Note, these column names can be customized to your team or organizational conventions using the [snapshot_meta_column_names](#snapshot-meta-fields) config.

Snapshots can be referenced in downstream models the same way as referencing models — by using the [ref](/reference/dbt-jinja-functions/ref) function.

## Detecting row changes
Snapshot "strategies" define how dbt knows if a row has changed. There are two strategies built-in to dbt:
- [Timestamp](#timestamp-strategy-recommended) &mdash; Uses an `updated_at` column to determine if a row has changed.
- [Check](#check-strategy) &mdash; Compares a list of columns between their current and historical values to determine if a row has changed.

### Timestamp strategy (recommended)
The `timestamp` strategy uses an `updated_at` field to determine if a row has changed. If the configured `updated_at` column for a row is more recent than the last time the snapshot ran, then dbt will invalidate the old record and record the new one. If the timestamps are unchanged, then dbt will not take any action.

The `timestamp` strategy requires the following configurations:

| Config | Description | Example |
| ------ | ----------- | ------- |
| updated_at | A column which represents when the source row was last updated | `updated_at` |

**Example usage:**

<VersionBlock lastVersion="1.8">

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

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot_timestamp
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
```
</File>
</VersionBlock>

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

<VersionBlock lastVersion="1.8">

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

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - status
        - is_cancelled
```

</File>

</VersionBlock>

### Hard deletes (opt-in)

Rows that are deleted from the source query are not invalidated by default. With the config option `invalidate_hard_deletes`, dbt can track rows that no longer exist. This is done by left joining the snapshot table with the source table, and filtering the rows that are still valid at that point, but no longer can be found in the source table. `dbt_valid_to` will be set to the current snapshot time.

This configuration is not a different strategy as described above, but is an additional opt-in feature. It is not enabled by default since it alters the previous behavior.

For this configuration to work with the `timestamp` strategy, the configured `updated_at` column must be of timestamp type. Otherwise, queries will fail due to mixing data types.

**Example Usage**

<VersionBlock lastVersion="1.8">

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

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot_hard_delete
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      invalidate_hard_deletes: true
```

</File>

</VersionBlock>

## Snapshot meta-fields

Snapshot <Term id="table">tables</Term> will be created as a clone of your source dataset, plus some additional meta-fields*.

Starting in 1.9 or with [dbt Cloud Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless), these column names can be customized to your team or organizational conventions via the [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names) config.

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

Snapshot query results at `2024-01-01 11:00`

| id | status  | updated_at       |
| -- | ------- | ---------------- |
| 1        | pending | 2024-01-01 10:47 |

Snapshot results (note that `11:00` is not used anywhere):

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1        | pending | 2024-01-01 10:47 | 2024-01-01 10:47 |                  | 2024-01-01 10:47 |

Query results at `2024-01-01 11:30`:

| id | status  | updated_at       |
| -- | ------- | ---------------- |
| 1  | shipped | 2024-01-01 11:05 |

Snapshot results (note that `11:30` is not used anywhere):

| id | status  | updated_at       | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 1  | pending | 2024-01-01 10:47 | 2024-01-01 10:47 | 2024-01-01 11:05 | 2024-01-01 10:47 |
| 1  | shipped | 2024-01-01 11:05 | 2024-01-01 11:05 |                  | 2024-01-01 11:05 |

</details>

<br/>

For the `check` strategy, the current timestamp is used to populate each column. If configured, the `check` strategy uses the `updated_at` column instead, as with the timestamp strategy.

<details>
<summary>  Details for the check strategy </summary>

Snapshot query results at `2024-01-01 11:00`

| id | status  |
| -- | ------- |
| 1  | pending |

Snapshot results:

| id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| -- | ------- | ---------------- | ---------------- | ---------------- |
| 1  | pending | 2024-01-01 11:00 |                  | 2024-01-01 11:00 |

Query results at `2024-01-01 11:30`:

| id | status  |
| -- | ------- |
| 1  | shipped |

Snapshot results:

| id | status  | dbt_valid_from   | dbt_valid_to     | dbt_updated_at   |
| --- | ------- | ---------------- | ---------------- | ---------------- |
| 1   | pending | 2024-01-01 11:00 | 2024-01-01 11:30 | 2024-01-01 11:00 |
| 1   | shipped | 2024-01-01 11:30 |                  | 2024-01-01 11:30 |

</details>

## Configure snapshots in versions 1.8 and earlier

<VersionBlock firstVersion="1.9">

This section is for users on dbt versions 1.8 and earlier. To configure snapshots in versions 1.9 and later, refer to [Configuring snapshots](#configuring-snapshots). The latest versions use an updated snapshot configuration syntax that optimizes performance.

</VersionBlock>

<VersionBlock lastVersion="1.8">

- In dbt versions 1.8 and earlier, snapshots are `select` statements, defined within a snapshot block in a `.sql` file (typically in your `snapshots` directory). You'll also need to configure your snapshot to tell dbt how to detect record changes. 
- The earlier dbt versions use an older syntax that allows for defining multiple resources in a single file. This syntax can significantly slow down parsing and compilation.
- For faster and more efficient management, consider[ upgrading to Versionless](/docs/dbt-versions/versionless-cloud) or the [latest version of dbt Core](/docs/dbt-versions/core), which introduces an updated snapshot configuration syntax that optimizes performance.

The following example shows how to configure a snapshot:

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

The following table outlines the configurations available for snapshots in versions 1.8 and earlier:

| Config | Description | Required? | Example |
| ------ | ----------- | --------- | ------- |
| [target_database](/reference/resource-configs/target_database) | The database that dbt should render the snapshot table into | No | analytics |
| [target_schema](/reference/resource-configs/target_schema) | The schema that dbt should render the snapshot table into | Yes | snapshots |
| [strategy](/reference/resource-configs/strategy) | The snapshot strategy to use. One of `timestamp` or `check` | Yes | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | A <Term id="primary-key" /> column or expression for the record | Yes | id |
| [check_cols](/reference/resource-configs/check_cols) | If using the `check` strategy, then the columns to check | Only if using the `check` strategy | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | If using the `timestamp` strategy, the timestamp column to compare | Only if using the `timestamp` strategy | updated_at |
| [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) | Find hard deleted records in source, and set `dbt_valid_to` current time if no longer exists | No | True |

- A number of other configurations are also supported (e.g. `tags` and `post-hook`), check out the full list [here](/reference/snapshot-configs).
- Snapshots can be configured from both your `dbt_project.yml` file and a `config` block, check out the [configuration docs](/reference/snapshot-configs) for more information.
- Note: BigQuery users can use `target_project` and `target_dataset` as aliases for `target_database` and `target_schema`, respectively.

### Configuration example

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

<VersionBlock lastVersion="1.8">

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

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      schema='snapshots',
      unique_key='id',
      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

6. Run the `dbt snapshot` [command](/reference/commands/snapshot)  &mdash; for our example, a new table will be created at `analytics.snapshots.orders_snapshot`. The [`schema`](/reference/resource-configs/schema) config will utilize the `generate_schema_name` macro.

</VersionBlock>

```
$ dbt snapshot
Running with dbt=1.8.0

15:07:36 | Concurrency: 8 threads (target='dev')
15:07:36 |
15:07:36 | 1 of 1 START snapshot snapshots.orders_snapshot...... [RUN]
15:07:36 | 1 of 1 OK snapshot snapshots.orders_snapshot..........[SELECT 3 in 1.82s]
15:07:36 |
15:07:36 | Finished running 1 snapshots in 0.68s.

Completed successfully

Done. PASS=2 ERROR=0 SKIP=0 TOTAL=1
```

7. Inspect the results by selecting from the table dbt created. After the first run, you should see the results of your query, plus the [snapshot meta fields](#snapshot-meta-fields) as described earlier.

8. Run the `dbt snapshot` command again, and inspect the results. If any records have been updated, the snapshot should reflect this.

9. Select from the `snapshot` in downstream models using the `ref` function.

<File name='models/changed_orders.sql'>

```sql
select * from {{ ref('orders_snapshot') }}
```

</File>

10. Snapshots are only useful if you run them frequently &mdash; schedule the `snapshot` command to run regularly.


</VersionBlock>

## FAQs
<FAQ path="Runs/run-one-snapshot" />
<FAQ path="Runs/snapshot-frequency" />
<FAQ path="Snapshots/snapshot-schema-changes" />
<FAQ path="Snapshots/snapshot-hooks" />
<FAQ path="Accounts/configurable-snapshot-path" />
<FAQ path="Snapshots/snapshot-target-is-not-a-snapshot-table" />
