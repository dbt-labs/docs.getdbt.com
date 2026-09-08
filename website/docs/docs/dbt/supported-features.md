---
title: "Supported features"
id: "supported-features"
description: "Feature support and parity information for dbt."
pagination_next: null
pagination_prev: null
---

# Supported features

<IntroText>

Learn about the features supported by dbt v2, including requirements and limitations.

</IntroText>

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';
import FusionDWH from '/snippets/_fusion-dwh.md';

<VersionBlock lastVersion="1.99">

<FusionLifecycle />

</VersionBlock>

When you install dbt, you get v2 by default. There's no separate feature set to choose between &mdash; v2 is just dbt, running faster, with more capability built in.

## Requirements

To use v2 in your project you must:
- Use a supported adapter and authentication method:
  <FusionDWH /> 
- Be able to run your project on the latest version of dbt Core v1.x with no deprecation warnings or errors.
- Migrate your Semantic Layer configurations to the [latest YAML spec](/docs/build/latest-metrics-spec).

## Parity with dbt Core v1.x

dbt v2 supports nearly all of v1.x's capabilities today. Refer to [Limitations](#limitations) below for the small number of gaps that remain.

v2 has also removed some deprecated features and introduced more rigorous validation of erroneous project code compared to v1.x. Refer to the [Upgrade guide](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2) for details.

## Features and capabilities

dbt v2 gives your team faster development workflows with semantic and syntax error detection, a faster linter, column-level lineage, language server and VS Code integration, docs v2 (full), and data diff. The dbt VS Code extension adds editor features like IntelliSense, hover info, and inline errors on top, powered by the <Term id="lsp"/>.

Most v2 features work right away, with no login required. A few more unlock once you sign in with a <Constant name="dbt_platform" /> account &mdash; free to create, no paid plan needed. For the full free-vs-login breakdown, refer to [v2 feature availability](/docs/dbt/dbt-availability). For <Term id="lsp"/> features specifically, refer to [About dbt LSP](/docs/about-dbt-lsp).

:::tip 
<Constant name="dbt_platform" /> [features](/docs/platform/about-platform/dbt-platform-features) (like [Advanced CI](/docs/deploy/advanced-ci), [dbt <Constant name="mesh" />](/docs/mesh/about-mesh), and more) are the enterprise layer on top of v2 &mdash; available no matter how you run dbt, depending on your [dbt plan](https://www.getdbt.com/pricing).
:::

## Limitations

If your project uses any of the following, you can still use dbt v2, but full migration may not be possible yet:

- Models that rely on materialization features v2 doesn't fully support, or that need configurations it's still missing
- Tooling that depends on v1.x's exact log output &mdash; v2's logging system is still unstable and incomplete
- Workflows built around dbt platform features v2 doesn't yet support, like model-level notifications
- Using the dbt VS Code extension in Cursor's Agent mode &mdash; lineage visualization only renders in Editor mode, so switch there if you need the full lineage tab

import FusionFeatures from '/snippets/_fusion-missing-features.md';

<FusionFeatures />

## Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
