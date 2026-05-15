---
title: "Fusion releases"
id: "fusion-releases"
description: "Track current versions and release history for the dbt Fusion engine."
pagination_next: null
pagination_prev: null
---

import FusionReleases from '/src/components/fusionReleases';

# Fusion releases <Lifecycle status="preview" />

:::note Fusion availability

This page shows release information for local builds of <Constant name="fusion" /> only. <Constant name="fusion" /> releases on the <Constant name="dbt_platform" /> adhere to the [release tracks](/docs/dbt-versions/dbt-release-tracks) categories, giving you control over release cadence and stability.

:::

Track current versions and full release history for the <Constant name="fusion_engine" />. This data updates live from dbt release channels.

Each of the versions on this page links to the matching section in the [dbt Fusion changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md) on GitHub.

## Release channels

The <Constant name="fusion_engine" /> is distributed through three release channels:

| Channel | Description | Stability |
|---------|-------------|-----------|
| `latest` | The known `good` stable version | ✅ Recommended for production |
| `canary` | The latest version to be officially released | ⚠️ Most recent stable version but still undergoing thorough testing |
| `dev` | The latest development build | ❌ May be unstable; may not have passed all internal tests |

## dbt platform Fusion release tracks

On <Constant name="dbt_platform" />, each [environment](/docs/deploy/deploy-environments) uses the account default or your chosen **Fusion release track**. Release tracks control how often that environment receives new Fusion builds. They're separate from the local CLI release channels in the previous section.

For cadence, plan availability, and API values (`fusion-nightly`, `fusion-stable`, and more), refer to [Fusion release tracks](/docs/dbt-versions/dbt-release-tracks#fusion-release-tracks). To change the release track for an environment, follow [Upgrade dbt in dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version).

:::tip Live data below is for local CLI channels

The **Current versions** cards and full release list below pull the public <Constant name="fusion" /> manifest used for _local_ installs (`dev`, `canary`, `latest`). You should use [release tracks](/docs/dbt-versions/dbt-release-tracks) for <Constant name="dbt_platform" /> planning.

:::

<details>
    <summary>Updating local Fusion</summary>
<p>

The following commands apply only to _local_ installations of <Constant name="fusion" />. They don't affect which <Constant name="fusion" /> build your <Constant name="dbt_platform" /> environments use. Instead, you can set a [Fusion release track](https://github.com/docs/dbt-versions/dbt-release-tracks#fusion-release-tracks) per environment in <Constant name="dbt_platform" />.

Running the system update command without a version flag installs the `latest` stable release:

```shell
dbt system update
```

To install a specific channel or version, pass the `--version` flag:

```shell
dbt system update --version canary    # Install the canary release
dbt system update --version dev       # Install the dev release
dbt system update --version 2.0.0-preview.126     # Install a specific version
```

</p>

</details>

<FusionReleases />
