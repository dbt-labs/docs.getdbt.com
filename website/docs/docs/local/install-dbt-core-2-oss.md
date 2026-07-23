---
title: Install dbt Core 2.0
id: install-dbt-core-v2
description: "Install dbt Core 2.0, the open-source foundation behind Fusion."
sidebar_label: "Install dbt Core 2.0"
pagination_next: null
pagination_prev: null
---


<VersionBlock lastVersion="1.99">

This page is for installing dbt Core 2.0, the Apache 2.0 open-source distribution of v2. To view the installation instructions, select **v2** from the version picker in the docs navigation. To install dbt Core v1.x, refer to [Install dbt Core v1.x](/docs/local/install-dbt?version=1.12&name=Core).

To upgrade an existing v1 project to v2, refer to [Upgrade to v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2?version=2.0).

To understand the differences between dbt Core v1.x, dbt Core 2.0, and Fusion, refer to [dbt licensing](/docs/dbt-licensing?version=2.0).

</VersionBlock>

<VersionBlock firstVersion="2.0">

:::caution dbt Core 2.0 is in alpha
dbt Core 2.0 is under active development and not recommended for production use. Features and APIs may change before the stable release.
:::

dbt Core 2.0 is the open-source foundation behind Fusion, licensed under Apache 2.0. Most users don't need this page &mdash; [install dbt normally](/docs/local/install-dbt) with the standard instructions. This page is for organizations that require the Apache 2.0 codebase specifically.

## Install

Install the dbt Core 2.0 prerelease with `pip`:

```shell
python -m pip install --pre dbt-core
```

Confirm the installed version begins with `2.`:

```shell
dbt --version
```

During alpha, you must target either the pre-release version or an explicit pin. After install, immediately update to the most recent version:

Explicit pin:

`python -m pip install dbt-core==2.0.0-alpha.1`

For adapter install details, refer to the [`dbt-core` repository](https://github.com/dbt-labs/dbt-core).

## What's included

- The open-source, Rust-based dbt runtime.
- The dbt project language and DAG semantics.
- The standard dbt command set (`run`, `build`, `test`, `compile`, `parse`, and more).

## What's not included

The [standard <Constant name="dbt" /> install](/docs/local/install-dbt) gives you Fusion, which adds the following to dbt Core 2.0:

- SQL comprehension and static analysis
- <Term id="lsp" /> features (autocomplete, hover info, inline errors)
- `dbt lint` and error diagnostics
- dbt VS Code extension integration

For the full picture of what you get with dbt, refer to [Fusion availability](/docs/fusion/fusion-availability).

## Contributing

dbt Core 2.0 is developed in the open. To contribute, refer to the [`dbt-core` repository](https://github.com/dbt-labs/dbt-core) and its [CONTRIBUTING guide](https://github.com/dbt-labs/dbt-core/blob/HEAD/CONTRIBUTING.md), or ask in the [dbt Community](/community/resources/getting-help).

## License

dbt Core 2.0 is licensed under Apache 2.0. Refer to the [LICENSE file](https://github.com/dbt-labs/dbt-core/blob/HEAD/License.md) in the repository. Refer to [dbt licensing](/docs/dbt-licensing?version=2.0) for more info.

## Related

- [Install dbt](/docs/local/install-dbt) (standard install)
- [Upgrade to v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2)
- [`dbt-core` repository on GitHub](https://github.com/dbt-labs/dbt-core)

</VersionBlock>
