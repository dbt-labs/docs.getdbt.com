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

import FusionBeta from '/snippets/_fusion-beta-callout.md';
import FusionDWH from '/snippets/_fusion-dwh.md';

<VersionBlock lastVersion="1.99">

<FusionBeta />

</VersionBlock>

### Parity with dbt Core

Our goal is for the <Constant name="fusion_engine" /> to support all capabilities of the <Constant name="core" /> framework, and then some. Fusion already supports many of the capabilities in <Constant name="core" /> v1.9, and we're working fast to add more.

Note that we have removed some deprecated features, and introduced more-rigorous validation of erroneous project code. Refer to the [Upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) for details.

## Requirements

To use Fusion in your dbt project:
- You're using a supported adapter and authentication method:
  <FusionDWH /> 
- Have only SQL models defined in your project. Python models are not currently supported because Fusion cannot parse these to extract dependencies (refs) on other models. <!-- [TODO: Link to dbt-fusion Python issue.] -->

### Limitations

If your project is using any of the features listed in the following table, you can use Fusion, but you won't be able to fully migrate all your workloads because you have:
- Models that leverage specific materialization features may be unable to run or may be missing some desirable configurations.
- Tooling that expects dbt Core's exact log output. Fusion's logging system is currently unstable and incomplete.
- Workflows built around complementary features of the dbt platform (like model-level notifications, Advanced CI, and Semantic Layer) that Fusion does not yet support.

:::note
We have been moving quickly to implement many of these features during the Beta and Preview periods, ahead of General Availability. Read more about [the path to GA](/blog/dbt-fusion-engine-path-to-ga), and track our progress in the [`dbt-fusion` milestones](https://github.com/dbt-labs/dbt-fusion/milestones).
:::

import FusionFeatures from '/snippets/_fusion-missing-features.md';

<FusionFeatures />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

### Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />
