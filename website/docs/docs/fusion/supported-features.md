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
<!-- table for feature comparison ("What's available where?")-->
<Constant name="fusion_engine" /> (built on Rust) gives your team up to 30x faster performance and comes with different features depending on where you use it. 
- It powers both _engine-level_ improvements (like faster compilation and incremental builds) and _editor-level_ features (like IntelliSense, hover info, and inline errors) through the <Term id="lsp"/> through the dbt VS Code extension.
- To learn about the <Term id="lsp"/> features supported across the <Constant name="dbt_platform"/>, refer to [About dbt LSP](/docs/about-dbt-lsp).
- To stay up-to-date on the latest features and capabilities, check out the [Fusion diaries](https://github.com/dbt-labs/dbt-fusion/discussions).

<Constant name="core" /> (built on Python) supports <Term id="sql-rendering" /> but lacks SQL parsing and modern editor features powered by <Constant name="fusion_engine" /> and the <Term id="lsp"/>. 

:::tip 
<Constant name="dbt_platform" /> customers using <Constant name="fusion" /> can [develop across multiple development surfaces](/docs/fusion/fusion-availability), including  <Constant name="cloud_ide"/> and VS Code with the dbt extension. 

<Constant name="dbt_platform" /> [features](/docs/cloud/about-cloud/dbt-cloud-features) (like [Advanced CI](/docs/deploy/advanced-ci), [dbt <Constant name="mesh" />](/docs/mesh/about-mesh), [State-aware orchestration](/docs/deploy/state-aware-about), and more) are available regardless of which surface you use, depending on your [dbt plan](https://www.getdbt.com/pricing). 
:::

If you're not sure what features are available in <Constant name="fusion" />, the dbt VS Code extension, <Constant name="fusion"/>-CLI, or more, the following table focuses on <Constant name="fusion" />-powered options. 

In this table, self-hosted means it's open-source/source-available and runs on your own infrastructure; <Constant name="dbt_platform" /> is hosted by dbt Labs and includes platform-level features.

> ✅ = Available | 🟡 = Partial/at compile-time only | ❌ = Not available | Coming soon = Not yet available

| **Category/Capability** |<span style={{whiteSpace: 'nowrap'}}>**Fusion CLI**</span><br/><span style={{whiteSpace: 'nowrap'}}><small>(self-hosted)</small></span> | **Fusion + VS Code extension**<br/><span style={{whiteSpace: 'nowrap'}}><small>(self-hosted)</small></span> | <span style={{whiteSpace: 'nowrap'}}>**dbt platform**</span> <br/>** + VS Code extension**<sup>1</sup> | **dbt platform** <span style={{whiteSpace: 'nowrap'}}> ** + Studio IDE** </span><br/><span style={{whiteSpace: 'nowrap'}}> ** + Other dev surfaces**<sup>2</sup> </span> | **Requires <br />[<span style={{whiteSpace: 'nowrap'}}>static analysis</span>](/docs/fusion/new-concepts#principles-of-static-analysis)** |
|:--------------|:---------------:|:-------------:|:-------------:|:-------------:|:--------------:|
| **Engine performance** |  |  |  |  |  |
| <Term id="sql-rendering" /> | ✅ | ✅ | ✅ | ✅ | ❌ |
| SQL parsing and compilation <small>(SQL understanding)</small> | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Editor and dev experience** |  |  |  |  |  |
| IntelliSense/autocomplete/hover info | ❌ | ✅ | ✅ | ✅ | ✅ |
| Inline errors (on save/in editor) | 🟡 | ✅ | ✅ | ✅ | ✅ |
| Live CTE previews/compiled SQL view | ❌ | ✅ | ✅ | ✅ | 🟡 <br /><small>(Live CTE previews only)</small> |
| Refactoring tools (rename model/column) | ❌ | ✅ | ✅ | <small>Coming soon</small> | 🟡 <br /><small>(Column refactor only)</small> |
| Go-to definition/references/macro | ❌ | ✅ | ✅ | <small>Coming soon</small> | 🟡 <br /><small>(Column go-to definition only)</small> |
| Column-level lineage (in editor) | ❌ | ✅ | ✅ | <small>Coming soon</small>  | ✅ |
| Developer compare changes | ❌ | ❌ | <small>Coming soon</small> | <small>Coming soon</small> | ❌ |
| **Platform and governance** |  |  |  |  |  |
| Advanced CI compare changes | ❌ | ❌ | ✅ | ✅ | ❌ |
| dbt <Constant name="mesh" /> | ❌ | ❌ | ✅ | ✅ | ❌ |
| Efficient testing | ❌ | ❌ | ✅ | ✅ | ✅ |
| State-aware orchestration (SAO) | ❌ | ❌ | ✅ | ✅ | ❌ |
| Governance (PII/PHI tracking) | ❌ | ❌ | <small>Coming soon</small> | <small>Coming soon</small> | ✅ |
| CI/CD cost optimization (Slimmer CI) | ❌ | ❌ | <small>Coming soon</small> | <small>Coming soon</small> | ✅ |

<sup>1</sup> Support for other <Constant name="dbt_platform" /> and <Term id="lsp"/> features, like <Constant name="visual_editor"/>, <Constant name="semantic_layer" /> or Column-level lineage, is coming soon. See [About LSP](/docs/about-dbt-lsp) for a more detailed comparison of dbt development environments.<br />
<sup>2</sup> The [dbt VS Code extension](/docs/about-dbt-extension) is usable in VS Code, Cursor, Windsurf, and other VS Code–based editors.


#### Additional considerations
Here are some additional considerations if using the Fusion CLI without the VS Code extension or the VS Code extension without the Fusion CLI:
    - **Fusion CLI** ([binary](/blog/dbt-fusion-engine-components))
      - Free to use and runs on the <Constant name="fusion_engine" /> (distinct from <Constant name="core" />). 
      - Benefits from Fusion engine's performance for `parse`, `compile`, `build`, and `run`, but _doesn't_ include <Term id="lsp"/> [features](/docs/dbt-extension-features) like autocomplete, hover insights, lineage, and more.  
      - Requires `profiles.yml` only (no `dbt_cloud.yml`).
    - **dbt VS Code extension**
      - Free to use and runs on the <Constant name="fusion_engine" />; register your email within 14 days. 
      - Benefits from <Constant name="fusion" /> engine's performance for `parse`, `compile`, `build`, and `run`, and includes <Term id="lsp"/> [features](/docs/dbt-extension-features) like autocomplete, hover insights, lineage, and more.
      - Capped at 15 users per organization. See the [acceptable use policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup) for more information.
      - If you already have a <Constant name="dbt_platform" /> user account (even if a trial expired), sign in with the same email. Unlock or reset it if locked.  
      - Requires both `profiles.yml` and `dbt_cloud.yml` files.

## Limitations

If your project is using any of the features listed in the following table, you can use Fusion, but you won't be able to fully migrate all your workloads because you have:
- Models that leverage specific materialization features may be unable to run or may be missing some desirable configurations.
- Tooling that expects dbt Core's exact log output. Fusion's logging system is currently unstable and incomplete.
- Workflows built around complementary features of the dbt platform (like model-level notifications, Advanced CI, and Semantic Layer) that Fusion does not yet support.
- When using the dbt VS Code extension in Cursor, lineage visualization works best in Editor mode and doesn't render in Agent mode. If you're working in Agent mode and need to view lineage, switch to Editor mode to access the full lineage tab functionality.

:::note
We have been moving quickly to implement many of these features ahead of General Availability. Read more about [the path to GA](/blog/dbt-fusion-engine-path-to-ga), and track our progress in the [`dbt-fusion` milestones](https://github.com/dbt-labs/dbt-fusion/milestones).
:::

import FusionFeatures from '/snippets/_fusion-missing-features.md';

<FusionFeatures />

## Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
