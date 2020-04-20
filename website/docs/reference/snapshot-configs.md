---
title: Snapshot configurations
---

## Available configurations
### Snapshot-specific configurations
* [target_database](resource-configs/target_database.md): string
* [target_schema](resource-configs/target_schema.md): string (required)
* [unique_key](resource-configs/unique_key.md): column_name (required)
* [strategy](resource-configs/strategy.md): timestamp | check (required)
* [updated_at](resource-configs/updated_at.md): column_name_or_expression (required if strategy == timestamp)
* [check_cols](resource-configs/check_cols.md): [column_name] | all (required if strategy == check)


### General configurations
* [enabled](resource-configs/enabled.md): true | false
* [tags](resource-configs/tags.md): string | [string]
* [pre-hook](resource-configs/pre-hook.md): sql-statement | [sql-statement]
* [post-hook](resource-configs/post-hook.md): sql-statement | [sql-statement]


## Configuring snapshots
Snapshots can be configured:
* Using a `config` block within a snapshot, OR
* From the `dbt_project.yml` file, under the `snapshots:` key. To apply a configuration to a seed, or directory of seeds, define the resource path as nested dictionary keys.

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


#### Apply the `schema` configuration to all seeds in your project
To apply a configuration to all seeds in your project only (i.e. _excluding_ any seeds in installed packages), provide your project name as part of the resource path.

For a project named `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

seeds:
  jaffle_shop:
    schema: seed_data
```

</File>

Similarly, you can use the name of an installed package to configure seeds in that package.

#### Apply the `schema` configuration to one snapshot only

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
