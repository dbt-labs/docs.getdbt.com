---
title: "Supported features"
id: "supported-features"
description: "Feature support and parity information for dbt."
pagination_next: null
pagination_prev: null
---

# Supported features

<IntroText>

Learn about the features supported by Fusion, including requirements and limitations.

</IntroText>

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';
import FusionDWH from '/snippets/_fusion-dwh.md';

<VersionBlock lastVersion="1.99">

<FusionLifecycle />

</VersionBlock>

When you install dbt, you get Fusion by default. There's no separate feature set to choose between &mdash; Fusion is just dbt, running faster, with more capability built in.

## Requirements

To use Fusion in your project you must:
- Use a supported adapter and authentication method:
  <FusionDWH /> 
- Be able to run your project on the latest version of dbt Core v1.x with no deprecation warnings or errors.
- Migrate your Semantic Layer configurations to the [latest YAML spec](/docs/build/latest-metrics-spec).

## Parity with dbt Core v1.x

Fusion supports nearly all of dbt Core v1.x's capabilities today. Refer to [Limitations](#limitations) below for the small number of gaps that remain.

Fusion has also removed some deprecated features and introduced more rigorous validation of erroneous project code compared to dbt Core v1.x. Refer to the [Upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-v2) for details.

## Features and capabilities

Fusion gives your team faster development workflows with semantic and syntax error detection, a faster linter, column-level lineage, language server and VS Code integration, docs v2 (full), and data diff. The dbt VS Code extension adds editor features like IntelliSense, hover info, and inline errors on top, powered by the <Term id="lsp"/>.

Most Fusion features work right away, with no login required. A few more unlock once you sign in with a <Constant name="dbt_platform" /> account &mdash; free to create, no paid plan needed. For the full free-vs-login breakdown, refer to [Fusion availability](/docs/fusion/fusion-availability). For <Term id="lsp"/> features specifically, refer to [About dbt LSP](/docs/about-dbt-lsp). To stay up-to-date on the latest features, check out the [Fusion diaries](https://github.com/dbt-labs/dbt-fusion/discussions).

:::tip 
<Constant name="dbt_platform" /> [features](/docs/platform/about-platform/dbt-platform-features) (like [Advanced CI](/docs/deploy/advanced-ci), [dbt <Constant name="mesh" />](/docs/mesh/about-mesh), and more) are the enterprise layer on top of Fusion &mdash; available no matter how you run dbt, depending on your [dbt plan](https://www.getdbt.com/pricing).
:::

## Limitations

If your project uses any of the following, you can still use Fusion, but full migration may not be possible yet:

- Models that rely on materialization features Fusion doesn't fully support, or that need configurations it's still missing
- Tooling that depends on dbt Core v1.x's exact log output &mdash; Fusion's logging system is still unstable and incomplete
- Workflows built around dbt platform features Fusion doesn't yet support, like model-level notifications
- Using the dbt VS Code extension in Cursor's Agent mode &mdash; lineage visualization only renders in Editor mode, so switch there if you need the full lineage tab

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
