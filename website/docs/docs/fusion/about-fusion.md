---
title: "About Fusion"
sidebar_label: "About Fusion"
id: "about-fusion"
description: "Fusion is the next-generation engine for dbt."
---

# About the dbt Fusion engine

<VersionBlock lastVersion="1.99">
:::tip Available only on v2
v2 is the free, faster way to develop dbt that uses the Rust-based engine. For richer [Upgrade to v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2) to get it. 

Get started right away with many dbt features, free forever! You can also try advanced features by running `dbt login` to create a free dbt platform account for the best v2 experience.
:::
</VersionBlock>

<IntroText>

dbt is the industry standard for data transformation. The <Constant name="fusion_engine" /> enables dbt to operate at speed and scale like never before.
</IntroText>

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

The <Constant name="fusion_engine" /> shares the same dbt framework you already know &mdash; the same dbt language and project structure &mdash; while enabling you to work faster and deploy transformation workloads more efficiently.

### What is Fusion

Fusion is written in Rust and has a native understanding of SQL across multiple engine dialects &mdash; catching errors before they reach your warehouse and powering editor features like autocomplete and inline errors as you type.

Fusion is the default experience when you [install dbt](/docs/local/install-dbt). It gives you the recommended v2 experience from the command line and builds on the Apache 2.0 runtime available as dbt Core 2.0. It's free to use, with some capabilities unlocked when you sign in with any <Constant name="dbt_platform" /> account &mdash; free, no paid plan required. 

## Why use Fusion

As a developer, Fusion can:
- Immediately catch incorrect SQL in your dbt models, before they ever hit the warehouse
- Give you autocomplete, hover info, and inline errors as you type
- Preview inline <Term id="cte">CTEs</Term> for faster debugging
- Trace model and column definitions across your entire project

Get all of this, free, in the [dbt extension for VSCode](/docs/about-dbt-extension) &mdash; built on Fusion.

### Thread management

The <Constant name="fusion_engine" /> manages parallelism differently than dbt Core v1.x. Rather than treating the `threads` setting as a strict limit on concurrent operations, Fusion optimizes parallelism based on each adapter's characteristics.

- **Snowflake and Databricks**: Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance.
- **BigQuery and Redshift**: Fusion respects user-set threads to manage rate limits and concurrency constraints.

For BigQuery and Redshift, setting `--threads 0` or omitting the setting allows Fusion to dynamically optimize. Low thread values can significantly slow down performance on these platforms.

For more information, refer to [Using threads](/docs/running-a-dbt-project/using-threads#fusion-engine-thread-optimization).

### How to use Fusion
 
You can use Fusion in three ways:

- Select Fusion from the version dropdown in the [dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version#dbt-fusion-engine)
- [Install the dbt extension for VS Code](/docs/install-dbt-extension)
- [Install dbt](/docs/local/install-dbt) to get Fusion from the command line

To get started quickly, try the [Fusion quickstart](/guides/fusion). If you use the <Constant name="dbt_platform"/> and want to keep local development in sync, refer to [Hybrid development with the <Constant name="dbt_platform"/> and Fusion](/guides/fusion-platform-local-workflow).

_Need Apache 2.0 only? [Install dbt Core 2.0](/docs/local/install-dbt-core-v2), the open-source project behind Fusion._

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
