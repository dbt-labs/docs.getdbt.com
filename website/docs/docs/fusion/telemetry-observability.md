---
title: "Telemetry and observability"
id: "telemetry"
description: "Fusion support for telemetry and observability"
pagination_next: null
pagination_prev: null
---

The <Constant name="fusion_engine" /> provides a comprehensive telemetry system that replaces [<Constant name="core" />'s structured logging](/reference/events-logging#structured-logging). Built on [OpenTelemetry](https://opentelemetry.io/) conventions and backed by a stable protobuf schema, it enables deep integration with orchestrators, observability platforms, and custom tooling.

This uses the same integration that <Constant name="dbt_platform" /> relies on for orchestration and monitoring, providing proven and production-ready features that work at scale.

## Available output formats

<Constant name="fusion" /> telemetry supports three output formats, which you can enable independently:

| Format      | Use case                                                         | Availability               |
| ----------- | ---------------------------------------------------------------- | -------------------------- |
| **JSONL**   | Real-time monitoring, streaming to downstream systems.            | Written as events occur.    |
| **Parquet** | Post-run analysis, querying, and long-term storage.               | Written when runs complete. |
| **OTLP**    | Integration with observability platforms (Datadog, Jaeger, and more). | Streamed in real-time.  |

### Enabling telemetry output

The following are some examples of options for enabling telemetry output (You can combine multiple outputs in a single run):

Write JSONL to a file (saves to the `logs/` directory):

```bash
dbtf build --otel-file-name telemetry.jsonl
```

Stream JSONL to stdout:
```bash
dbtf build --log-format otel
```

Write a Parquet file (saves to `target/metadata/` directory):
```bash
dbtf build --otel-parquet-file-name telemetry.parquet
```

Export to an OpenTelemetry collector:
```bash
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318" dbtf build --export-to-otlp
```

## Telemetry data

<Constant name="fusion" /> telemetry contains two types of records:

- **Spans** &mdash; Operations with a start and end time (like compiling a model or running a test).
- **Log records** &mdash; Point-in-time events within a span.

### Telemetry hierarchy

Every dbt command creates a hierarchy of spans:

```
Invocation (dbtf build)
├── Phase (Parse)
├── Phase (Compile)
│   ├── Node (model.project.customers)
│   └── Node (model.project.orders)
└── Phase (Run)
    ├── Node (model.project.customers)
    └── Node (model.project.orders)
```

The `trace_id` (also known as `invocation_id`) remains consistent across all telemetry records for a single dbt command, making it easy to correlate events.

## Node outcome

Every node produces a result for each phase it participates in. Some phases, such as `parse`, don't involve node-level execution, so they don't produce node spans or node outcomes.

 The `node_outcome` field indicates whether or not <Constant name="fusion" /> executed the node's operation. 

| Outcome    | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| `success`  | The node operation was completed with no errors.   |
| `error`    | The node operation failed to execute (for example, syntax error). |
| `skipped`  | The node was not evaluated (see [skip reasons](#skip-reasons)). |
| `canceled` | The node was interrupted (for example, user pressed Ctrl+C).  |

### Skip reasons

When <Constant name="fusion" /> skips a node, the telemetry includes a reason:

| Skip reason      | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `upstream`       | A dependency failed.                                              |
| `cached`         | <Constant name="fusion" /> reused results from cache (no changes detected via [state aware orchestration](/docs/deploy/state-aware-about)). |
| `phase_disabled` | The phase was disabled (for example, `--static-analysis off`).    |
| `noop`           | Node doesn't perform work in this phase (for example, ephemeral models). |

### Test outcomes

When a test executes successfully (`node_outcome: success`), it reports the test result:

| Test outcome | Description                                   |
| ------------ | --------------------------------------------- |
| `passed`     | No failures detected.                         |
| `warned`     | Failures detected, but configured as warnings. |
| `failed`     | Failures detected (data quality issue).        |

:::info Test outcomes

A test with `node_outcome: success` and `test_outcome: failed` means <Constant name="fusion" /> successfully ran the test, and the test reported data quality issues. This differs from `node_outcome: error`, which means the test itself couldn't run (for example, invalid SQL).

:::

## Querying telemetry data

Query the telemetry data to gain deeper insights into your dbt runs.

### JSONL examples

The following are some examples of querying the JSONL telemetry data. 

Watch for errors in real-time:
```bash
tail -f telemetry.jsonl | jq 'select(.severity_text == "ERROR")'
```

List skipped nodes, reasons, and upstream details:
```bash
cat telemetry.jsonl | jq 'select(.attributes.node_outcome == "NODE_OUTCOME_SKIPPED") | {node: .attributes.unique_id, reason: .attributes.node_skip_reason, upstream: .attributes.node_skip_upstream_detail.upstream_unique_id }'
```

### Parquet analysis with DuckDB

Leverage DuckDB to better understand your telemetry data stored in Parquet files. 

Find slowest nodes:
```python
import duckdb
duckdb.sql("""
    SELECT
        attributes.unique_id,
        (end_time_unix_nano - start_time_unix_nano) / 1e6 AS duration_ms
    FROM 'telemetry.parquet'
    WHERE event_type LIKE '%NodeProcessed%'
    ORDER BY duration_ms DESC
    LIMIT 10
""").show()
```


Count outcomes by type:
```python
duckdb.sql("""
    SELECT
        attributes.node_outcome,
        COUNT(*) as count
    FROM 'telemetry.parquet'
    WHERE attributes.node_outcome IS NOT NULL
    GROUP BY attributes.node_outcome
""").show()
```

## OpenTelemetry integration

<Constant name="fusion" />'s native OTLP support lets you send telemetry directly to any OpenTelemetry-compatible receiver, including Datadog, Jaeger, Google Cloud Trace, Grafana Tempo, and Honeycomb.

This enables:

- Integration with existing observability &mdash; No custom integrations needed.
- Custom alerts that trigger notifications on failures or slow builds.
- Correlate across systems that links dbt traces with downstream services.
- Centralized monitoring to view dbt alongside your other infrastructure.

<!-- :::tip Community example

 "I set up a basic OpenTelemetry collector that sends the dbt traces to Google Cloud Traces, which integrates with our devops observability, alarms, and on-call system. We now have a monitorable data ingestion stack.

The traces let us quickly find exactly which step failed, and the error log even provides a quick link into BigQuery showing us the exact generated query that failed."

::: -->

### Setting up OTLP export

The following example configures the OTLP export:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
dbtf build --export-to-otlp
```

## Mapping to dbt Core concepts

If you're familiar with <Constant name="core" />'s structured logging, here's how <Constant name="fusion" /> telemetry maps:

| <Constant name="core" />            | <Constant name="fusion" /> telemetry                     |
| ----------------------------------- | -------------------------------------------------------- |
| `invocation_id`                     | `trace_id` (same value, different format)                |
| `run_results.json` status           | `node_outcome` + `skip_reason` or `test_outcome`         |
| Event `code` (for example, `Q001`)  | `event_type`                                             |
| `--log-format json`                 | `--log-format otel` or `--otel-file-name`                |

### Node status mapping

| <Constant name="core" /> status | <Constant name="fusion" /> outcome                       |
| ------------------------------- | -------------------------------------------------------- |
| `success`                       | `node_outcome: success`                                  |
| `error`                         | `node_outcome: error`                                    |
| `skipped`                       | `node_outcome: skipped`, `skip_reason: upstream`         |
| `pass` (tests)                  | `node_outcome: success`, `test_outcome: passed`          |
| `warn` (tests)                  | `node_outcome: success`, `test_outcome: warned`          |
| `fail` (tests)                  | `node_outcome: success`, `test_outcome: failed`          |

Note that <Constant name="core" />'s `fail` status maps to <Constant name="fusion" />'s `node_outcome: success` because <Constant name="fusion" /> distinguishes between "the test ran successfully and found data issues" versus "the test couldn't run." This separation enables more precise alerting and retry logic.

<Constant name="fusion" /> adds `skip_reason: cached` for nodes reused via [State Aware Orchestration](/docs/deploy/state-aware-about), which has no <Constant name="core" /> equivalent.

## Record structure

Each telemetry record contains envelope fields plus event-specific `attributes`:

```json
{
  "record_type": "SpanEnd",
  "trace_id": "f9a0a9e64c924b878133363ba3515e50",
  "span_id": "0000000000000036",
  "span_name": "Node(model.project.customers)",
  "parent_span_id": "0000000000000017",
  "start_time_unix_nano": "1756139116981079652",
  "end_time_unix_nano": "1756139117234567890",
  "severity_text": "INFO",
  "event_type": "v1.public.events.fusion.node.NodeEvaluated",
  "attributes": {
    "unique_id": "model.project.customers",
    "phase": "Run",
    "node_outcome": "success"
  }
}
```

| Field | Description |
| ----- | ----------- |
| `record_type` | `SpanStart`, `SpanEnd`, or `LogRecord` |
| `trace_id` | Unique identifier for the invocation (same data as `invocation_id` but in OTEL format). |
| `span_id` / `parent_span_id` | For reconstructing the span hierarchy. |
| `event_type` | Type identifier for filtering and parsing. |
| `attributes` | Event-specific data (schema varies by event type, but unlike OTEL conventions, it's strictly backed by a stable protobuf schema). |

## Schema stability

Unlike <Constant name="core" />'s structured logging, <Constant name="fusion" /> telemetry is backed by a public protobuf schema with strict compatibility guarantees:

- **Additive only** &mdash; New fields and event types may be added, but existing fields are never removed or changed.
- **Forward compatible** &mdash; Your integrations will continue to work as the schema evolves.

This makes <Constant name="fusion" /> telemetry a reliable foundation for production integrations, orchestrators, and long-term analytics pipelines.

## Official client library (coming soon) {#official-client-library}

dbt Labs is developing an official open-source client library. Built in Rust for performance, it will be available as:

- A standalone Rust crate and CLI.
- A fully-typed Python package wrapping the Rust core.

The library will provide type-safe, forward-compatible access to telemetry data—stream JSONL in real-time, query Parquet files, and build custom integrations with confidence that schema changes won't break your code.
