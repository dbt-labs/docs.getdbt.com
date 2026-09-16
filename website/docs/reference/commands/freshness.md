---
title: "About dbt freshness command"
sidebar_label: "freshness"
id: "freshness"
availability:
  engine: v2
  access: free
---

# dbt freshness

The `dbt freshness` command evaluates whether sources and models with [freshness](/reference/resource-configs/freshness) configured meet your `warn_after` and `error_after` thresholds, reporting warnings and errors accordingly.

## Usage

```bash
dbt freshness [--select SELECTOR] [--resource-type RESOURCE_TYPE] [--exclude-resource-type RESOURCE_TYPE]
```

### Run freshness for all sources and models

```bash
dbt freshness
```

### Include or exclude resource types
Use the flag to specify which resource type you want to include or exclude when running the command:

```bash
# Include sources only
dbt freshness --resource-type source

# Include models only
dbt freshness --resource-type model

# Exclude sources only
dbt freshness --exclude-resource-type source
```

### Select specific model or source
Use `--select` to specify which model or source you want to include when running the command:

```bash
# Select a specific model 
dbt freshness --select stg_orders

# Select all sources in a namespace
dbt freshness --select "source:jaffle_shop"

# Select a specific source table
dbt freshness --select "source:jaffle_shop.orders"
```

## How freshness is evaluated 

`dbt freshness` evaluates sources or models that have `warn_after` or `error_after` set in their [`freshness` config](/reference/resource-configs/freshness?version=2).

dbt retrieves the latest timestamp using one of the following methods, then compares it with the current timestamp to determine the age of the data.

<SimpleTable>

| Method | When used | How dbt retrieves the timestamp |
| --- | --- | --- |
| `loaded_at_query` | When configured on the resource | Runs the custom SQL expression to retrieve the latest timestamp. |
| `loaded_at_field` | When configured on the resource | Queries `MAX(<loaded_at_field>)` against the materialized relation. |
| Adapter metadata | When neither `loaded_at_query` nor `loaded_at_field` is configured | Retrieves the last-modified time from adapter relation metadata. Available for sources, and for models materialized as `table`, `incremental`, `materialized_view`, or `dynamic_table`, where supported by the adapter.  Models materialized as `view` or `external` must use either `loaded_at_field` or `loaded_at_query`. |

</SimpleTable>

You can't configure both `loaded_at_query` and `loaded_at_field` on the same resource. Setting both raises a parse error.

## Command output

### freshness.json

After `dbt freshness` completes, dbt writes results for the evaluated sources and models to `target/freshness.json`. Each entry includes a `resource_type` field that identifies whether the resource is a source or a model.

For the full schema, refer to: [`freshness.json`](/reference/artifacts/freshness-json).

```json
{
  "metadata": {
    "generated_at": "2026-08-28T00:00:00.000000Z"
  },
  "results": [
    {
      "unique_id": "model.jaffle_shop.stg_orders",
      "resource_type": "model",
      "max_loaded_at": "2026-08-27T22:00:00+00:00",
      "snapshotted_at": "2026-08-28T00:00:00+00:00",
      "max_loaded_at_time_ago_in_s": 7200,
      "status": "Pass",
      "criteria": {
        "warn_after": {"count": 24, "period": "hour"},
        "error_after": {"count": 48, "period": "hour"}
      }
    },
    {
      "unique_id": "source.jaffle_shop.jaffle_shop.orders",
      "resource_type": "source",
      "max_loaded_at": "2026-08-27T23:30:00+00:00",
      "snapshotted_at": "2026-08-28T00:00:00+00:00",
      "max_loaded_at_time_ago_in_s": 1800,
      "status": "Pass",
      "criteria": {
        "warn_after": {"count": 12, "period": "hour"},
        "error_after": {"count": 24, "period": "hour"}
      }
    }
  ]
}
```

### sources.json (legacy) {#sources-json}

For backward compatibility, whenever sources are included in a `dbt freshness` run, dbt also writes `target/sources.json`. It contains sources only, with no `resource_type` field. If the run includes only models, dbt does not overwrite `sources.json`.

For the full schema, refer to [`sources.json`](/reference/artifacts/sources-json).

The legacy [`dbt source freshness`](/reference/commands/source) command still works for backward compatibility and produces only `sources.json`.

## Related docs

- [Freshness config](/reference/resource-configs/freshness)
- [Source data freshness](/docs/build/sources#source-data-freshness)
- [dbt artifacts](/reference/artifacts/dbt-artifacts)
