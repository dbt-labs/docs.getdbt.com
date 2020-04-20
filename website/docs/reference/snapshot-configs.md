---
title: Snapshot configurations
---
## Related documentation
* [Snapshots](docs/building-a-dbt-project/snapshots.md)
* The `dbt snapshot` [command](docs/running-a-dbt-project/command-line-interface/snapshot.md)

## Available configurations
### Snapshot-specific configurations
* [target_schema](target_schema): string (required)
* [target_database](target_database): string
* [unique_key](unique_key): column_name (required)
* [strategy](strategy): timestamp | check (required)
* [updated_at](updated_at): column_name_or_expression (required if strategy == timestamp)
* [check_cols](check_cols): [column_name] | all (required if strategy == check)


### General configurations
* [enabled](enabled): true | false
* [tags](tags): string | [string]
* [pre-hook](pre-hook): sql-statement | [sql-statement]
* [post-hook](post-hook): sql-statement | [sql-statement]


## Configuring snapshots
Snapshots can be configured in one of two ways:

1. Using a `config` block within a snapshot, or
2. From the `dbt_project.yml` file, under the `snapshots:` key. To apply a configuration to a snapshot, or directory of snapshots, define the resource path as nested dictionary keys.

Snapshot configurations, like model configurations, are applied hierarchically — configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project.

### Examples
#### Apply the `target_schema` configuration to all snapshots
To apply a configuration to all snapshots, including those in any installed [packages](package-management), nest the configuration directly under the `snapshots` key:

<File name='dbt_project.yml'>

```yml

snapshots:
  target_schema: snapshots
```

</File>


#### Apply the `target_schema` configuration to all snapshots in your project
To apply a configuration to all snapshots in your project only (i.e. _excluding_ any snapshots in installed packages), provide your project name as part of the resource path.

For a project named `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

snapshots:
  jaffle_shop:
    target_schema: snapshot_data
```

</File>

Similarly, you can use the name of an installed package to configure snapshots in that package.

#### Apply configurations to one snapshot only

We recommend using `config` blocks if you need to apply a configuration to one snapshot only.

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

You can also use the full resource path (including the project name, and subdirectories) to configure an individual snapshot from your `dbt_project.yml` file.

For a project named `jaffle_shop`, with a snapshot file within the `snapshots/postgres_app/` directory, where the snapshot is named `orders_snapshot` (as above), this would look like:

<File name='dbt_project.yml'>

```yml
snapshots:
  jaffle_shop:
    postgres_app:
      orders_snapshot:
        unique_key: id
        strategy: timestamp
        updated_at: updated_at
```

</File>
