---
title: Catalog
---

### catalog.json

_Produced by:_ `dbt docs generate`

This file contains information from your data warehouse about the tables and views produced by the models in your project. dbt uses this file to render information like column types and table statistics into the docs site.

### Top-level keys

- [`metadata`](dbt-artifacts#common-artifact-metadata)
- `nodes`: Dictionary containing information about database objects corresponding to dbt models, seeds, and snapshots.
- `sources`: Dictionary containing information about database objects corresponding to dbt sources.
- `errors`: Errors received while running metadata queries during `dbt docs generate`.

### Resource details

Within `sources` and `nodes`, each dictionary key is a resource `unique_id`. Each nested resource contains:
- `unique_id`: `<resource_type>.<package>.<resource_name>`, same as dictionary key
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
