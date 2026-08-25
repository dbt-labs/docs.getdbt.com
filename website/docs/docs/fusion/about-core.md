---
title: "About dbt Core"
sidebar_label: "About dbt Core"
id: "about-core"
description: "Learn what dbt Core is and when to use it."
---

# About <Constant name="core" />

<IntroText>
Transform raw warehouse data into trusted data products with <Constant name="core" />.
</IntroText>

<VersionBlock firstVersion="2.0">

:::tip You selected v2
v2 is the faster, Rust-powered way to develop with dbt locally. You can get started with many features right away, free forever. Run `dbt login` to unlock additional capabilities with a free <Constant name="dbt_platform" /> account.
:::

<Constant name="core" /> is the open-source runtime and CLI foundation for the dbt framework. It supports the dbt language you write in your project &mdash; including SQL, Jinja, YAML configuration, tests, and more &mdash; and provides the runtime for compiling your project, executing your transformation graph, and producing metadata.

In v2, <Constant name="core_v2" /> provides the Apache 2.0 open-source foundation for local dbt development. For most people, the best way to get started is to [install dbt](/docs/local/install-dbt), which gives you the recommended v2 experience from the command line.

Pair v2 with the [dbt VS Code extension](/docs/about-dbt-extension) for autocomplete, inline errors, and lineage as you work. You can also run `dbt login` to unlock additional account-enabled capabilities in your editor and local workflow by creating a free dbt account!


</VersionBlock>

<VersionBlock lastVersion="1.99">

<Constant name="core_v1" /> is the original Python-based, Apache 2.0 implementation of <Constant name="core" /> and remains fully supported.

Use <Constant name="core_v1" /> if you have an older project that isn't ready to move to v2, or if you need compatibility with existing tooling, packages, or workflows that haven't moved to v2 yet.

Over time, new capabilities will land in v2 only, so most people will eventually want to upgrade. When you're ready, we recommend checking out the [Upgrade to v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2) guide.

To install or continue using v1.x, see [Install <Constant name="core_v1" />](https://docs.getdbt.com/docs/local/install-dbt?version=1.12).

</VersionBlock>

For more information about licensing, refer to [dbt licensing](/docs/dbt-licensing). To learn how to contribute, refer to the [<Constant name="core" /> repo](https://github.com/dbt-labs/dbt-core).
