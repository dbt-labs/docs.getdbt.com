---
title: "Optimize your dbt builds"
id: "optimize-builds"
description: "Learn how dbt State, deferral, and dbt clone can help you build more efficiently."
pagination_prev: null
pagination_next: null
---

# Optimize your dbt builds

By default, dbt rebuilds every selected node on every run &mdash; even if nothing has changed. For large projects, this adds up: longer job times, higher warehouse costs, and slower feedback during development. dbt has features designed to help you skip unnecessary work and reuse existing results instead.

- [dbt State](#dbt-state)
- [Deferral](#deferral)
- [`dbt clone`](#dbt-clone)

## dbt State

[dbt State](/docs/deploy/dbt-state-about) makes dbt smarter about what to build. Instead of rebuilding every node on every run, it compares each node's logic and upstream data against the previous run and picks the most efficient path:

- **Skip** — If the node's logic and upstream data haven't changed, dbt reuses the existing object in your target schema as-is.
- **Clone** — If the data is fresh but exists in a different schema (for example, production), dbt clones it rather than rebuilding from scratch.
- **Build** — If reuse isn't possible, dbt rebuilds normally and automatically defers unselected upstream nodes to production &mdash; no `--defer` or `--state` flags required.

dbt State is available as a plugin for <Constant name="core" /> v1.7-1.12. Authentication requires a [<Constant name="dbt_platform" /> account](https://www.getdbt.com/signup) or a [standalone dbt State account](https://app.state.dbt.com). To get started, refer to [Setting up dbt State](/docs/deploy/dbt-state-setup).

## Deferral

[Deferral](/reference/node-selection/defer) lets you build a subset of your project without building all upstream dependencies first. Instead of running everything upstream, dbt points unbuilt references at existing objects in another environment &mdash; typically production.

This is useful in development and CI environments, where you want to test one or two models without waiting for a full pipeline run.

```bash
dbt build --select my_model --defer --state path/to/prod/artifacts
```

## dbt clone

[`dbt clone`](/reference/commands/clone) creates copies of selected nodes in a target schema. On warehouses that support zero-copy cloning (for example, Snowflake), it creates lightweight database clones without duplicating the underlying data. On other warehouses, it creates views pointing at the upstream relations.

This is useful in development when you want to quickly populate a dev environment with production-like objects without running the full pipeline.

```bash
dbt clone --select my_model
```
