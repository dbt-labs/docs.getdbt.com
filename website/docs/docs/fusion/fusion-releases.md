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

<details>
    <summary>Updating Fusion</summary>
<p>
The following instructions are for updating local installations of <Constant name="fusion" />. <Constant name="dbt_platform" /> users automatically get the `latest` updates.

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
