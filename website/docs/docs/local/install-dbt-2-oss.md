---
title: Install dbt open source v2
id: install-dbt-v2
description: "Install open source dbt v2, the open-source foundation behind Fusion."
sidebar_label: "Install open source dbt v2"
pagination_next: null
pagination_prev: null
availability: local_free
---


<VersionBlock lastVersion="1.99">

This page is for installing <Constant name="core_v2" />, the Apache 2.0 open-source distribution of v2. To view the installation instructions, select **v2** from the version picker in the docs navigation. To install <Constant name="core_v1" />, refer to [Install <Constant name="core_v1" />](/docs/local/install-dbt?version=1.12).

To upgrade an existing v1 project to v2, refer to [Upgrade to v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2.0).

To understand the differences between <Constant name="core_v1" />, <Constant name="core_v2" />, and <Constant name="fusion" />, refer to [dbt licensing](/docs/dbt-licensing?version=2.0).

</VersionBlock>

<VersionBlock firstVersion="2.0">

:::caution <Constant name="core_v2" /> is in beta
<Constant name="core_v2" /> is under active development and not recommended for production use. Features and APIs may change before the stable release.
:::

<Constant name="core_v2" /> is the open-source foundation behind <Constant name="fusion" />, licensed under Apache 2.0. Most users don't need this page &mdash; [install dbt normally](/docs/local/install-dbt) with the standard instructions. This page is for organizations that require the Apache 2.0 codebase specifically.

## Install

Install the <Constant name="core_v2" /> prerelease with `pip`:

```shell
python -m pip install --pre dbt-core
```

Confirm the installed version begins with `2.`:

```shell
dbt --version
```

During beta, you must target either the pre-release version or an explicit pin. After install, immediately update to the most recent version:

Explicit pin:

`python -m pip install dbt-core==2.0.0rc1`

For adapter install details, refer to the [`dbt-core` repository](https://github.com/dbt-labs/dbt-core).

## What's included

- The open-source, Rust-based dbt runtime.
- The dbt project language and DAG semantics.
- The standard dbt command set (`run`, `build`, `test`, `compile`, `parse`, and more).

## What's not included

The [standard <Constant name="dbt" /> install](/docs/local/install-dbt) gives you <Constant name="fusion" />, which adds the following to <Constant name="core_v2" />:

- SQL comprehension and static analysis
- <Term id="lsp" /> features (autocomplete, hover info, inline errors)
- `dbt lint` and error diagnostics
- dbt VS Code extension integration

For the full picture of what you get with dbt, refer to [Fusion availability](/docs/dbt/dbt-availability).

## Contributing

<Constant name="core_v2" /> is developed in the open. To contribute, refer to the [`dbt-core` repository](https://github.com/dbt-labs/dbt-core) and its [CONTRIBUTING guide](https://github.com/dbt-labs/dbt-core/blob/HEAD/CONTRIBUTING.md), or ask in the [dbt Community](/community/resources/getting-help).

## License

<Constant name="core_v2" /> is licensed under Apache 2.0. Refer to the [LICENSE file](https://github.com/dbt-labs/dbt-core/blob/HEAD/LICENSE) in the repository. Refer to [dbt licensing](/docs/dbt-licensing?version=2.0) for more info.

## Related

- [Install dbt](/docs/local/install-dbt) (standard install)
- [Upgrade to v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2)
- [`dbt-core` repository on GitHub](https://github.com/dbt-labs/dbt-core)

</VersionBlock>
