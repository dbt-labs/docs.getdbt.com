---
title: "dbt-releases"
id: "dbt-releases"
sidebar_label: "dbt releases"
description: "Track current versions and release history for v2."
pagination_next: null
pagination_prev: null
---

import FusionReleases from '/src/components/fusionReleases';

# Self-hosted dbt releases <Lifecycle status="preview" />

This page shows release information for local builds of dbt v2 only. v2 releases on the <Constant name="dbt_platform" /> adhere to the [release tracks](/docs/dbt-versions/dbt-release-tracks) categories, giving you control over release cadence and stability.

Track current versions and full release history for dbt v2. This data updates live from dbt release channels.

Each of the versions on this page links to the matching section in the [dbt v2 changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG-fusion.md) on GitHub.

## Release channels

dbt v2 is distributed through three release channels:

| Channel | Description | Stability |
|---------|-------------|-----------|
| `latest` | The known `good` stable version | ✅ Recommended for production |
| `canary` | The latest version to be officially released | ⚠️ Most recent stable version but still undergoing thorough testing |
| `dev` | The latest development build | ❌ May be unstable; may not have passed all internal tests |

## Known-bad releases

If a shipped v2 release is later found to contain a regression, dbt Labs flags it as a known-bad release. If you have a flagged version installed, the dbt VS Code extension shows a warning notification telling you which version to update to. To move off a flagged version, update it using your installation method (for example, pip or Homebrew). For details, including how air-gapped users receive these notifications, refer to [Known-bad releases](/docs/dbt-versions/dbt-version-compatibility#known-bad-releases).

## dbt platform release tracks

On <Constant name="dbt_platform" />, each [environment](/docs/deploy/deploy-environments) uses the account default or your chosen **release track**. Release tracks control how often that environment receives new v2 builds. They're separate from the local CLI release channels in the previous section.

For cadence, plan availability, and API values (`nightly`, `stable`, and more), refer to [release tracks](/docs/dbt-versions/dbt-release-tracks#fusion-release-tracks). To change the release track for an environment, follow [Upgrade dbt in dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version).

:::tip Live data below is for local CLI channels

The **Current versions** cards and full release list below pull the public v2 manifest used for _local_ installs (`dev`, `canary`, `latest`). You should use [release tracks](/docs/dbt-versions/dbt-release-tracks) for <Constant name="dbt_platform" /> planning.

:::

<details>
    <summary>Updating your self-hosted installation</summary>
<p>

The following commands apply only to _local_ installations of dbt. They don't affect which v2 build your <Constant name="dbt_platform" /> environments use. Instead, you can set a [release track](https://github.com/docs/dbt-versions/dbt-release-tracks#fusion-release-tracks) per environment in <Constant name="dbt_platform" />.

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
