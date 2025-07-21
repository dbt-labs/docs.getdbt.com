---
title: Snapshot configurations
description: "Read this guide to learn about using snapshot configurations in dbt."
meta:
  resource_type: Snapshots
intro_text: "Learn about using snapshot configurations in dbt, including snapshot-specific configurations and general configurations."
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';
import CourseCallout from '/snippets/_materialization-video-callout.md';


## Related documentation
* [Snapshots](/docs/build/snapshots)
* The `dbt snapshot` [command](/reference/commands/snapshot)


<CourseCallout resource="Snapshots" 
url="https://learn.getdbt.com/courses/snapshots"
course="Snapshots"
/>

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

<VersionBlock firstVersion="1.9">
  
Refer to [configuring snapshots](/docs/build/snapshots#configuring-snapshots) for the available configurations.

<File name='snapshots/schema.yml'>

```yml
snapshots:
  - name: <string>
    relation: ref() | source()
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

</TabItem>

</Tabs>

### Snapshot configuration migration

The latest snapshot configurations introduced in dbt Core v1.9 (such as [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names), [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current), and `hard_deletes`) are best suited for new snapshots, but you can also adopt them in existing snapshots by migrating your table schema and configs carefully to avoid any inconsistencies in your snapshots. 

Here's how you can do it:

1. In your data platform, create a backup snapshot table. You can copy it to a new table:

    ```sql
    create table my_snapshot_table_backup as
    select * from my_snapshot_table;
    ```

    This allows you to restore your snapshot if anything goes wrong during migration.

2. If you want to use the new configs, add required columns to your existing snapshot table using `alter` statements as needed. Here's an example of what to add if you're going to use `dbt_valid_to_current` and `snapshot_meta_column_names`:

    ```sql
    alter table my_snapshot_table
    add column dbt_valid_to_current string,
    add column dbt_valid_from timestamp,
    add column dbt_valid_to timestamp;
    ```

3. Then update your snapshot config:

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: source('something','orders')
        config:
          strategy: timestamp
          updated_at: updated_at
          unique_key: id
          dbt_valid_to_current: "to_date('9999-12-31')"
          snapshot_meta_column_names:
            dbt_valid_from: start_date
            dbt_valid_to: end_date
    ```

4. Test each change before adopting multiple new configs by running `dbt snapshot` in development or staging. 
5. Confirm if the snapshot run completes without errors, the new columns are created, and historical logic behaves as you’d expect. The table should look like this:

    | `id`|`start_date` | `end_date` | `updated_at` |
    | --- | --- | --- | --- | 
    | 1 | 2024-10-01 09:00:00 | 2024-10-03 08:00:00 | 2024-10-01 09:00:00 |
    | 2 | 2024-10-03 08:00:00 | 9999-12-31 00:00:00 | 2024-10-03 08:00:00 |
    | 3 | 2024-10-02 11:15:00 | 9999-12-31 00:00:00 | 2024-10-02 11:15:00 |

  Note: The `end_date` column (defined by `snapshot_meta_column_names`) uses the configured value from `dbt_valid_to_current` (9999-12-31) for newly inserted records, instead of the default `NULL`. Existing records will have `NULL` for `end_date`.

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

</File>

</TabItem>

<TabItem value="property-yaml">

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

</TabItem>

</Tabs>

## Configuring snapshots
Snapshots can be configured in multiple ways:

<VersionBlock firstVersion="1.9">

1. Defined in YAML files using the `config` [resource property](/reference/model-properties), typically in your [snapshots directory](/reference/project-configs/snapshot-paths) or whichever folder you pefer. Available in [the <Constant name="cloud" /> release track](/docs/dbt-versions/cloud-release-tracks), dbt v1.9 and higher.
2. From the `dbt_project.yml` file, under the `snapshots:` key. To apply a configuration to a snapshot, or directory of snapshots, define the resource path as nested dictionary keys.
</VersionBlock>

Snapshot configurations are applied hierarchically in the order above with higher taking precedence. You can also apply [tests](/reference/snapshot-properties) to snapshots using the [`tests` property](/reference/resource-properties/data-tests).

### Examples

<VersionBlock firstVersion="1.9">
The following examples demonstrate how to configure snapshots using the `dbt_project.yml` file and a `.yml` file.
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
