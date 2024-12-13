---
title: Snapshot configurations
description: "Read this guide to learn about using snapshot configurations in dbt."
meta:
  resource_type: Snapshots
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

## Related documentation
* [Snapshots](/docs/build/snapshots)
* The `dbt snapshot` [command](/reference/commands/snapshot)


## Available configurations
### Snapshot-specific configurations

<ConfigResource meta={frontMatter.meta} />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'YAML file', value: 'property-yaml', },
    { label: 'Config block', value: 'config-resource', },
  ]
}>

<TabItem value="project-yaml">

<VersionBlock lastVersion="1.8">

<File name='dbt_project.yml'>

```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[target_schema](/reference/resource-configs/target_schema): <string>
    [+](/reference/resource-configs/plus-prefix)[target_database](/reference/resource-configs/target_database): <string>
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
    [+](/reference/resource-configs/plus-prefix)[strategy](/reference/resource-configs/strategy): timestamp | check
    [+](/reference/resource-configs/plus-prefix)[updated_at](/reference/resource-configs/updated_at): <column_name>
    [+](/reference/resource-configs/plus-prefix)[check_cols](/reference/resource-configs/check_cols): [<column_name>] | all
    [+](/reference/resource-configs/plus-prefix)[invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) : true | false
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='dbt_project.yml'>

```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-configs/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
    [+](/reference/resource-configs/plus-prefix)[strategy](/reference/resource-configs/strategy): timestamp | check
    [+](/reference/resource-configs/plus-prefix)[updated_at](/reference/resource-configs/updated_at): <column_name>
    [+](/reference/resource-configs/plus-prefix)[check_cols](/reference/resource-configs/check_cols): [<column_name>] | all
    [+](/reference/resource-configs/plus-prefix)[snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current): <string> 
    [+](/reference/resource-configs/plus-prefix)[hard_deletes](/reference/resource-configs/hard-deletes): string
```

</File>

</VersionBlock>

</TabItem>

<TabItem value="property-yaml">

<VersionBlock lastVersion="1.8">

**Note:** Required snapshot properties _will not_ work when only defined in `config` YAML blocks. We recommend that you define these in `dbt_project.yml` or a `config()` block within the snapshot `.sql` file or upgrade to v1.9.

</VersionBlock>

<VersionBlock firstVersion="1.9">
  
Refer to [configuring snapshots](/docs/build/snapshots#configuring-snapshots) for the available configurations.

<File name='snapshots/schema.yml'>

```yml
snapshots:
  - name: <string>
    config:
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-configs/schema): <string>
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
      [strategy](/reference/resource-configs/strategy): timestamp | check
      [updated_at](/reference/resource-configs/updated_at): <column_name>
      [check_cols](/reference/resource-configs/check_cols): [<column_name>] | all
      [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names): {<dictionary>}
      [hard_deletes](/reference/resource-configs/hard-deletes): string
      [dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current): <string>
```
</File>

</VersionBlock>

</TabItem>

<TabItem value="config-resource">

import LegacySnapshotConfig from '/snippets/_legacy-snapshot-config.md';

<LegacySnapshotConfig />

<VersionBlock lastVersion="1.8">

```jinja

{{ config(
    [target_schema](/reference/resource-configs/target_schema)="<string>",
    [target_database](/reference/resource-configs/target_database)="<string>",
    [unique_key](/reference/resource-configs/unique_key)="<column_name_or_expression>",
    [strategy](/reference/resource-configs/strategy)="timestamp" | "check",
    [updated_at](/reference/resource-configs/updated_at)="<column_name>",
    [check_cols](/reference/resource-configs/check_cols)=["<column_name>"] | "all"
    [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) : true | false
) }}

```
</VersionBlock>

</TabItem>

</Tabs>

### Snapshot configuration migration

The latest snapshot configurations introduced in dbt Core v1.9 (such as [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names), [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current), and `hard_deletes`) are best suited for new snapshots. For existing snapshots, we recommend the following to avoid any inconsistencies in your snapshots:

#### For existing snapshots
- Migrate tables &mdash; Migrate the previous snapshot to the new table schema and values:
  - Create a backup copy of your snapshots.
  - Use `alter` statements as needed (or a script to apply `alter` statements) to ensure table consistency.
- New configurations &mdash; Convert the configs one at a time, testing as you go. 

:::warning
If you use one of the latest configs, such as `dbt_valid_to_current`, without migrating your data, you may have mixed old and new data, leading to an incorrect downstream result.
:::

### General configurations

<ConfigGeneral />


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'YAML file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">


```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): {<dict>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dict>}
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field
```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): {<dict>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dict>}
```
</VersionBlock>
</File>

</TabItem>

<TabItem value="property-yaml">

<VersionBlock lastVersion="1.8">

<File name='snapshots/properties.yml'>

```yaml
version: 2

snapshots:
  - name: [<snapshot-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [alias](/reference/resource-configs/alias): <string>
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [persist_docs](/reference/resource-configs/persist_docs): {<dict>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/properties.yml'>

```yaml
version: 2

snapshots:
  - name: [<snapshot-name>]
    relation: source('my_source', 'my_table')
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [alias](/reference/resource-configs/alias): <string>
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [persist_docs](/reference/resource-configs/persist_docs): {<dict>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
      [event_time](/reference/resource-configs/event-time): my_time_field
```

</File>
</VersionBlock>

</TabItem>

<TabItem value="config">

<LegacySnapshotConfig />

<VersionBlock lastVersion="1.8">

```jinja

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

</VersionBlock>

</TabItem>

</Tabs>

## Configuring snapshots
Snapshots can be configured in multiple ways:

<VersionBlock firstVersion="1.9">

1. Defined in YAML files using a `config` [resource property](/reference/model-properties), typically in your [snapshots directory](/reference/project-configs/snapshot-paths) (available in [the dbt Cloud release track](/docs/dbt-versions/cloud-release-tracks) and dbt v1.9 and higher).
2. From the `dbt_project.yml` file, under the `snapshots:` key. To apply a configuration to a snapshot, or directory of snapshots, define the resource path as nested dictionary keys.
</VersionBlock>

<VersionBlock lastVersion="1.8">

1. Defined in a YAML file using a `config` [resource property](/reference/model-properties), typically in your [snapshots directory](/reference/project-configs/snapshot-paths) (available in  [the dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) and dbt v1.9 and higher). The latest snapshot YAML syntax provides faster and more efficient management.
2. Using a `config` block within a snapshot defined in Jinja SQL.
3. From the `dbt_project.yml` file, under the `snapshots:` key. To apply a configuration to a snapshot, or directory of snapshots, define the resource path as nested dictionary keys.

</VersionBlock>

Snapshot configurations are applied hierarchically in the order above with higher taking precedence.

### Examples

<VersionBlock firstVersion="1.9">
The following examples demonstrate how to configure snapshots using the `dbt_project.yml` file and a `.yml` file.
</VersionBlock>

<VersionBlock lastVersion="1.8">
The following examples demonstrate how to configure snapshots using the `dbt_project.yml` file, a `config` block within a snapshot (legacy method), and a `.yml` file.
</VersionBlock>

- #### Apply configurations to all snapshots
  To apply a configuration to all snapshots, including those in any installed [packages](/docs/build/packages), nest the configuration directly under the `snapshots` key:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      +unique_key: id
    ```

    </File>

- #### Apply configurations to all snapshots in your project
  To apply a configuration to all snapshots in your project only (for example, _excluding_ any snapshots in installed packages), provide your project name as part of the resource path.

  For a project named `jaffle_shop`:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      jaffle_shop:
        +unique_key: id
    ```

    </File>

  Similarly, you can use the name of an installed package to configure snapshots in that package.

- #### Apply configurations to one snapshot only
  
  <VersionBlock lastVersion="1.8">
  Use `config` blocks if you need to apply a configuration to one snapshot only. 

    <File name='snapshots/postgres_app/orders_snapshot.sql'>

    ```sql
    {% snapshot orders_snapshot %}
        {{
            config(
              unique_key='id',
              target_schema='snapshots',
              strategy='timestamp',
              updated_at='updated_at'
            )
        }}
        -- Pro-Tip: Use sources in snapshots!
        select * from {{ source('jaffle_shop', 'orders') }}
    {% endsnapshot %}
    ```

    </File>
    </VersionBlock>

    <VersionBlock firstVersion="1.9">
     <File name='snapshots/postgres_app/order_snapshot.yml'>

    ```yaml
    snapshots:
     - name: orders_snapshot
       relation: source('jaffle_shop', 'orders')
       config:
         unique_key: id
         strategy: timestamp
         updated_at: updated_at
         persist_docs:
           relation: true
           columns: true
    ```
    </File>
   Pro-tip: Use sources in snapshots: `select * from {{ source('jaffle_shop', 'orders') }}`
    </VersionBlock>

  You can also use the full resource path (including the project name, and subdirectories) to configure an individual snapshot from your `dbt_project.yml` file.

  For a project named `jaffle_shop`, with a snapshot file within the `snapshots/postgres_app/` directory, where the snapshot is named `orders_snapshot` (as above), this would look like:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      jaffle_shop:
        postgres_app:
          orders_snapshot:
            +unique_key: id
            +strategy: timestamp
            +updated_at: updated_at
    ```

    </File>

  You can also define some common configs in a snapshot's `config` block. However, we don't recommend this for a snapshot's required configuration.

    <File name='dbt_project.yml'>

    ```yml
    version: 2

    snapshots:
      - name: orders_snapshot
        +persist_docs:
          relation: true
          columns: true
    ```

    </File>
