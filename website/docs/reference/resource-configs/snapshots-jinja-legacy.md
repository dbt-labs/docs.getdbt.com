---
title: Legacy snapshot configurations
description: Read about how to configure snapshots using legacy Jinja blocks
sidebar: "Legacy configuration"
---

# Legacy snapshot configuration <Lifecycle status='legacy' />

<IntroText>

Use legacy SQL-based snapshot configurations with Jinja blocks in any dbt version. dbt v1.9 introduced YAML-based configs for better readability and environment awareness.

</IntroText>

There are situations where you want to use the legacy syntax for [snapshots](/docs/build/snapshots) in any dbt version or release track. This page details how you can use the legacy SQL-based configurations if you need to. 

In dbt v1.9, this syntax was replaced with a [YAML-based configuration](/reference/snapshot-configs#configuring-snapshots) in [<Constant name="cloud" />'s "Latest" release track](/docs/dbt-versions/cloud-release-tracks). The benefits of YAML-based configurations are that the snapshots are environment aware, meaning you don't have to specify `schema` or `database`, and the syntax is more concise.

For new snapshots, we recommend using these latest YAML-based configs. If you'd like to move to the YAML-based configuration for existing snapshots, you can [migrate over](/reference/snapshot-configs#snapshot-configuration-migration).

When would you want to use the SQL-based syntax and YAML-based syntax?

- SQL-based syntax:
  - Defined in `.sql` files within a snapshot Jinja block, typically located in your `snapshots` directory. Available in all versions.
  - Useful for existing snapshots already using this syntax.
  - Suitable for performing very light transformations (but creating a separate ephemeral model for transformations is recommended for better maintainability).

- YAML-based syntax:
  - Defined in `whatever_name.yml` or in the `snapshots` or `models` directory you prefer. Available in <Constant name="cloud" />'s "Latest" release track and dbt v1.9 and later.
  - Ideal for new snapshots or existing snapshots that need to be [migrated](/reference/snapshot-configs#snapshot-configuration-migration).
  - Create transformations separate from the snapshot file by creating an ephemeral model and referencing it in the snapshot using the `relation` field.

## Snapshot configurations

Although you can use the more performant YAML-based configuration, you might still want to use the legacy configuration to define your snapshots if it suits your needs.

Snapshots can be configured in two main ways: 
- Using [snapshot-specific configurations](#snapshot-specific-configurations)
- Or using [general configurations](#general-configuration) 

These configurations allow you to control how dbt detects changes in your data and where snapshots are stored. Both types of configurations can coexist in your project in the same `config` block (or from your `dbt_project.yml` file or `properties.yaml` file). 

One of the most important configs you can decide is [strategies](#snapshot-strategies), which tells dbt how to detect modified rows.

### Snapshot specific configurations
Snapshot-specific configurations are applicable to only one dbt resource type rather than multiple resource types. You can define these settings within the resource’s file using the `{{ config() }}` macro (as well as in the project file (`dbt_project.yml`) or a property file (`models/properties.yml` for models, similarly for other resources)).

<File name='snapshots/orders_snapshot.sql'>

```sql
{ % snapshot orders_snapshot %}

{{ config(
    [target_schema](/reference/resource-configs/target_schema)="<string>",
    [target_database](/reference/resource-configs/target_database)="<string>",
    [unique_key](/reference/resource-configs/unique_key)="<column_name_or_expression>",
    [strategy](/reference/resource-configs/strategy)="timestamp" | "check",
    [updated_at](/reference/resource-configs/updated_at)="<column_name>",
    [check_cols](/reference/resource-configs/check_cols)=["<column_name>"] | "all"
    [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) : true | false
) 
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

### General configuration
Use general configurations for broader operational settings applicable across multiple resource types. Like resource-specific configurations, these can also be set in the project file, property files, or within resource-specific files using a config block.

<File name='snapshots/snapshot.sql'>

```sql
{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"],
    [alias](/reference/resource-configs/alias)="<string>", 
    [pre_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"]
    [persist_docs](/reference/resource-configs/persist_docs)={<dict>}
    [grants](/reference/resource-configs/grants)={<dict>}
) }}
```
</File>

### Snapshot strategies
Snapshot "strategies" define how dbt knows if a row has changed. There are two strategies built-in to dbt that require the `strategy` parameter:

- [Timestamp](/reference/resource-configs/snapshots-jinja-legacy?strategy=timestamp#snapshot-strategies) &mdash; Uses an `updated_at` column to determine if a row has changed.
- [Check](/reference/resource-configs/snapshots-jinja-legacy?strategy=check#snapshot-strategies) &mdash; Compares a list of columns between their current and historical values to determine if a row has changed. Uses the `check_cols` parameter.

<Tabs queryString="strategy">
<TabItem value="timestamp" label="Timestamp" id="timestamp">

The timestamp strategy uses an `updated_at` field to determine if a row has changed. If the configured `updated_at` column for a row is more recent than the last time the snapshot ran, then dbt will invalidate the old record and record the new one. If the timestamps are unchanged, then dbt will not take any action.

#### Example

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
</TabItem>

<TabItem value="check" label="Check" id="check">

The check strategy is useful for tables which do not have a reliable `updated_at` column. It requires the `check_cols` parameter, which is a list of columns within the results of your snapshot query to check for changes. Alternatively, use all columns using the all value (however this may be less performant).

#### Example

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

#### Examples
<Expandable alt_header="Check a list of columns for changes">

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</Expandable>

<Expandable alt_header="Check all columns for changes">

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols='all',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</Expandable>
</TabItem>
</Tabs>

## Configuration reference

Configure your snapshot to tell dbt how to detect record changes. Snapshots are `select` statements, defined within a snapshot block in a `.sql` file (typically in your `snapshots` directory or any other directory).

The following table outlines the configurations available for snapshots:

<VersionBlock firstVersion="1.9">

| Config | Description | Required? | Example |
| ------ | ----------- | --------- | ------- |
| [database](/reference/resource-configs/database) |Specify a custom database for the snapshot | No | analytics |
| [schema](/reference/resource-configs/schema) | Specify a custom schema for the snapshot | No | snapshots |
| [strategy](/reference/resource-configs/strategy) | The snapshot strategy to use. One of `timestamp` or `check` | Yes | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | A <Term id="primary-key" /> column or expression for the record | Yes | id |
| [check_cols](/reference/resource-configs/check_cols) | If using the `check` strategy, then the columns to check | Only if using the `check` strategy | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | If using the `timestamp` strategy, the timestamp column to compare | Only if using the `timestamp` strategy | updated_at |
| [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) | Find hard deleted records in source, and set `dbt_valid_to` current time if no longer exists | No | True |

- A number of other configurations are also supported (like, `tags` and `post-hook`), check out the full list [here](/reference/snapshot-configs).
- Snapshots can be configured from both your `dbt_project.yml` file and a `config` block, check out the [configuration docs](/reference/snapshot-configs) for more information.
- Note: BigQuery users can use `target_project` and `target_dataset` as aliases for `target_database` and `target_schema`, respectively.
- Before v1.9, `target_schema` (required) and `target_database` (optional) set a fixed schema or database for snapshots, making it hard to separate dev and prod environments. In v1.9, `target_schema` became optional, allowing environment-aware snapshots. By default, snapshots now use `generate_schema_name` or `generate_database_name`, but developers can still specify a custom location using [schema](/reference/resource-configs/schema) and [database](/reference/resource-configs/database), consistent with other resource types.


</VersionBlock>

## Add snapshot to a project

To add a snapshot to your project:

1. Create a file in your `snapshots` directory with a `.sql` file extension. For example,`snapshots/orders.sql`
2. Use a `snapshot` block to define the start and end of a snapshot:

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{% endsnapshot %}
```

</File>

3. Write a `select` statement within the snapshot block (tips for writing a good snapshot query are below). This select statement defines the results that you want to snapshot over time. You can use `sources` or `refs` here.

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

4. Check whether the result set of your query includes a reliable timestamp column that indicates when a record was last updated. For our example, the `updated_at` column reliably indicates record changes, so we can use the `timestamp` strategy. If your query result set does not have a reliable timestamp, you'll need to instead use the `check` strategy — more details on this in the next step.

5. Add configurations to your snapshot using a `config` block. You can also [configure your snapshot from your `dbt_project.yml` file](/reference/snapshot-configs).

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      database='analytics',
      schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at',
    )
The following table outlines the configurations available for snapshots:

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>
</VersionBlock>


6. Run the `dbt snapshot` [command](/reference/commands/snapshot). For our example, a new table will be created at `analytics.snapshots.orders_snapshot`. You can change the `target_database` configuration, the `target_schema` configuration and the name of the snapshot (as defined in `{% snapshot .. %}`) will change how dbt names this table.

```dbt snapshot
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

1. Inspect the results by selecting from the table dbt created. After the first run, you should see the results of your query, plus the [snapshot meta fields](/docs/build/snapshots#snapshot-meta-fields) as described earlier.

2. Run the `dbt snapshot` command again, and inspect the results. If any records have been updated, the snapshot should reflect this.

3. Select from the `snapshot` in downstream models using the `ref` function.

<File name='models/changed_orders.sql'>

```sql
select * from {{ ref('orders_snapshot') }}
```

</File>

10. Snapshots are only useful if you run them frequently &mdash; schedule the `snapshot` command to run regularly.


## Examples

This section outlines some examples of how to apply configurations to snapshots using the legacy method.

<Expandable alt_header="Apply configurations to one snapshot only">

Use config blocks if you need to apply a configuration to one snapshot only.

<File name='snapshots/postgres_app/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}
    {{
        config(
          unique_key='id',
          strategy='timestamp',
          updated_at='updated_at'
        )
    }}
    -- Pro-Tip: Use sources in snapshots!
    select * from {{ source('jaffle_shop', 'orders') }}
{% endsnapshot %}
```
</File>
</Expandable>

<Expandable alt_header="Using the updated_at parameter">

The `updated_at` parameter is required if using the timestamp strategy. The `updated_at` parameter is a column within the results of your snapshot query that represents when the record row was last updated.

<File name='snapshots/orders.sql'>

```sql
{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}
```
</File>

#### Examples

- #### Using a column name `updated_at`:

  <VersionBlock firstVersion="1.9">
  <File name='snapshots/orders.sql'>

  ```sql
  {% snapshot orders_snapshot %}

  {{
      config(
        schema='snapshots',
        unique_key='id',

        strategy='timestamp',
        updated_at='updated_at'
      )
  }}

  select * from {{ source('jaffle_shop', 'orders') }}

  {% endsnapshot %}
  ```
  </File>
  </VersionBlock>

- #### Coalescing two columns to create a reliable `updated_at` column:
  
  Consider a data source that only has an `updated_at` column filled in when a record is updated (so a `null` value indicates that the record hasn't been updated after it was created).
  
  Since the `updated_at` configuration only takes a column name, rather than an expression, you should update your snapshot query to include the coalesced column.

  <VersionBlock firstVersion="1.9">
  <File name='snapshots/orders.sql'>

  ```sql
  {% snapshot orders_snapshot %}

  {{
      config(
        schema='snapshots',
        unique_key='id',

        strategy='timestamp',
        updated_at='updated_at_for_snapshot'
      )
  }}

  select
      *,
      coalesce(updated_at, created_at) as updated_at_for_snapshot

  from {{ source('jaffle_shop', 'orders') }}

  {% endsnapshot %}
  ```
  </File>
  </VersionBlock>


</Expandable>

<Expandable alt_header="Using the unique_key parameter">

The `unique_key` is a column name or expression that is unique for the inputs of a snapshot. dbt uses [`unique_key`](/reference/resource-configs/unique_key) to match records between a result set and an existing snapshot, so that changes can be captured correctly.

<File name='snapshots/orders.sql'>

```sql
{{ config(
  unique_key="column_name"
) }}
```
</File>

#### Examples

- Using an `id` column as a unique key

  <File name='snapshots/orders.sql'>

  ```sql
  {{
      config(
        unique_key="id"
      )
  }}
  ```
  </File>

  You can also write this in YAML. This might be a good idea if multiple snapshots share the same `unique_key` (though we prefer to apply this configuration in a config block, as above).

- #### Using a combination of two columns as a unique key

  This configuration accepts a valid column expression. As such, you can concatenate two columns together as a unique key if required. It's a good idea to use a separator (like, '-') to ensure uniqueness.

  <File name='snapshots/transaction_items_snapshot.sql'>

  ```sql
  {% snapshot transaction_items_snapshot %}

      {{
          config(
            unique_key="transaction_id||'-'||line_item_id",
            ...
          )
      }}

  select
      transaction_id||'-'||line_item_id as id,
      *
  from {{ source('erp', 'transactions') }}

  {% endsnapshot %}
  ```

  </File>

  Though, it's probably a better idea to construct this column in your query and use that as the `unique_key`:

    <File name='snapshots/transaction_items_snapshot.sql'>

    ```sql
    {% snapshot transaction_items_snapshot %}

        {{
            config(
              unique_key="id",
              ...
            )
        }}

    select
        transaction_id || '-' || line_item_id as id,
        *
    from {{ source('erp', 'transactions') }}

    {% endsnapshot %}
    ```
    </File>
</Expandable>
