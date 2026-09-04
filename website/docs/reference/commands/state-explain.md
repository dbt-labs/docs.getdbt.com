---
title: "dbt state explain"
sidebar_label: "state explain"
id: "state-explain"
description: "Use dbt state explain to see why dbt State made each decision after a run."
---

<VersionBlock firstVersion="2.0">`dbt state explain`</VersionBlock><VersionBlock lastVersion="1.99">`dbt-state explain`</VersionBlock> is a CLI command available when you enable [dbt State](/docs/deploy/dbt-state-about). After a job finishes, run this command to see why dbt State made each decision for every node and whether it executed, skipped, or cloned the node. Use it to audit State behavior, debug unexpected skips, or confirm that freshness and query checks work as expected.

<VersionBlock firstVersion="2.0">

```bash
dbt state explain
```

The output shows all nodes from the last run, with a summary of the State decision for each:

```shell
SKIP_EXECUTION model.jaffle_shop.customers - model was a no-op because its query is up to date and its upstream data is within freshness tolerance
READY_TO_EXECUTE model.jaffle_shop.orders - model was executed because the view definition is newer than the cached execution
READY_TO_EXECUTE test.jaffle_shop.not_null_customers_customer_id - data test was executed because it has no prior execution or its query changed
UNKNOWN unit_test.jaffle_shop.orders.test_order_items_compute_to_bools_correctly - dbt State explain details unavailable
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain
```

The output shows all nodes from the last run with a summary of the State decision for each:

```shell
Last run: 2 minutes ago

customers
└── [No-op] model was a no-op because its query is up to date and its upstream data is within freshness tolerance

locations
└── [Execute] model was executed because either its query didn't match or its upstream data is out of date

not_null_stg_locations_location_id
└── [Execute] data test was executed because it has no prior execution or its query changed
```


</VersionBlock>

If you use the <Constant name="dbt_platform" />, the same information is available without running a command &mdash; go to the [**Explain** tab](/docs/deploy/dbt-state-interface#explain-tab) on the job run details page to see the full decision breakdown for each node.

## Specifying a log file

By default, <VersionBlock firstVersion="2.0">`dbt state explain`</VersionBlock><VersionBlock lastVersion="1.99">`dbt-state explain`</VersionBlock> reads from the most recent execution. To analyze a previous run, you can use `--log-file` (or `-l`) to specify a state file from the `logs/state/` directory:

<VersionBlock firstVersion="2.0">

```bash
dbt state explain --log-file 'logs/state/responses_2026_08_25_11_00_15_667.jsonl'
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain --log-file 'logs/state/responses_2026_08_25_11_00_15_667.jsonl'
```

</VersionBlock>

## Using verbose mode

Use the `--verbose` flag to see the full step-by-step analysis for each node and add a run configuration summary. Use `-s` to filter the output to a specific node.

<VersionBlock firstVersion="2.0">

```bash
dbt state explain --verbose -s my_node_name
```

In <Constant name="core_v2" />, `--verbose` adds a run configuration summary at the top and shows the full step-by-step analysis for each node.

```shell
Run configuration:
  - started at: 2026-08-17T12:24:15.822733+00:00
  - profile: my_profile
  - target: dev
  - defer to target: prod
  - freshness tolerance: 2700 seconds
  - tolerate nondeterminism: true
  - clone incremental in dev: IF_TABLE_MISSING
  - metadata cache TTL: 0 seconds
  - select: fqn:my_node_name
SKIP_EXECUTION model.jaffle_shop.customers - model was a no-op because its query is up to date and its upstream data is within freshness tolerance
  - table analysis ("ANALYTICS"."MY_SCHEMA"."CUSTOMERS")
    - the model table exists already [SUCCESS, TARGET_TABLE_EXISTS]
  - query analysis
    - the model query has not changed [SUCCESS, NODE_QUERY_UNCHANGED]
    - upstream model queries have not changed [SUCCESS]
  - data freshness analysis
    - upstream dependencies
      - "ANALYTICS"."MY_SCHEMA_RAW"."RAW_CUSTOMERS" [FRESH]
        - no updates since "ANALYTICS"."MY_SCHEMA"."CUSTOMERS" last executed
        - last updated: 5 days ago
    - upstream data is up to date [SUCCESS]
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain --verbose -s my_node_name
```

The verbose output shows the full step-by-step analysis and adds a run configuration summary:

```shell
Last run: 2026-08-19 20:19:00 PST (10 minutes ago)

  Run configuration:
  ├── dbt State:
  │   ├── defer to target: prod
  │   ├── freshness tolerance: 45 minutes (2700 seconds)
  │   ├── tolerate non-determinism: True
  │   ├── clone incremental in dev: IF_TABLE_MISSING
  │   └── metadata cache ttl: infinite (cache never expires)
  └── dbt:
      ├── profile: jaffle_shop
      └── target: dev

  customers
  ├── table analysis ("ANALYTICS"."DBT_SCHEMA"."CUSTOMERS")
  │   └── ✓ the model table exists already in 'dev'
  ├── query analysis
  │   ├── ✓ the model query has not changed
  │   └── ✓ upstream model queries have not changed
  └── data freshness analysis
      ├── upstream dependencies
      │   ├── [fresh] "ANALYTICS"."RAW"."RAW_CUSTOMERS"
      │   │   ├── no updates since "ANALYTICS"."DBT_SCHEMA"."CUSTOMERS" last
      │   │   │   executed
      │   │   └── last updated: a month ago, 2026-07-31 13:22:30 UTC
      │   └── [within tolerance] "ANALYTICS"."DBT_SCHEMA"."ORDERS"
      │       ├── updated a moment after "ANALYTICS"."DBT_SCHEMA"."CUSTOMERS" last
      │       │   executed (tolerance: 45 minutes)
      │       └── last updated: 39 seconds ago, 2026-08-19 12:18:40 UTC
      └── ✓ upstream data is outdated (within tolerance)
  decision: [No-op] model was a no-op because its query is up to date and its upstream data is within freshness tolerance
```

</VersionBlock>

The `--verbose` flag produces a decision breakdown that may include the following analyses, depending on the node type:

- **Table analysis**: whether the target table already exists in the schema
- **Query analysis**: whether the model query or its upstream queries have changed
- **Data freshness analysis**: whether upstream data is fresh or within the configured [`lag_tolerance`](/reference/resource-configs/lag-tolerance)

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Monitor dbt State activity](/docs/deploy/dbt-state-interface)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
