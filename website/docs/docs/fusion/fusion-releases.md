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

## Platform Fusion release tracks

On the <Constant name="dbt_platform" />, each [environment](/docs/deploy/deploy-environments) uses a **Fusion release track** you choose (or your account default). Tracks control how often that environment receives new Fusion builds. They are separate from the local CLI channels in the previous section.

For cadence, plan availability, and API values (`fusion-nightly`, `fusion-stable`, and more), see [Fusion release tracks](/docs/dbt-versions/dbt-release-tracks#fusion-release-tracks). To change the track for an environment, follow [Upgrade dbt in dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version).

The table below lists the Fusion build currently associated with each platform Fusion track. dbt updates these pins on the cadence described in the release tracks doc. Refresh this table when release communications go out, or confirm the tag in your account if you need certainty for a change window.

| Release track | API value | Current Fusion version | Last verified | Notes |
| ------------- | --------- | ------------------------ | ------------- | ----- |
| **Fusion Nightly** | `fusion-nightly` | 2.0.0-preview.176 | 2026-05-06 | Nightly cadence; earliest access to new changes |
| **Fusion Stable** (default) | `fusion-stable` | 2.0.0-preview.176 | 2026-05-06 | Weekly cadence; recommended default for most environments |
| **Fusion Extended** | `fusion-extended` | 2.0.0-preview.175 | 2026-05-06 | Monthly cadence; generally lags **Fusion Stable** by about one month |
| **Fusion Fallback** | `fusion-fallback` | 2.0.0-preview.175 | 2026-05-06 | Emergency rollback option; lags **Fusion Extended** by about one month |

:::tip Live data below is for local CLI channels

The **Current versions** cards and full release list below pull the public Fusion manifest used for **local** installs (`dev`, `canary`, `latest`). That feed does not drive the platform Fusion track table above. If a channel tag matches a track tag in practice, that is coincidental for a given week—always use the track table and [release tracks](/docs/dbt-versions/dbt-release-tracks) for platform planning.

:::

<details>
    <summary>Updating local Fusion</summary>
<p>

The following commands apply only to **local** installations of <Constant name="fusion" />. They do not change which Fusion build runs in the <Constant name="dbt_platform" />; there you set a [Fusion release track](/docs/dbt-versions/dbt-release-tracks#fusion-release-tracks) per environment instead.

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
