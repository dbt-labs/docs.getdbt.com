---
title: "Snowflake configurations"
id: "snowflake-configs"
description: "Snowflake Configurations - Read this in-depth guide to learn about configurations in dbt."
tags: ['Snowflake', 'dbt Fusion', 'dbt Core']
---

import SnowflakeColumn from '/snippets/_snowflake-column-size.md';

<SnowflakeColumn />

## Iceberg table format

Our Snowflake Iceberg table content has moved to a [new page](/docs/mesh/iceberg/snowflake-iceberg-support)!

## Dynamic tables

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
| [`target_lag`](#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |


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
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE

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
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 

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
| [`target_lag`](#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |
| [`cluster_by`](#dynamic-table-clustering)     | `<string>` or `<list>` | no       | `None` | alter   |
| [`immutable_where`](#immutable-where)     | `<string>` | no       | `None` | alter   |


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
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[immutable_where](#immutable-where): <condition>

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
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 
      [cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
      [immutable_where](#immutable-where): <condition>

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 
    [cluster_by](#dynamic-table-clustering)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [immutable_where](#immutable-where)="<condition>",

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
| [`target_lag`](#target-lag)      | `<string>` | no      |        | alter          |
| [`scheduler`](#scheduler)       | `<string>` | no       | `DISABLE`   | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`snowflake_initialization_warehouse`](#initialization-warehouse)   | `<string>` | no       | `None`      | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |
| [`cluster_by`](#dynamic-table-clustering)     | `<string>` or `<list>` | no       | `None` | alter   |
| [`immutable_where`](#immutable-where)     | `<string>` | no       | `None` | alter   |
| [`transient`](#transient-dynamic-tables)     | `<boolean>` | no       | `False` | full refresh   |


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
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[scheduler](#scheduler): ENABLE | DISABLE
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[snowflake_initialization_warehouse](#initialization-warehouse): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 
    [+](/reference/resource-configs/plus-prefix)[cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
    [+](/reference/resource-configs/plus-prefix)[immutable_where](#immutable-where): <condition>
    [+](/reference/resource-configs/plus-prefix)[transient](#transient-dynamic-tables): true | false

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
      [target_lag](#target-lag): downstream | <time-delta>
      [scheduler](#scheduler): ENABLE | DISABLE
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [snowflake_initialization_warehouse](#initialization-warehouse): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE
      [cluster_by](#dynamic-table-clustering): <column-name> | [<column-name>, <column-name>, ...]
      [immutable_where](#immutable-where): <condition>
      [transient](#transient-dynamic-tables): true | false

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [scheduler](#scheduler)="ENABLE" | "DISABLE",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [snowflake_initialization_warehouse](#initialization-warehouse)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 
    [cluster_by](#dynamic-table-clustering)="<column-name>" | ["<column-name>", "<column-name>", ...],
    [immutable_where](#immutable-where)="<condition>",
    [transient](#transient-dynamic-tables)=true | false,

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

`target_lag` works with [`scheduler`](#scheduler) to determine how dynamic table refreshes are managed:

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

### Transient (dynamic tables)

You can create dynamic tables as transient to reduce storage costs. Transient dynamic tables do not use Snowflake's [Fail-safe](https://docs.snowflake.com/en/user-guide/data-failsafe) period, so they consume less storage than permanent dynamic tables. To create a dynamic table as transient, set `transient: true` in the model configuration.

If you want all dynamic tables to be transient by default (without setting `transient: true` on each one), enable the [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) flag in your `dbt_project.yml`. This flag defaults to `False`, meaning dynamic tables are created as permanent by default.

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

For dbt limitations, these dbt features are not supported:
- [Model contracts](/docs/mesh/govern/model-contracts)
- [Copy grants configuration](/reference/resource-configs/snowflake-configs#copying-grants)

### Troubleshooting dynamic tables

If your dynamic table model fails to rerun with the following error message after the initial execution:

```sql
SnowflakeDynamicTableConfig.__init__() missing 6 required positional arguments: 'name', 'schema_name', 'database_name', 'query', 'target_lag', and 'snowflake_warehouse'
```
Ensure that `QUOTED_IDENTIFIERS_IGNORE_CASE` on your account is set to `FALSE`. 

## Semantic Views
[Snowflake Semantic Views](https://docs.snowflake.com/en/user-guide/views-semantic/overview) provide a native schema-level object for centralizing metric definitions and reducing fragmented metric logic across BI and analytics tools.

Use the [`dbt_semantic_view` package](https://hub.getdbt.com/Snowflake-Labs/dbt_semantic_view/latest/) to define and manage Snowflake Semantic Views in your dbt project. This lets you keep Semantic View definitions in version control and apply your existing testing and CI/CD workflows to your <Constant name="semantic_layer" />.

### Install the package
:::note Prerequisite
- This package requires `dbt` version `>=1.0.0, <2.0.0`. For the latest compatibility details, refer to the [`dbt_semantic_view` package](https://hub.getdbt.com/Snowflake-Labs/dbt_semantic_view/latest/).
- Your Snowflake account supports Semantic Views.
- Your role has permission to create Semantic Views.
- You can write to a database and schema where you have create privileges.
:::

Add `dbt_semantic_view` to your `packages.yml` file:

```yaml
packages:
  - package: Snowflake-Labs/dbt_semantic_view
    version: 1.0.3
```

Run `dbt deps` to install package dependencies:

```shell
dbt deps
```

Verify the package was installed by confirming `dbt_semantic_view` is present in your `dbt_packages/` directory.

### Highlighted features

The `dbt_semantic_view` package includes the following features for defining and managing Snowflake Semantic Views in dbt projects.

#### Materialize models as Snowflake Semantic Views

Use the `semantic_view` materialization to define Snowflake Semantic Views in dbt, including tables, relationships, facts, dimensions, and metrics.

Semantic view models use Snowflake’s semantic view syntax (for example, `TABLES`, `DIMENSIONS`, and `METRICS`) rather than a standard `SELECT` query.

The example below is adapted from [Getting Started with Snowflake Semantic View](https://quickstarts.snowflake.com/guide/snowflake-semantic-view/index.html?index=..%2F..index#3).
```sql
{{ config(materialized='semantic_view') }}

tables (
    CUSTOMER as {{ SOURCE('<SOURCE_NAME>', 'CUSTOMER') }} primary key (C_CUSTOMER_SK),
    DATE as {{ SOURCE('<SOURCE_NAME>', 'DATE_DIM') }} primary key (D_DATE_SK),
    DEMO as {{ SOURCE('<SOURCE_NAME>', 'CUSTOMER_DEMOGRAPHICS') }} primary key (CD_DEMO_SK),
    ITEM as {{ SOURCE('<SOURCE_NAME>', 'ITEM') }} primary key (I_ITEM_SK),
    STORE as {{ SOURCE('<SOURCE_NAME>', 'STORE') }} primary key (S_STORE_SK),
    STORESALES as {{ SOURCE('<SOURCE_NAME>', 'STORESALES') }}
    primary key (SS_SOLD_DATE_SK,SS_CDEMO_SK,SS_ITEM_SK,SS_STORE_SK,SS_CUSTOMER_SK)
)
relationships (
    SALESTOCUSTOMER as STORESALES(SS_CUSTOMER_SK) references CUSTOMER(C_CUSTOMER_SK),
    SALESTODATE as STORESALES(SS_SOLD_DATE_SK) references DATE(D_DATE_SK),
    SALESTODEMO as STORESALES(SS_CDEMO_SK) references DEMO(CD_DEMO_SK),
    SALESTOITEM as STORESALES(SS_ITEM_SK) references ITEM(I_ITEM_SK),
    SALETOSTORE as STORESALES(SS_STORE_SK) references STORE(S_STORE_SK)
)
facts (
    ITEM.COST as i_wholesale_cost,
    ITEM.PRICE as i_current_price,
    STORE.TAX_RATE as S_TAX_PERCENTAGE,
    STORESALES.SALES_QUANTITY as SS_QUANTITY
)
dimensions (
    CUSTOMER.BIRTHYEAR as C_BIRTH_YEAR,
    CUSTOMER.COUNTRY as C_BIRTH_COUNTRY,
    CUSTOMER.C_CUSTOMER_SK as c_customer_sk,
    DATE.DATE as D_DATE,
    DATE.D_DATE_SK as d_date_sk,
    DATE.MONTH as D_MOY,
    DATE.WEEK as D_WEEK_SEQ,
    DATE.YEAR as D_YEAR,
    DEMO.CD_DEMO_SK as cd_demo_sk,
    DEMO.CREDIT_RATING as CD_CREDIT_RATING,
    DEMO.MARITAL_STATUS as CD_MARITAL_STATUS,
    ITEM.BRAND as I_BRAND,
    ITEM.CATEGORY as I_CATEGORY,
    ITEM.CLASS as I_CLASS,
    ITEM.I_ITEM_SK as i_item_sk,
    STORE.MARKET as S_MARKET_ID,
    STORE.SQUAREFOOTAGE as S_FLOOR_SPACE,
    STORE.STATE as S_STATE,
    STORE.STORECOUNTRY as S_COUNTRY,
    STORE.S_STORE_SK as s_store_sk,
    STORESALES.SS_CDEMO_SK as ss_cdemo_sk,
    STORESALES.SS_CUSTOMER_SK as ss_customer_sk,
    STORESALES.SS_ITEM_SK as ss_item_sk,
    STORESALES.SS_SOLD_DATE_SK as ss_sold_date_sk,
    STORESALES.SS_STORE_SK as ss_store_sk
)
metrics (
    STORESALES.TOTALCOST as SUM(item.cost),
    STORESALES.TOTALSALESPRICE as SUM(SS_SALES_PRICE),
    STORESALES.TOTALSALESQUANTITY as SUM(SS_QUANTITY)
        WITH SYNONYMS = ('total sales quantity', 'total sales amount')
)
```

When you run dbt, this model compiles to a Snowflake `CREATE SEMANTIC VIEW` statement.

#### Reference Semantic Views in other dbt models

Use `ref()` for Semantic Views defined in your dbt project, and use `source()` for existing external Semantic Views.

```sql
{{ config(materialized='view') }}

select * from semantic_view(
  {{ ref('<semantic_view_model_name>') }}
  METRICS ...
  DIMENSIONS ...
  WHERE ...
)
```

```sql
{{ config(materialized='table') }}

select * from semantic_view(
  {{ source('<source_name>', '<semantic_view>') }}
  METRICS ...
  DIMENSIONS ...
  WHERE ...
)
```

## Temporary tables

Incremental table merges for Snowflake prefer to utilize a `view` rather than a `temporary table`. The reasoning is to avoid the database write step that a temporary table would initiate and save compile time. 

However, some situations remain where a temporary table would achieve results faster or more safely. The `tmp_relation_type` configuration enables you to opt in to temporary tables for incremental builds. This is defined as part of the model configuration. 

To guarantee accuracy, an incremental model using the `delete+insert` strategy with a `unique_key` defined requires a temporary table; trying to change this to a view will result in an error.

Defined in the project YAML:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
    +tmp_relation_type: table | view ## If not defined, view is the default.
  
```

</File>

In the configuration format for the model SQL file:

<File name='dbt_model.sql'>

```yaml

{{ config(
    tmp_relation_type="table | view", ## If not defined, view is the default.
) }}

```

</File>


## Transient tables

Snowflake supports the creation of [transient tables](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake does not preserve a history for these tables, which can result in a measurable reduction of your Snowflake storage costs. Transient tables participate in time travel to a limited degree with a retention period of 1 day by default with no fail-safe period. Weigh these tradeoffs when deciding whether or not to configure your dbt models as `transient`. **By default, all Snowflake tables created by dbt are `transient`.**

### Configuring transient tables in dbt_project.yml

A whole folder (or package) can be configured to be transient (or not) by adding a line to the `dbt_project.yml` file. This config works just like all of the [model configs](/reference/model-configs) defined in `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  +transient: false
  my_project:
    ...
```

</File>

### Configuring transience for a specific model

A specific model can be configured to be transient by setting the `transient` model config to `true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Query tags

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) are a Snowflake
parameter that can be quite useful later on when searching in the [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt supports setting a default query tag for the duration of its Snowflake connections in
[your profile](/docs/local/connect-data-platform/snowflake-setup). You can set more precise values (and override the default) for subsets of models by setting
a `query_tag` model config or by overriding the default `set_query_tag` macro:

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +query_tag: dbt_special

```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    query_tag = 'dbt_special'
) }}

select ...

```
  
In this example, you can set up a query tag to be applied to every query with the model's name.
  
```sql 

  {% macro set_query_tag() -%}
  {% set new_query_tag = model.name %} 
  {% if new_query_tag %}
    {% set original_query_tag = get_current_query_tag() %}
    {{ log("Setting query_tag to '" ~ new_query_tag ~ "'. Will reset to '" ~ original_query_tag ~ "' after materialization.") }}
    {% do run_query("alter session set query_tag = '{}'".format(new_query_tag)) %}
    {{ return(original_query_tag)}}
  {% endif %}
  {{ return(none)}}
{% endmacro %}

```

**Note:** query tags are set at the _session_ level. At the start of each model <Term id="materialization" />, if the model has a custom `query_tag` configured, dbt will run `alter session set query_tag` to set the new value. At the end of the materialization, dbt will run another `alter` statement to reset the tag to its default value. As such, build failures midway through a materialization may result in subsequent queries running with an incorrect tag.

</File>

## Merge behavior (incremental models)

The [`incremental_strategy` config](/docs/build/incremental-strategy) controls how dbt builds incremental models. By default, dbt will use a [merge statement](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) on Snowflake to refresh incremental tables.

Snowflake supports the following incremental strategies:
- [`merge`](/docs/build/incremental-strategy#merge) (default)
- [`append`](/docs/build/incremental-strategy#append)
- [`delete+insert`](/docs/build/incremental-strategy#deleteinsert)
- [`insert_overwrite`](/docs/build/incremental-strategy#insert_overwrite)
  - Note: This is not a standard dbt incremental strategy. `insert_overwrite` behaves like `truncate` + re-`insert` commands on Snowflake. It doesn't support partition-based overwrites, which means it'll overwrite the entire table intentionally. It's implemented as an incremental strategy because it aligns with dbt's workflow of not dropping existing tables. You can use [`overwrite_columns`](#overwrite_columns) to control which columns are included in the `INSERT OVERWRITE` statement.
- [`microbatch`](/docs/build/incremental-microbatch)

Snowflake's `merge` statement fails with a "nondeterministic merge" error if the `unique_key` specified in your model config is not actually unique. If you encounter this error, you can instruct dbt to use a two-step incremental approach by setting the `incremental_strategy` config for your model to `delete+insert`.

### `overwrite_columns`

When using `incremental_strategy='insert_overwrite'` on Snowflake, you can set `overwrite_columns` to control how dbt generates the `INSERT OVERWRITE` statement for your incremental model. For example:

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='insert_overwrite',
    overwrite_columns=['id', 'value', 'event_date']
) }}

select id, value, event_date
from {{ ref('my_source') }}
```

</File>

- If you set `overwrite_columns`, dbt generates SQL that explicitly lists the columns in both the `INSERT` target and the `SELECT` projection:

  ```sql
  insert overwrite into my_schema.my_table (id, value, event_date)
  select id, value, event_date
  from staging_table
  ```

- If you don't set `overwrite_columns`, dbt currently defaults to `SELECT *`:

  ```sql
  insert overwrite into my_schema.my_table
  select *
  from staging_table
  ```

## Configuring table clustering

dbt supports [table clustering](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) on Snowflake. To control clustering for a <Term id="table" /> or incremental model, use the `cluster_by` config. When this configuration is applied, dbt will do two things:

1. It will implicitly order the table results by the specified `cluster_by` fields.
2. It will add the specified clustering keys to the target table.

By using the specified `cluster_by` fields to order the table, dbt minimizes the amount of work required by Snowflake's automatic clustering functionality. If an incremental model is configured to use table clustering, then dbt will also order the staged dataset before merging it into the destination table. As such, the dbt-managed table should always be in a mostly clustered state.

### Using cluster_by

The `cluster_by` config accepts either a string, or a list of strings to use as clustering keys. The following example will create a sessions table that is clustered by the `session_start` column.

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    cluster_by=['session_start']
  )
}}

select
  session_id,
  min(event_time) as session_start,
  max(event_time) as session_end,
  count(*) as count_pageviews

from {{ source('snowplow', 'event') }}
group by 1
```

</File>

The code above will be compiled to SQL that looks (approximately) like this:

```sql
create or replace table my_database.my_schema.my_table as (

  select * from (
    select
      session_id,
      min(event_time) as session_start,
      max(event_time) as session_end,
      count(*) as count_pageviews

    from {{ source('snowplow', 'event') }}
    group by 1
  )

  -- this order by is added by dbt in order to create the
  -- table in an already-clustered manner.
  order by session_start

);

 alter table my_database.my_schema.my_table cluster by (session_start);
```


### Dynamic table clustering

Starting in <Constant name="core"/> v1.11, dynamic tables support the `cluster_by` configuration. When set, dbt includes the clustering specification in the `CREATE DYNAMIC TABLE` statement.

For example:

```sql
{{ config(
    materialized='dynamic_table',
    snowflake_warehouse='COMPUTE_WH',
    target_lag='1 minute',
    cluster_by=['session_start', 'user_id']
) }}

select
    session_id,
    user_id,
    min(event_time) as session_start,
    max(event_time) as session_end,
    count(*) as count_pageviews
from {{ source('snowplow', 'event') }}
group by 1, 2
```

This config generates the following SQL when compiled:

```sql
create or replace dynamic table my_database.my_schema.my_table
  target_lag = '1 minute'
  warehouse = COMPUTE_WH
  cluster by (session_start, user_id)
as (
  select
    session_id,
    user_id,
    min(event_time) as session_start,
    max(event_time) as session_end,
    count(*) as count_pageviews
  from source_table
  group by 1, 2
);
```

You can specify clustering for dynamic tables when you create them using `CLUSTER BY` in the `CREATE DYNAMIC TABLE` statement. You don’t need to run a separate `ALTER TABLE` statement.

### Automatic clustering

Automatic clustering is [enabled by default in Snowflake today](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html), no action is needed to make use of it. Though there is an `automatic_clustering` config, it has no effect except for accounts with (deprecated) manual clustering enabled.

If [manual clustering is still enabled for your account](https://docs.snowflake.com/en/user-guide/tables-clustering-manual.html), you can use the `automatic_clustering` config to control whether or not automatic clustering is enabled for dbt models. When `automatic_clustering` is set to `true`, dbt will run an `alter table <table name> resume recluster` query after building the target table.

The `automatic_clustering` config can be specified in the `dbt_project.yml` file, or in a model `config()` block.

<File name='dbt_project.yml'>

```yaml
models:
  +automatic_clustering: true
```

</File>

## Python model configuration

The Snowflake adapter supports Python models. Snowflake uses its own framework, Snowpark, which has many similarities to PySpark.

**Additional setup:** You will need to [acknowledge and accept Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started) to use Anaconda packages.

**Installing packages:** Snowpark supports several popular packages via Anaconda. Refer to the [complete list](https://repo.anaconda.com/pkgs/snowflake/) for more details. Packages are installed when your model is run. Different models can have different package dependencies. If you use third-party packages, Snowflake recommends using a dedicated virtual warehouse for best performance rather than one with many concurrent users.

**Python version:** To specify a different Python version, use the following configuration:

```python
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

You can use the `python_version` config to run a Snowpark model with [Python versions](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup) 3.9, 3.10, or 3.11.


**External access integrations and secrets**: To query external APIs within dbt Python models, use Snowflake’s [external access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) together with [secrets](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Here are some additional configurations you can use:

```python
import pandas
import snowflake.snowpark as snowpark

def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        secrets={"secret_variable_name": "test_secret"},
        external_access_integrations=["test_external_access_integration"],
    )
    import _snowflake
    return session.create_dataframe(
        pandas.DataFrame(
            [{"secret_value": _snowflake.get_generic_secret_string('secret_variable_name')}]
        )
    )
```

**Docs:** ["Developer Guide: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

### Third-party Snowflake packages

To use a third-party Snowflake package that isn't available in Snowflake Anaconda, upload your package by following [this example](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#importing-packages-through-a-snowflake-stage), and then configure the `imports` setting in the dbt Python model to reference to the zip file in your Snowflake staging.

Here’s a complete example configuration using a zip file, including using `imports` in a Python model:

```python

def model(dbt, session):
    # Configure the model
    dbt.config(
        materialized="table",
        imports=["@mystage/mycustompackage.zip"],  # Specify the external package location
    )
    
    # Example data transformation using the imported package
    # (Assuming `some_external_package` has a function we can call)
    data = {
        "name": ["Alice", "Bob", "Charlie"],
        "score": [85, 90, 88]
    }
    df = pd.DataFrame(data)

    # Process data with the external package
    df["adjusted_score"] = df["score"].apply(lambda x: some_external_package.adjust_score(x))
    
    # Return the DataFrame as the model output
    return df

```

For more information on using this configuration, refer to [Snowflake's documentation](https://community.snowflake.com/s/article/how-to-use-other-python-packages-in-snowpark) on uploading and using other python packages in Snowpark not published on Snowflake's Anaconda channel.

## Configuring virtual warehouses

The default warehouse that dbt uses can be configured in your [Profile](/docs/local/profiles.yml) for Snowflake connections. To override the warehouse that is used for specific models (or groups of models), use the `snowflake_warehouse` model configuration. This configuration can be used to specify a larger warehouse for certain models in order to control Snowflake costs and project build times.

[Tests](/docs/build/data-tests) also supports the `snowflake_warehouse` configuration. This can be useful when you want to you run tests on a different Snowflake virtual warehouse than the one used to build models, for example, using a smaller warehouse for lightweight data tests while models run on a larger warehouse.

<Tabs
  defaultValue="dbt_project.yml"
  values={[
    { label: 'Project file', value: 'dbt_project.yml', },
    { label: 'Property file', value: 'models/my_model.yml', },
    { label: 'SQL file config', value: 'models/events/sessions.sql', },
    ]}
>

<TabItem value="dbt_project.yml">

The following example changes the warehouse for a group of models with a config argument in the YAML.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

...

models:
  +snowflake_warehouse: "EXTRA_SMALL"    # default Snowflake virtual warehouse for all models in the project.
  my_project:
    clickstream:
      +snowflake_warehouse: "EXTRA_LARGE"    # override the default Snowflake virtual warehouse for all models under the `clickstream` directory.
snapshots:
  +snowflake_warehouse: "EXTRA_LARGE"    # all Snapshot models are configured to use the `EXTRA_LARGE` warehouse.
data_tests:
  +snowflake_warehouse: "EXTRA_SMALL"    # all data tests are configured to use the `EXTRA_SMALL` warehouse.
```

</File>
</TabItem>
<TabItem value="models/my_model.yml">

The following example overrides the Snowflake warehouse for a single model and a specific test using a config argument in the property file.

<File name='models/my_model.yml'>

```yaml
models:
  - name: my_model
    config:
      snowflake_warehouse: "EXTRA_LARGE"    # override the Snowflake virtual warehouse just for this model
    columns:
      - name: id
        data_tests:
          - unique:
              config:
                snowflake_warehouse: "EXTRA_SMALL"    # use a smaller warehouse for this test
```

</File>
</TabItem>
<TabItem value="models/events/sessions.sql">

The following example changes the warehouse for a single model with a config() block in the SQL model.

<File name='models/events/sessions.sql'>

```sql
# override the Snowflake virtual warehouse for just this model
{{
  config(
    materialized='table',
    snowflake_warehouse='EXTRA_LARGE'
  )
}}

with

aggregated_page_events as (

    select
        session_id,
        min(event_time) as session_start,
        max(event_time) as session_end,
        count(*) as count_page_views
    from {{ source('snowplow', 'event') }}
    group by 1

),

index_sessions as (

    select
        *,
        row_number() over (
            partition by session_id
            order by session_start
        ) as page_view_in_session_index
    from aggregated_page_events

)

select * from index_sessions
```

</File>
</TabItem>
</Tabs>

## Copying grants

When the `copy_grants` config is set to `true`, dbt will add the `copy grants` <Term id="ddl" /> qualifier when rebuilding tables and <Term id="view">views</Term>. The default value is `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
```

</File>

<VersionBlock firstVersion="1.10">

## Setting row access policies 

Configure [row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) on tables, views, and dynamic tables by using the `row_access_policy` config for models. The policy must already exist in Snowflake before you apply it to the model.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    row_access_policy = 'my_database.my_schema.my_row_access_policy_name on (id)'
) }}

select ...

```
</File>

## Configuring table tags 

To add tags to tables, views, and dynamic tables, use the `table_tag` config. Note, the tag must already exist in Snowflake before you apply it.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    table_tag = "my_tag_name = 'my_tag_value'"
) }}

select ...

```

</File>

</VersionBlock>

## Secure views

To create a Snowflake [secure view](https://docs.snowflake.net/manuals/user-guide/views-secure.html), use the `secure` config for view models. Secure views can be used to limit access to sensitive data. Note: secure views may incur a performance penalty, so you should only use them if you need them.

The following example configures the models in the `sensitive/` folder to be configured as secure views.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

models:
  my_project:
    sensitive:
      +materialized: view
      +secure: true
```

</File>

## Source freshness known limitation

Snowflake calculates source freshness using information from the `LAST_ALTERED` column, meaning it relies on a field updated whenever any object undergoes modification, not only data updates. No action must be taken, but analytics teams should note this caveat. 

Per the [Snowflake documentation](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes): 

  >The `LAST_ALTERED` column is updated when the following operations are performed on an object:
  >- DDL operations.
  >- DML operations (for tables only).
  >- Background maintenance operations on metadata performed by Snowflake.

<VersionBlock firstVersion="1.9">

## Pagination for object results

By default, when dbt encounters a schema with up to 100,000 objects, it will paginate the results from `show objects` at 10,000 per page for up to 10 pages.

Environments with more than 100,000 objects in a schema can customize the number of results per page and the page limit using the following [flags](/reference/global-configs/about-global-configs) in the `dbt_project.yml`:

- `list_relations_per_page` &mdash; The number of relations on each page (Max 10k as this is the most Snowflake allows).
- `list_relations_page_limit` &mdash; The maximum number of pages to include in the results.

For example, if you wanted to include 10,000 objects per page and include up to 100 pages (1 million objects), configure the flags as follows:


```yml

flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100

```

</VersionBlock>
