---
title: "Supported features"
id: "supported-features"
description: "Feature support and parity information for the dbt Fusion engine."
pagination_next: null
pagination_prev: null
---

# Supported features

<IntroText>

Learn about the features supported by the dbt Fusion engine, including requirements and limitations.

</IntroText>

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';
import FusionDWH from '/snippets/_fusion-dwh.md';

<VersionBlock lastVersion="1.99">

<FusionLifecycle />

</VersionBlock>

## Requirements

To use Fusion in your dbt project:
- You're using a supported adapter and authentication method:
  <FusionDWH /> 
- Have only SQL models defined in your project. Python models are not currently supported because Fusion cannot parse these to extract dependencies (refs) on other models. <!-- [TODO: Link to dbt-fusion Python issue.] -->

## Parity with dbt Core

Our goal is for the <Constant name="fusion_engine" /> to support all capabilities of the <Constant name="core" /> framework, and then some. <Constant name="fusion" /> already supports many of the capabilities in <Constant name="core" /> v1.9, and we're working fast to add more.

Note that we have removed some deprecated features and introduced more rigorous validation of erroneous project code. Refer to the [Upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) for details.

## Features and capabilities
<!-- table for feature comparison (“What’s available where?”)-->
- <Constant name="fusion_engine" /> (built on Rust) gives your team up to 30x faster performance and comes with different features depending on where you use it. 
- It powers both _engine-level_ improvements (like faster compilation and incremental builds) and _editor-level_ features (like IntelliSense, hover info, and inline errors) through the <Term id="lsp"/>.
- To learn about the <Term id="lsp"/> features supported across the <Constant name="dbt_platform"/>, refer to [About dbt LSP](/docs/about-dbt-lsp).
- To stay up-to-date on the latest features and capabilities, check out the [Fusion diaries](https://github.com/dbt-labs/dbt-fusion/discussions).

If you're not sure what features are available, check out the following table. 

> ✅ = Available | 🟡 = Partial / at compile-time only | ❌ = Not available | Coming soon = Not yet available

| **Category / Capability** | **dbt Core**<br /><small>(self-hosted)</small> | **Fusion CLI**<br/><small>(self-hosted)</small> | **VS Code <br />+ Fusion** | **<Constant name="dbt_platform" />*** |
|:---------------------------|:--------------------:|:--------------------:|:------------------:|:----------------------:|
| **Engine performance** |  |  |  |  |
| SQL compilation | ✅ | ✅ | ✅ | ✅ |
| SQL compilation and parsing (SQL understanding) | ❌ | ✅ | ✅ | ✅ |
| Uses the <Constant name="fusion_engine"/> | ❌ <br /><small>(Built on Python)</small> | ✅ | ✅ | ✅ |
| Up to 30x faster parse / compile | ❌ | ✅ | ✅ | ✅ |
| Incremental compilation | ❌ | ❌ | ✅ | ✅ |
| **Editor and development experience** |  |  |  |  |
| IntelliSense / autocomplete / hover info | ❌ | ❌ | ✅ | ✅ |
| Inline errors (on save / in editor) | ❌ | 🟡 | ✅ | ✅ |
| Live CTE previews / compiled SQL view | ❌ | ❌ | ✅ | ✅ |
| Refactoring tools (rename model / column) | ❌ | ❌ | ✅ | Coming soon |
| Go-to definition / references | ❌ | ❌ | ✅ | Coming soon |
| Column-level lineage (in editor) | ❌ | ❌ | ✅ | Coming soon |
| Developer compare changes | ❌ | ❌  | Coming soon | Coming soon |
| **Platform and governance** |  |  |  |  |
| Advanced CI compare changes | ❌ | ❌  | ✅ | ✅ |
| dbt Mesh | ❌ | ❌  | ✅ | ✅ |
| State-aware orchestration (SAO) | ❌ | ❌ | ❌ | ✅ |
| Governance (PII / PHI tracking) | ❌ | ❌ | ❌ | Coming soon |
| CI/CD cost optimization (Slimmer CI) | ❌ | ❌ | ❌ | Coming soon |

*Support for other <Constant name="dbt_platform" /> tools, like <Constant name="semantic_layer" /> and <Constant name="explorer" />, is coming soon.

#### Additional considerations
Here are some additional considerations if using the Fusion CLI without the VS Code extension or the VS Code extension without the Fusion CLI:
    - **Fusion CLI** ([binary](/blog/dbt-fusion-engine-components))
      - Free to use and runs on the <Constant name="fusion_engine" /> (distinct from <Constant name="core" />). 
      - Benefits from Fusion engine’s performance for `parse`, `compile`, `build`, and `run`, but _doesn't_ include visual and interactive [features](/docs/dbt-extension-features) like autocomplete, hover insights, lineage, and more.  
      - Requires `profiles.yml` only (no `dbt_cloud.yml`).
    - **dbt VS Code extension**
      - Free to use and runs on the <Constant name="fusion_engine" />; register your email within 14 days. 
      - Benefits from <Constant name="fusion" /> engine’s performance for `parse`, `compile`, `build`, and `run`, and also includes visual and interactive [features](/docs/dbt-extension-features) like autocomplete, hover insights, lineage, and more.
      - Capped at 15 users per organization. See the [acceptable use policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup) for more information.
      - If you already have a <Constant name="dbt_platform" /> user account (even if a trial expired), sign in with the same email. Unlock or reset it if locked.  
      - Requires both `profiles.yml` and `dbt_cloud.yml` files.

## Limitations

If your project is using any of the features listed in the following table, you can use Fusion, but you won't be able to fully migrate all your workloads because you have:
- Models that leverage specific materialization features may be unable to run or may be missing some desirable configurations.
- Tooling that expects dbt Core's exact log output. Fusion's logging system is currently unstable and incomplete.
- Workflows built around complementary features of the dbt platform (like model-level notifications, Advanced CI, and Semantic Layer) that Fusion does not yet support.

:::note
We have been moving quickly to implement many of these features ahead of General Availability. Read more about [the path to GA](/blog/dbt-fusion-engine-path-to-ga), and track our progress in the [`dbt-fusion` milestones](https://github.com/dbt-labs/dbt-fusion/milestones).
:::

import FusionFeatures from '/snippets/_fusion-missing-features.md';

<FusionFeatures />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

### Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />
