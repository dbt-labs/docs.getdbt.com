---
title: "About dbt State"
sidebar_label: "About dbt State"
description: "Learn about dbt State, its benefits, and key concepts for running only what has changed in your dbt project."
id: "dbt-state-about"
tags: ['dbt State']
---

# About dbt State <Lifecycle status="preview" />

<IntroText>

dbt State makes dbt smarter about what to build. Instead of rebuilding every node on every run, dbt reuses nodes by cloning from another location or skipping a rebuild when the logic and data haven't changed.

</IntroText>

With dbt State, dbt first compares the logic and data of each node to previous builds across multiple environments on every run &mdash; whether orchestrated in the <Constant name="dbt_platform" />, through your own orchestrator, or in development. If the logic is the same and the data is still fresh, dbt reuses an existing object. It will either clone an existing node from elsewhere, or skip executing a model that already exists, rather than building it anew. Additionally, it will automatically defer to production state without the need to manually set the `--defer` or `--state` flags.

dbt State can reuse all node types that create relations in the database (such as models, snapshots, seeds) and data tests.

dbt State works with <Constant name="core" />, the <Constant name="dbt_platform" />, and <Constant name="fusion_engine" />, across all environments and orchestrators, making it a flexible approach regardless of how you run dbt. It requires authentication either through a <Constant name="dbt_platform" /> account or a [standalone dbt State account](https://app.state.dbt.com). For pricing details, refer to [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage).

## Benefits

dbt State delivers efficiency gains across both production and development environments:

- **Fresher data, lower costs** — Nodes only rebuild when the result would be different (new data or code changes), reducing warehouse compute while keeping production data fresh.
- **Faster iteration cycles** — In development, dbt automatically clones selected nodes from production whenever possible, so you spend less time waiting for builds and more time writing code.
- **Smarter than standard deferral** — Unlike standard deferral, which always builds selected nodes and only defers unselected upstream references, dbt State decides whether transformations need to run at all, or whether an existing table can simply be cloned.

## How dbt State works

When you run a command like `dbt build --select +my_model`, dbt State evaluates each selected node and applies the most efficient approach it can:

- **Reuse node from same schema (skip)** — dbt checks whether the object already exists in the target schema, its logic hasn't changed, and its upstream parents haven't received fresh data beyond the configured [`lag_tolerance`](/reference/resource-configs/lag-tolerance). If all conditions are met, dbt skips the node entirely, as if it was never selected. For data tests, if the nodes being tested haven't changed since the last run, the previous test result is reused without re-executing the test query.
- **Reuse node from different schema (clone)** — If the same object exists with matching logic and fresh data, dbt State clones it. The node is marked as **Reused** at a fraction of the compute cost.
- **Normal build** — If reuse is not possible, dbt builds the node as normal, automatically deferring any unselected upstream nodes.

Without dbt State, every selected node rebuilds on every run regardless of whether anything has changed.

For the full list of available configs, see [dbt State configs](/reference/resource-configs/dbt-state-configs).

## Supported data warehouses

dbt State is supported on the following data warehouses:

- Snowflake
- Databricks
- BigQuery
- Redshift

More data warehouses are on the roadmap. If you're using another data warehouse and are interested in dbt State, [let us know](https://www.getdbt.com/contact).


## Signing up for dbt State

When you sign up for dbt State, you'll choose one of two paths:

- **<Constant name="dbt_platform" /> account** — dbt State is connected to your existing <Constant name="dbt_platform" /> account. Your dbt State credentials are the same as your platform credentials, and dbt State has access to your platform environments and jobs.
- **Standalone account ([app.state.dbt.com](https://app.state.dbt.com))** — A standalone dbt State account is independent of any <Constant name="dbt_platform" /> account. You manage dbt State credentials separately, and dbt State has no visibility into your platform environments or jobs.

A standalone account makes sense if you:

- Don't have a <Constant name="dbt_platform" /> account
- Don't have admin permissions to enable dbt State in your <Constant name="dbt_platform" /> account
- Want to test dbt State without connecting it to your <Constant name="dbt_platform" /> account yet


## FAQs

<FAQ path="Runs/what-happened-to-sao" />
<FAQ path="State/state-modified-difference" />
<FAQ path="State/incremental-models" />
<FAQ path="State/data-storage" />
<FAQ path="State/last-updated-timestamp" />
<FAQ path="State/model-change-calculation" />
<FAQ path="State/views-rebuilt" />
<FAQ path="State/server-failure" />
<FAQ path="State/multiple-projects" />
<FAQ path="State/non-prod-environment" />

## Related docs

- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [CI/CD setup](/docs/deploy/dbt-state-cicd)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
- [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage)
