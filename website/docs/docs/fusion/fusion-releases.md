---
title: "Fusion releases"
id: "fusion-releases"
description: "Track current versions and release history for the dbt Fusion engine across all release channels."
pagination_next: null
pagination_prev: null
---

import FusionReleases from '/src/components/fusionReleases';

# Fusion releases <Lifecycle status="preview" />

Track the current versions and full release history for the <Constant name="fusion_engine" />. Data is fetched live from the dbt release channels.

## Release channels

The <Constant name="fusion_engine" /> is distributed through three release channels:

| Channel | Description | Stability |
|---------|-------------|-----------|
| `latest` | The "known good" stable version | ✅ Recommended for production |
| `canary` | The latest version to be officially released | ⚠️ May be unstable if a different version than `latest` |
| `dev` | The latest development build | ❌ May be unstable |

## Updating Fusion

When you run the system update command without specifying a version, you'll always receive the `latest` stable release:

```shell
dbt system update
```

To install a specific channel or version, pass the `--version` flag:

```shell
dbt system update --version canary    # Install the canary release
dbt system update --version dev       # Install the dev release
dbt system update --version 2.0.0-preview.126     # Install a specific version
```

For more detailed information about each release version, visit the [<Constant name="fusion" /> changelogs](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md)

<FusionReleases />
