---
title: "About Fusion"
sidebar_label: "About Fusion"
id: "about-fusion"
description: "Fusion is the next-generation engine for dbt."
---

# About the dbt Fusion engine

<IntroText>

dbt is the industry standard for data transformation. The <Constant name="fusion_engine" /> enables dbt to operate at speed and scale like never before.
</IntroText>

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

The <Constant name="fusion_engine" /> shares the same familiar framework for authoring data transformations as <Constant name="core" />, while enabling data developers to work faster and deploy transformation workloads more efficiently.

### What is Fusion

Fusion is written in Rust and has a native understanding of SQL across multiple engine dialects. Fusion will eventually support the full dbt Core framework, a superset of dbt Core capabilities, and the vast majority of existing dbt projects.

[<Constant name="core_v2" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2) is the open-source Apache 2.0 foundation that <Constant name="fusion" /> builds on. <Constant name="core_v2" /> delivers a faster, Rust-based runtime for dbt projects; <Constant name="fusion" /> extends it with SQL comprehension, column-level lineage, and richer development capabilities. It is currently in alpha.

<Constant name="core_v2" /> is published as Apache 2.0 open source in the [`dbt-core` repository](https://github.com/dbt-labs/dbt-core), the single canonical home for issues and contributions. Fusion, which includes the <Constant name="fusion_engine" />’s richer capabilities, is proprietary.

## Why use Fusion

As a developer, Fusion can:
- Immediately catch incorrect SQL in your dbt models
- Preview inline <Term id="cte">CTEs</Term> for faster debugging
- Trace model and column definitions across your dbt project

All of that and more is available in the [dbt extension for VSCode](/docs/about-dbt-extension), with Fusion at the foundation.


### Thread management

The <Constant name="fusion_engine" /> manages parallelism differently than <Constant name="core" />. Rather than treating the `threads` setting as a strict limit on concurrent operations, Fusion optimizes parallelism based on each adapter's characteristics.

- **Snowflake and Databricks**: Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance.
- **BigQuery and Redshift**: Fusion respects user-set threads to manage rate limits and concurrency constraints.

For BigQuery and Redshift, setting `--threads 0` or omitting the setting allows Fusion to dynamically optimize. Low thread values can significantly slow down performance on these platforms.

For more information, refer to [Using threads](/docs/running-a-dbt-project/using-threads#fusion-engine-thread-optimization).

### How to use Fusion
 
You can:
- Select Fusion from the [dropdown/toggle in the dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version#dbt-fusion-engine)
- [Install the dbt extension for VSCode](/docs/install-dbt-extension) <Lifecycle status="preview" />
- [Install the <Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2) <Lifecycle status="preview" />


Go straight to the [Quickstart](/guides/fusion) to _feel the Fusion_ as fast as possible. If you're a <Constant name="dbt_platform"/> user and want to keep your local environment in sync with the platform, see the [Hybrid development with <Constant name="dbt_platform"/> and <Constant name="fusion"/>](/guides/fusion-platform-local-workflow) guide.

## What's next?

dbt Labs launched the dbt Fusion engine as a public beta on May 28, 2025, with plans to reach full feature parity with <Constant name="core" /> ahead of [Fusion's general availability](/blog/dbt-fusion-engine-path-to-ga).

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
