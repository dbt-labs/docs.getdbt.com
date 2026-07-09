---
title: "Warehouse snapshots"
sidebar_label: "Warehouse snapshots"
description: "Microsoft Fabric warehouse snapshots are read-only copies of your warehouse that dbt-fabric creates before and after runs."
---

Microsoft Fabric warehouse snapshots are read-only copies of your warehouse at a specific moment, kept for up to 30 days. They allow analysts query a stable dataset, even while ELT processes are updating the warehouse. By moving the snapshot’s timestamp forward, changes are applied all at once (atomically).

dbt-fabric supports warehouse snapshots, which helps track changes in Fabric Data Warehouse objects between dbt runs. Fabric automatically creates snapshots _before_ and _after_ you run the `dbt run`, `dbt build`, or `dbt snapshot` commands.

To use them, your `profiles.yml` must include the `workspace_id` and the warehouse snapshot name so dbt can create the snapshot as a child item of your warehouse. 

Learn more [here](https://learn.microsoft.com/en-us/fabric/data-warehouse/warehouse-snapshot)

```yaml
fabric_dw:
  target: dev
  outputs:
    dev:
      type: fabric
      server: "<your-fabric-server-name>"
      database: "<your-warehouse-name>"
      schema: "<default-schema>"
      authentication: CLI
      workspace_id: e4487eff-d67d-4b58-917c-ffbb61a5c05f
      warehouse_snapshot_name: dbt-dwtests-snpshot
      
### Behavior
- Before a dbt operation (`run`, `build`, `snapshot`), the adapter captures the pre-state of affected tables.
- After execution, the warehouse snapshot is created with snapshot timestamp.

For additional details:
- [dbt snapshot documentation](/docs/build/snapshots)
- [Fabric adapter snapshots reference](/reference/resource-configs/fabric-configs)


## dbt-utils

Not supported at this time. However, dbt-fabric offers some dbt-utils macros. Please check out the [tsql-utils package](https://github.com/dbt-msft/tsql-utils).
