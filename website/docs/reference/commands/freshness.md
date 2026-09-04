---
title: "About dbt freshness command"
sidebar_label: "freshness"
id: "freshness"
availability:
  engine: v2
  access: free
---

# dbt freshness <Lifecycle status="beta" />

The `dbt freshness` command checks whether sources and models with [freshness](/reference/resource-configs/freshness) configured meet your `warn_after` and `error_after` thresholds, reporting warnings and errors accordingly. It replaces [`dbt source freshness`](/reference/commands/source), which checks sources only.

## Usage

```bash
dbt freshness [--select SELECTOR] [--resource-type RESOURCE_TYPE] [--exclude-resource-type RESOURCE_TYPE]
```

### Check all sources and models

```bash
dbt freshness
```

### Check only sources

```bash
dbt freshness --resource-type source
```

### Check only models

```bash
dbt freshness --resource-type model
```

### Exclude a resource type

```bash
# Check everything except sources
dbt freshness --exclude-resource-type source

# Check everything except models
dbt freshness --exclude-resource-type model

### Check a specific model or source

```bash
# Check a specific model
dbt freshness --select stg_orders

# Check all sources in a namespace
dbt freshness --select "source:jaffle_shop"

# Check a specific source table
dbt freshness --select "source:jaffle_shop.orders"
```

## What gets checked

`dbt freshness` selects any source or model with `warn_after` or `error_after` set in its `freshness` config.

Freshness is measured using one of three methods, in order of precedence:

| Method | When used |
|---|---|
| `loaded_at_query` | When set on the node — runs the custom SQL expression to get the latest timestamp |
| `loaded_at_field` | When set — queries `MAX(<loaded_at_field>)` against the materialized relation |
| Adapter metadata | For `table`, `incremental`, `materialized_view`, and `dynamic_table` models with no `loaded_at_field` — uses the adapter's relation metadata to determine last modified time |

## Command output

### freshness.json

After `dbt freshness` completes, dbt writes `target/freshness.json` covering all checked nodes &mdash; both sources and models &mdash; each tagged with `resource_type`. For the full schema, refer to: [`freshness.json`](/reference/artifacts/freshness-json).

```json
{
  "meta": {
    "generated_at": "2026-08-28T00:00:00.000000Z",
    "elapsed_time": 1.23
  },
  "results": [
    {
      "unique_id": "model.jaffle_shop.stg_orders",
      "resource_type": "model",
      "max_loaded_at": "2026-08-27T22:00:00+00:00Z",
      "snapshotted_at": "2026-08-28T00:00:00+00:00Z",
      "max_loaded_at_time_ago_in_s": 7200,
      "state": "pass",
      "criteria": {
        "warn_after": {"count": 24, "period": "hour"},
        "error_after": {"count": 48, "period": "hour"}
      }
    },
    {
      "unique_id": "source.jaffle_shop.jaffle_shop.orders",
      "resource_type": "source",
      "max_loaded_at": "2026-08-27T23:30:00+00:00Z",
      "snapshotted_at": "2026-08-28T00:00:00+00:00Z",
      "max_loaded_at_time_ago_in_s": 1800,
      "state": "pass",
      "criteria": {
        "warn_after": {"count": 12, "period": "hour"},
        "error_after": {"count": 24, "period": "hour"}
      }
    }
  ]
}
```

### sources.json

For backward compatibility, whenever sources are included in a `dbt freshness` run, dbt also writes `target/sources.json`. It contains sources only, with no `resource_type` field. For the full schema, refer to [`sources.json`](/reference/artifacts/sources-json).

[`dbt source freshness`](/reference/commands/source) still works for backward compatibility and produces only `sources.json`.
dbt does not overwrite `sources.json` if the run measured no sources.

## Related docs

- [Freshness config](/reference/resource-configs/freshness)
- [Source data freshness](/docs/build/sources#source-data-freshness)
- [dbt artifacts](/reference/artifacts/dbt-artifacts)
