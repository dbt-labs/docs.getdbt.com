---
title: "About the dbt Fusion engine"
id: "about-fusion"
description: "Fusion is the next-generation engine for dbt."
pagination_next: null
pagination_prev: null
intro_text: "dbt is the industry standard for data transformation. The dbt Fusion engine enables dbt to operate at speed and scale like never before."
---

# About the dbt Fusion engine <Lifecycle status="beta" />


import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

The dbt Fusion engine shares the same familiar framework for authoring data transformations as <Constant name="core" />, while enabling data developers to work faster and deploy transformation workloads more efficiently.

### What is Fusion

Fusion is an entirely new piece of software, written in a different programming language (Rust) than <Constant name="core" /> (Python). Fusion is significantly faster than <Constant name="core" />, and it has a native understanding of SQL across multiple engine dialects. Fusion will eventually support the full dbt Core framework, a superset of dbt Core’s capabilities, and the vast majority of existing dbt projects.

Fusion contains mixture of source-available, proprietary, and open source code. That means:
- dbt Labs publishes much of the source code in the [`dbt-fusion` repository](https://github.com/dbt-labs/dbt-fusion), where you can read the code and participate in community discussions.
- Some Fusion capabilities are exclusively available for paying customers of the cloud-based [dbt platform](https://www.getdbt.com/signup). Refer to [supported features](/docs/fusion/supported-features#paid-features) for more information.

Read more about the licensing for the dbt Fusion engine [here](http://www.getdbt.com/licenses-faq).

## Why use Fusion

As a developer, Fusion can:
- Immediately catch incorrect SQL in your dbt models
- Preview inline <Term id="cte">CTEs</Term> for faster debugging
- Trace model and column definitions across your dbt project

All of that and more is available in the [dbt extension for VSCode](/docs/about-dbt-extension), with Fusion at the foundation.

Fusion also enables more-efficient deployments of large DAGs. By tracking which columns are used where, and which source tables have fresh data, Fusion can ensure that models are rebuilt only when they need to process new data. This ["state-aware orchestration"](https://docs.getdbt.com/docs/deploy/state-aware-about) is a feature of the dbt platform.

### How to use Fusion

You can:
- Select Fusion from the [dropdown/toggle in the dbt platform](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine)
- [Install the dbt extension for VSCode](/docs/install-dbt-extension)
- [Install the Fusion CLI](/docs/fusion/install-fusion)

Go straight to the [Quickstart](/guides/fusion) to _feel the Fusion_ as fast as possible.

## What's next?

dbt Labs launched the dbt Fusion engine as a public beta on May 28, 2025, with plans to reach full feature parity with <Constant name="core" /> ahead of [Fusion's general availability](https://docs.getdbt.com/blog/2025-05-28-dbt-fusion-engine-path-to-ga).

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
