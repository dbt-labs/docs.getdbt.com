---
title: "About dbt sync command"
sidebar_label: "sync"
description: "The dbt sync command generates and manages schema lockfiles for sources, external tables, and other frontier nodes."
id: "sync"
---

The `dbt sync` command generates schema lockfiles that enable static analysis and compilation without live warehouse introspection. dbt stores these human-readable YAML files in the `schemas/` directory of your project.

## Overview

Use `dbt sync` to:

- Generate missing schema lockfiles for sources, external tables, and Python models
- Validate schema drift between declared schemas and the live warehouse
- Update lockfiles after intentional schema changes
- Enable offline compilation and deterministic CI builds

Schema lockfiles turn schema metadata into version-controlled artifacts, similar to dependency lockfiles in other package managers.

## Usage

```bash
# Generate missing schema lockfiles
dbt sync

# Check for schema drift without updating files
dbt sync --check

# Update existing lockfiles with current warehouse schemas
dbt sync --update

# Sync schemas for specific nodes
dbt sync --select source:ad_reporting

# Write lockfiles to a custom directory
dbt sync --schema-dir schemas/staging
```

## Example output

```bash
$ dbt sync

Running with dbt=2.0.0
Found 5 models, 3 sources, 2 external tables

15:12:09 | Missing schemas for 3 nodes: syncing...
15:12:11 | → wrote schemas/sources__ad_reporting.yml
15:12:12 | → wrote schemas/python__orders.yml
15:12:12 | → wrote schemas/external__metrics_layer.yml

Sync complete: 3 schema lockfiles written
```

When checking for drift:

```bash
$ dbt sync --check

Running with dbt=2.0.0
15:14:22 | Checking schemas for drift...

warning: schema drift detected for source ad_reporting.events
  • added column: event_metadata (json)
  ! type changed: event_timestamp timestamp → timestamptz

Run `dbt sync --update` to update lockfiles
```

## Flags

| Flag | Description |
|------|-------------|
| `--check` | Validate declared schemas against the live warehouse without updating files. Reports drift and exits with an error if dbt detects drift. |
| `--update` | Refresh existing lockfiles with current warehouse schemas. Use after intentional schema changes. |
| `--schema-dir PATH` | Specify the directory for reading/writing schema lockfiles. Default: `schemas/` |
| `--select` | Select specific nodes to sync using [node selection syntax](/reference/node-selection/syntax). |
| `--exclude` | Exclude specific nodes from syncing. |
| `--selector` | Use a predefined [YAML selector](/reference/node-selection/yaml-selectors). |
| `--resource-type` | Filter by resource type (for example, `source`, `model`). |

## Schema lockfile format

dbt stores schema lockfiles as YAML in the `schemas/` directory:

```
schemas/
  sources__ad_reporting.yml
  python__orders.yml
  external__metrics_layer.yml
```

Example lockfile content:

```yaml
version: 1
node: source.my_project.ad_reporting.events
columns:
  - name: event_id
    data_type: varchar
  - name: event_timestamp
    data_type: timestamp
  - name: user_id
    data_type: integer
last_synced: 2025-01-15T10:30:00Z
```

## Configuration

Configure default sync behavior in `dbt_project.yml`:

```yaml
sync:
  prefer_declared_schemas: true  # Use lockfiles for compile-time analysis (default: true)
```

## Related commands

The following flags on `dbt compile` interact with schema lockfiles:

| Flag | Description |
|------|-------------|
| `--prefer-remote` | Override lockfiles and use live warehouse introspection during compile. |
| `--no-auto-sync` | Fail compilation if schema lockfiles are missing (useful for CI). |

## Supported node types

| Node type | Schema source |
|-----------|---------------|
| Sources | Schema lockfiles via `dbt sync` |
| External tables | Schema lockfiles via `dbt sync` |
| Python models | Schema lockfiles via `dbt sync` |
| Cross-project refs | `publications.json` artifact (not synced) |
| SQL models | Static analysis (no lockfile needed) |
