---
title: "Dynamic tables"
sidebar_label: "Dynamic tables"
description: "Configure the Snowflake dynamic table materialization in dbt, including target lag, refresh mode, and on_configuration_change options."
---

The Snowflake adapter supports [dynamic tables](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
This materialization is specific to Snowflake, which means that any model configuration that
would normally come along for the ride from `dbt-core` (e.g. as with a `view`) may not be available
for dynamic tables. This gap will decrease in future patches and versions.
While this materialization is specific to Snowflake, it very much follows the implementation
of [materialized views](/docs/build/materializations#Materialized-View).
In particular, dynamic tables have access to the `on_configuration_change` setting.
Dynamic tables are supported with the following configuration parameters:

<VersionBlock lastVersion="1.10">

| Parameter          | Type       | Required | Default     | Change Monitoring Support |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_mode`](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize): ON_CREATE | ON_SCHEDULE 

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag): downstream | <time-delta>
      [snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize): ON_CREATE | ON_SCHEDULE 
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize)="ON_CREATE" | "ON_SCHEDULE", 

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock lastVersion="1.11">

| Parameter          | Type       | Required | Default     | Change Monitoring Support |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_warehouse`](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse)   | `<string>` | no       | `None`      | alter  |
| [`refresh_mode`](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |
| [`cluster_by`](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering)     | `<string>` or `<list>` | no       | `None` | alter   |
| [`immutable_where`](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where)     | `<string>` | no       | `None` | alter   |
| [`copy_grants`](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables)     | `<boolean>` | no       | `false` | full refresh   |


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize): ON_CREATE | ON_SCHEDULE 
    [+](/reference/resource-configs/plus-prefix)[cluster_by](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[immutable_where](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where): <condition>
    [+](/reference/resource-configs/plus-prefix)[copy_grants](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag): downstream | <time-delta>
      [snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses): <warehouse-name>
      [refresh_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse): <warehouse-name>
      [refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode): AUTO | FULL | INCREMENTAL
      [initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize): ON_CREATE | ON_SCHEDULE 
      [cluster_by](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
      [immutable_where](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where): <condition>
      [copy_grants](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse)="<warehouse-name>",
    [refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize)="ON_CREATE" | "ON_SCHEDULE", 
    [cluster_by](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [immutable_where](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where)="<condition>",
    [copy_grants](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables)=true | false,

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Parameter          | Type       | Required | Default     | Change Monitoring Support |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag)      | `<string>` | no      |        | alter          |
| [`scheduler`](/reference/resource-configs/snowflake-configs/dynamic-tables#scheduler)       | `<string>` | no       | `DISABLE`   | alter          |
| [`snowflake_warehouse`](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`snowflake_initialization_warehouse`](/reference/resource-configs/snowflake-configs/dynamic-tables#initialization-warehouse)   | `<string>` | no       | `None`      | alter  |
| [`refresh_warehouse`](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse)   | `<string>` | no       | `None`      | alter  |
| [`refresh_mode`](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |
| [`cluster_by`](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering)     | `<string>` or `<list>` | no       | `None` | alter   |
| [`immutable_where`](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where)     | `<string>` | no       | `None` | alter   |
| [`copy_grants`](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables)     | `<boolean>` | no       | `false` | full refresh   |
| [`transient`](/reference/resource-configs/snowflake-configs/dynamic-tables#transient-dynamic-tables)     | `<boolean>` | no       | `false` | full refresh   |


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[scheduler](/reference/resource-configs/snowflake-configs/dynamic-tables#scheduler): ENABLE | DISABLE
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[snowflake_initialization_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#initialization-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize): ON_CREATE | ON_SCHEDULE 
    [+](/reference/resource-configs/plus-prefix)[cluster_by](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[immutable_where](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where): <condition>
    [+](/reference/resource-configs/plus-prefix)[copy_grants](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables): true | false
    [+](/reference/resource-configs/plus-prefix)[transient](/reference/resource-configs/snowflake-configs/dynamic-tables#transient-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag): downstream | <time-delta>
      [scheduler](/reference/resource-configs/snowflake-configs/dynamic-tables#scheduler): ENABLE | DISABLE
      [snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses): <warehouse-name>
      [snowflake_initialization_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#initialization-warehouse): <warehouse-name>
      [refresh_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse): <warehouse-name>
      [refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode): AUTO | FULL | INCREMENTAL
      [initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize): ON_CREATE | ON_SCHEDULE 
      [cluster_by](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
      [immutable_where](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where): <condition>
      [copy_grants](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables): true | false
      [transient](/reference/resource-configs/snowflake-configs/dynamic-tables#transient-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](/reference/resource-configs/snowflake-configs/dynamic-tables#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [scheduler](/reference/resource-configs/snowflake-configs/dynamic-tables#scheduler)="ENABLE" | "DISABLE",
    [snowflake_warehouse](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses)="<warehouse-name>",
    [snowflake_initialization_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#initialization-warehouse)="<warehouse-name>",
    [refresh_warehouse](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-warehouse)="<warehouse-name>",
    [refresh_mode](/reference/resource-configs/snowflake-configs/dynamic-tables#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](/reference/resource-configs/snowflake-configs/dynamic-tables#initialize)="ON_CREATE" | "ON_SCHEDULE", 
    [cluster_by](/reference/resource-configs/snowflake-configs/configuring-table-clustering#dynamic-table-clustering)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [immutable_where](/reference/resource-configs/snowflake-configs/dynamic-tables#immutable-where)="<condition>",
    [copy_grants](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables)=true | false,
    [transient](/reference/resource-configs/snowflake-configs/dynamic-tables#transient-dynamic-tables)=true | false,

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

Learn more about these parameters in Snowflake's [docs](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table):

### Target lag

Snowflake allows two configuration scenarios for scheduling automatic refreshes: 
- **Time-based** &mdash; Provide a value of the form `<int> { seconds | minutes | hours | days }`. For example, if the dynamic table needs to be updated every 30 minutes, use `target_lag='30 minutes'`.
- **Downstream** &mdash; Applicable when the dynamic table is referenced by other dynamic tables. In this scenario, `target_lag='downstream'` allows for refreshes to be controlled at the target, instead of at each layer.

<VersionBlock firstVersion="1.12">

#### How `target_lag` interacts with `scheduler`

`target_lag` works with [`scheduler`](/reference/resource-configs/snowflake-configs/dynamic-tables#scheduler) to determine how dynamic table refreshes are managed:

<SimpleTable>

| `target_lag` | `scheduler` | Behavior |
|---|---|---|
| Set | `ENABLE` or omitted | Snowflake manages refreshes automatically. If `scheduler` is omitted, dbt defaults to `ENABLE`. |
| Not set | `DISABLE` or omitted | dbt manages refreshes during model execution. If `scheduler` is omitted, dbt defaults to `DISABLE`. |
| Set | `DISABLE` | Invalid: `DISABLE` does not accept `target_lag`. dbt raises an error. |
| Not set | `ENABLE` | Invalid: `ENABLE` requires `target_lag`. dbt raises an error. |

</SimpleTable>

</VersionBlock>

Learn more about `target_lag` in Snowflake's [docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Please note that Snowflake supports a target lag of 1 minute or longer.

<VersionBlock firstVersion="1.12">

### Scheduler

The `scheduler` parameter controls whether the dynamic table is refreshed by Snowflake's background scheduler or by an external orchestrator (for example, dbt). Snowflake accepts two options:
- **ENABLE** &mdash; Snowflake's built-in scheduler automatically refreshes the dynamic table based on the defined `target_lag`. Refreshes cascade across the dependency graph to maintain snapshot consistency. Setting `target_lag` is _required_ when using this option. 
- **DISABLE** &mdash; The dynamic table is excluded from Snowflake's automatic background refresh. You must trigger refreshes manually or through orchestration external to Snowflake (for example, by a `dbt run` that executes `ALTER DYNAMIC TABLE ... REFRESH`). When this option is explicitly set, specifying `target_lag` results in an error.

:::info dbt default differs from Snowflake's native default
In Snowflake's native DDL, omitting `SCHEDULER` defaults to `ENABLE`, and `TARGET_LAG` is required.

In dbt, the default value is `DISABLE`. If neither `scheduler` nor `target_lag` is specified, dbt creates the dynamic table with `scheduler: DISABLE` and manages refreshes directly.

If you specify `target_lag` without explicitly setting `scheduler`, dbt sets `scheduler: ENABLE`.
:::

**Key points:**
- Explicitly setting `scheduler: DISABLE` together with `target_lag` results in an error. If you omit `scheduler` and provide `target_lag`, dbt resolves the conflict by setting `scheduler: ENABLE` automatically.
- When `scheduler: DISABLE`, a manual refresh does _not_ automatically refresh upstream dynamic table dependencies. This creates an isolation boundary, allowing dbt to manage specific table refreshes without triggering the entire pipeline. In contrast, `ENABLE` cascades refreshes across the dependency graph.
- If a dynamic table with `scheduler: DISABLE` depends on other dynamic tables, those upstream tables will not be refreshed when the downstream table is refreshed. dbt must manage the refresh order explicitly.

For example, to let dbt manage refreshes (default behavior):

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
) }}

select * from {{ source('raw', 'events') }}
```

To enable Snowflake-managed scheduling with a target lag:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='5 minutes',
) }}

select * from {{ source('raw', 'events') }}
```

Learn more about `scheduler` in [Snowflake's docs](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table#optional-parameters).

</VersionBlock>

<VersionBlock firstVersion="1.11">

### Refresh warehouse

Starting `dbt-snowflake` v1.11, you can use the `refresh_warehouse` parameter in your model configuration to specify a separate warehouse for the dynamic table's self-refresh operations. This is separate from [`snowflake_warehouse`](/reference/resource-configs/snowflake-configs/configuring-virtual-warehouses), which controls <Term id="ddl" /> execution. By setting `refresh_warehouse`, you can use a smaller warehouse for automatic refreshes while keeping a larger `snowflake_warehouse` for DDL operations.

To configure the `refresh_warehouse` parameter in your model, refer to the following example:

<File name='models/<model_name>.sql'>

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='LARGE_EXECUTION_WH',
    refresh_warehouse='SMALL_REFRESH_WH',
    target_lag='1 hour'
) }}

select * from {{ source('raw', 'events') }}
```

</File>

**Key points:**
- If `refresh_warehouse` is not set, `snowflake_warehouse` is used for both DDL execution and self-refresh operations.
- You can change `refresh_warehouse` on an existing dynamic table without a full refresh.
- To revert to the default behavior after setting a refresh warehouse, remove the `refresh_warehouse` parameter from your model configuration or explicitly set it to `None`.

Learn more about the `WAREHOUSE` parameter in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-warehouses).

</VersionBlock>

<VersionBlock firstVersion="1.9">

### Refresh mode

Snowflake allows three options for refresh mode:
- **AUTO** &mdash; Enforces an incremental refresh of the dynamic table by default. If the `CREATE DYNAMIC TABLE` statement does not support the incremental refresh mode, the dynamic table is automatically created with the full refresh mode.
- **FULL** &mdash; Enforces a full refresh of the dynamic table, even if the dynamic table can be incrementally refreshed.
- **INCREMENTAL** &mdash; Enforces an incremental refresh of the dynamic table. If the query that underlies the dynamic table can’t perform an incremental refresh, dynamic table creation fails and displays an error message.

Learn more about `refresh_mode` in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Initialize

Snowflake allows two options for initialize:
- **ON_CREATE** &mdash; Refreshes the dynamic table synchronously at creation. If this refresh fails, dynamic table creation fails and displays an error message.
- **ON_SCHEDULE** &mdash; Refreshes the dynamic table at the next scheduled refresh.

Learn more about `initialize` in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

<VersionBlock firstVersion="1.11">

### Immutable where

Snowflake allows you to mark certain rows of a dynamic table as immutable using the `IMMUTABLE WHERE` clause. This prevents Snowflake from applying updates or deletions to matching rows during refreshes, so historical data stays the same and refreshes run faster.

From <Constant name="core"/> v1.11, you can configure this using the `immutable_where` configuration. This config accepts a SQL condition expression and rows that match it are treated as immutable and won’t be updated or deleted during future refreshes.

For example, to mark data older than 1 day as immutable since historical data typically doesn't change:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='1 hour',
    immutable_where='ts < CURRENT_TIMESTAMP() - INTERVAL \'1 DAY\''
) }}

select
    id,
    ts,
    value
from {{ source('raw', 'events') }}
```

**Key points:**
- The config supports Jinja rendering (for example, dbt variables and macros), as long as the rendered result is a valid Snowflake SQL condition.
- To remove the immutable constraint from an existing dynamic table, set `immutable_where` to `None`.
- You can alter changes to `immutable_where` without a full refresh.

Learn more about `IMMUTABLE WHERE` in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-immutability-constraints).

### Copy grants (dynamic tables)

Starting `dbt-snowflake` v1.11, you can use `copy_grants` to preserve existing object-level privileges when dbt generates a `CREATE OR REPLACE DYNAMIC TABLE` statement. When disabled, all previously granted permissions are dropped when the table is recreated, and downstream users or roles lose access until grants are manually re-applied.

When you set `copy_grants: true` on a dynamic table, dbt adds the `COPY GRANTS` clause to the `CREATE OR REPLACE DYNAMIC TABLE` statement. This preserves existing object-level privileges on the table during `--full-refresh` runs, so you don't need to re-grant access after the table is recreated.

To configure the `copy_grants` parameter, refer to the following example:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='1 hour',
    copy_grants=true
) }}

select * from {{ source('raw', 'events') }}
```

Learn more about `COPY GRANTS` in [Snowflake's docs](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table).

</VersionBlock>

<VersionBlock firstVersion="1.12">

### Transient (dynamic tables)

You can create dynamic tables as transient to reduce storage costs. Transient dynamic tables do not use Snowflake's [Fail-safe](https://docs.snowflake.com/en/user-guide/data-failsafe) period, so they consume less storage than permanent dynamic tables. To create a dynamic table as transient, set `transient: true` in the model configuration.

If you want all dynamic tables to be transient by default (without setting `transient: true` on each one), enable the [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) flag in your `dbt_project.yml`. This flag defaults to `false`, meaning dynamic tables are created as permanent by default.

**Key points:**
- Setting `transient: true` creates the dynamic table with the `TRANSIENT` keyword in the `CREATE DYNAMIC TABLE` statement.
- Snowflake does not support changing the transient property on an existing dynamic table. Changing `transient` from `true` to `false` or vice versa triggers a full table recreation.
- To make all new dynamic tables transient by default when `transient` is not specified, enable the `snowflake_default_transient_dynamic_tables` flag in your `dbt_project.yml`.

For example:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='MY_WH',
    target_lag='1 hour',
    transient=true
) }}

select * from {{ source('raw', 'events') }}
```

### Initialization warehouse

Snowflake supports an `INITIALIZATION_WAREHOUSE` parameter that specifies which virtual warehouse to use when initializing or reinitializing a dynamic table. 

Starting `dbt-snowflake` v1.12, you can use the `snowflake_initialization_warehouse` parameter to configure this. This is separate from the `snowflake_warehouse` parameter used for regular incremental refreshes. By setting `snowflake_initialization_warehouse`, you can use a larger warehouse for the initial build and reinitialization, while keeping `snowflake_warehouse` smaller for regular refreshes.

To configure the `snowflake_initialization_warehouse` parameter, refer to the following example:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='COMPUTE_WH',
    snowflake_initialization_warehouse='LARGE_WH',
    target_lag='1 minute'
) }}

select * from {{ source('raw', 'events') }}
```

**Key points:**
- If `snowflake_initialization_warehouse` is not set, Snowflake uses `snowflake_warehouse` for both initialization and regular refreshes.
- You can change `snowflake_initialization_warehouse` on an existing dynamic table without a full refresh.
- To revert to the default behavior after setting an initialization warehouse, either remove the `snowflake_initialization_warehouse` parameter from your model configuration or explicitly set it to `None`.

Learn more about `INITIALIZATION_WAREHOUSE` in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-warehouses).

</VersionBlock>

### Limitations

As with materialized views on most data platforms, there are limitations associated with dynamic tables. Some worth noting include:

- Dynamic table SQL has a [limited feature set](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- Dynamic table SQL cannot be updated; the dynamic table must go through a `--full-refresh` (DROP/CREATE).
- Dynamic tables cannot be downstream from: materialized views, external tables, streams.
- Dynamic tables cannot reference a view that is downstream from another dynamic table.

Find more information about dynamic table limitations in Snowflake's [docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

For dbt limitations, [Model contracts](/docs/mesh/govern/model-contracts) are not supported.

### Troubleshooting dynamic tables

If your dynamic table model fails to rerun with the following error message after the initial execution:

```sql
SnowflakeDynamicTableConfig.__init__() missing 6 required positional arguments: 'name', 'schema_name', 'database_name', 'query', 'target_lag', and 'snowflake_warehouse'
```
Ensure that `QUOTED_IDENTIFIERS_IGNORE_CASE` on your account is set to `FALSE`. 
