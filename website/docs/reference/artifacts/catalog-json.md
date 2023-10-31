---
title: "Catalog JSON file"
sidebar_label: "Catalog"
---

**Current schema**: [`v1`](https://schemas.getdbt.com/dbt/catalog/v1.json)
    
**Produced by:** [`docs generate`](/reference/commands/cmd-docs)

This file contains information from your <Term id="data-warehouse" /> about the tables and <Term id="view">views</Term> produced and defined by the resources in your project. Today, dbt uses this file to populate metadata, such as column types and <Term id="table" /> statistics, in the [docs site](/docs/collaborate/documentation).

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `nodes`: Dictionary containing information about database objects corresponding to dbt models, seeds, and snapshots.
- `sources`: Dictionary containing information about database objects corresponding to dbt sources.
- `errors`: Errors received while running metadata queries during `dbt docs generate`.

### Resource details

Within `sources` and `nodes`, each dictionary key is a resource `unique_id`. Each nested resource contains:
- `unique_id`: `<resource_type>.<package>.<resource_name>`, same as dictionary key, maps to `nodes` and `sources` in the [manifest](/reference/artifacts/manifest-json)
- `metadata`
    - `type`: table, view, etc.
    - `database`
    - `schema`
    - `name`
    - `comment`
    - `owner`
- `columns` (array)
    - `name`
    - `type`: data type
    - `comment`
    - `index`: ordinal
- `stats`: differs by database and relation type
