---
title: "Upgrading to dbt Core v2.0"
id: upgrading-to-v2
description: Install dbt Core v2.0 alpha — the open-source Rust-based foundation for dbt
displayed_sidebar: "docs"
---

:::caution dbt Core v2.0 is in alpha
dbt Core v2.0 is currently in alpha. This does not affect the Fusion in platform rollout, which continues on its existing track. For full Fusion feature information, see the [Fusion upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
:::

dbt Core v2.0 is the next major evolution of dbt Core, the trusted open-source standard for data transformation, now rebuilt on the Fusion runtime and released under Apache 2.0. It delivers a faster, Rust-based foundation while preserving the dbt experience practitioners already know.

dbt Core v2.0 is the open-source foundation that the dbt Fusion engine builds on. For the full Fusion-powered experience, including SQL comprehension, column-level lineage, instant feedback, and platform-connected workflows, install the `dbt` distribution.

## Distributions

Two dbt distributions build on the Fusion runtime:

| Distribution | Install | License | What you get |
|---|---|---|---|
| **dbt Core v2.0** | `pip install dbt-core` | Apache 2.0 | Open-source Rust-based runtime. Faster parsing and execution. |
| **Fusion** | `pip install dbt` | Proprietary | dbt Core v2.0 foundation plus Fusion features: SQL comprehension, column-level lineage, and more. |

## Installation

Currently, to install <Constant name="core_v2" />, you must target an explicit pin. You can copy the following commands to install the alpha and immediately update to the most recent version:

```shell
pip install dbt-core==2.0.0-alpha.1
dbt system update
```

### Fusion installation 

For the richer experience, install the [<Constant name="fusion" /> release candidate](/docs/local/install-dbt?version=2.0) today.

## Features and functionality

We'll be populating this section in the coming weeks as the alpha advances. Keep an eye on this page for more information. 

For the full set of features powered by the <Constant name="fusion_engine" />, check out the [Fusion upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).


