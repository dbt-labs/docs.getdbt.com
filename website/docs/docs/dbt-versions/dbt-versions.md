---
title: "About dbt versions"
id: "dbt-versions"
description: "Learn about semantic versioning for dbt engines, and how long those versions are supported."
pagination_next: "docs/dbt-versions/upgrade-dbt-platform-version"
pagination_prev: null
availability: all_users
---

dbt v2 is the current generation of dbt and uses the 2.x release series. dbt v1 is the Python-based generation and stays on the 1.x series. Both follow semantic versioning. This page covers versioning for local dbt installations.

v2 ships in two distributions. Install dbt v2 for the full, recommended experience. If your organization has a strict requirement for an Apache 2.0 licensed runtime, install dbt OSS instead. For more information, refer to [dbt licensing](/docs/dbt-licensing).

If you're using the <Constant name="dbt_platform" /> (including the <Constant name="platform_cli"/>), you don't need to manage dbt versions yourself. [Release tracks](/docs/dbt-versions/dbt-release-tracks) automatically keep you up to date and provide early access to new features.

## <Constant name="fusion_engine" /> versioning

<Constant name="fusion_engine"/> uses semantic versioning starting with version 2.0. To install or update <Constant name="fusion"/>, see [Install dbt](/docs/local/install-dbt?version=2).

### Latest release

| dbt v2 | Initial release | Support level and end date |
|:---:|:---:|:---:|
| [**v2.0**](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2) | Sept 14, 2026 | **Active support &mdash; Sept 13, 2027** |

### Semantic versioning

<Constant name="fusion" /> follows [semantic versioning](https://semver.org/):

- **Major versions** (for example, v2 to v3) may include breaking changes. Deprecated functionality will stop working.
- **Minor versions** (for example, v2.0 to v2.1) add features and are backwards compatible. They will not break project code that relies on documented functionality. Any deliberate behavior change ships behind a [behavior change flag](/reference/global-configs/behavior-changes), and we give advanced notice before the default flag value flips.
- **Patch versions** (for example, v2.0.0 to v2.0.1) include fixes only: bug fixes, security fixes, or installation fixes.

### Types of changes

Changes to the v2 engine fall into three categories:

- **New features**: Net new capabilities, frequently with new YAML configs or flags. As these are new features that require additional configuration, they will not break existing projects.
- **Non-breaking improvements**: Optimizations, feature improvements, bug fixes, or security patches that are not expected to break a deployment with automatic upgrades. They roll out continuously and are sometimes [backported](#backports) to previous minor versions.
- **Behavior changes** are deliberate,but breaking, changes to existing behavior. They're released behind a [behavior change flag](/reference/global-configs/behavior-changes). The flag starts opt-in (default `false`), and later becomes the default so the new behavior applies to everyone.

### Prerelease stages and the release cycle {#prerelease-stages}

Each v2 minor version moves through three prerelease stages before it reaches GA and becomes stable:

| Stage | What can change |
|-------|-----------------|
| **Alpha** | Any change is acceptable. New behavior change flags can be introduced, and existing flags can be flipped so the new behavior is the default. |
| **Beta** | Most changes are acceptable. New behavior change flags can be introduced, but existing flags cannot be flipped to default. |
| **Release candidate (RC)** | Considered to be ready for GA, so this stage acts as a code freeze. Only small, non-breaking patches land. No new behavior change flags and no default flips. |

Each minor version starts at its first alpha (for example, `2.1.0a1`). Successive alpha releases build toward beta, then RC, and finally GA. When a minor version reaches GA, the first alpha of the next minor version opens, cut from the latest nightly build.

```txt
2.x.0a1  → a2  → …   Bigger changes and behavior-default flips
              ↓
2.x.0b1  → b2  → …   More improvements; no default flips
              ↓
2.x.0rc1 → rc2 → …   Small, non-breaking patches
              ↓
2.x.0 GA             Stable release
              └──────→ 2.x+1.0a1 opens immediately
```

Because default flag flips only occur during alpha, the behavior defaults of a minor version are settled by the time it reaches beta. This gives you time to test and prepare before GA. For the current prerelease, refer to [dbt releases](/docs/dbt/dbt-releases).

### Backports {#backports}

A backport is a patch made to a previous minor version of dbt. Backports are made only when explicitly requested or when a security patch is identified internally or externally. A backport contains only the fix, not other updates made to the newer minor version.

For example, suppose a fix is first released in a prerelease of the next minor version (2.x). If it's backported, it also ships as a new patch of the current minor version, which contains only that fix.

### Release channels

<Constant name="fusion" /> is distributed through release channels:

| Channel | Description | Stability |
|---------|-------------|-----------|
| `latest` | The stable, "known good" version | ✅ Recommended for most users |
| `canary` | The latest officially released version | ⚠️ Most recent stable version but still undergoing thorough testing |
| `dev` | The latest development build | ❌ May not have passed all tests |

Run `dbt system update` to get the latest stable release, or specify a channel with `dbt system update --version canary`.

For current versions and release history, see [<Constant name="fusion"/> releases](/docs/dbt/dbt-releases).

### Checking your version

Run `dbt --version` to check your installed version:

```
$ dbt --version
dbt v2 2.0.0
```

### Further reading

- [Install <Constant name="fusion"/>](/docs/local/install-dbt?version=2): Install or update <Constant name="fusion_engine" />.
- [<Constant name="fusion"/> releases](/docs/dbt/dbt-releases): View current versions and release history.
- [Get started with <Constant name="fusion"/>](/docs/dbt/get-started-dbt): Learn about <Constant name="fusion" /> features and migration.

## <Constant name="core" /> versioning

The <Constant name="core"/> engine uses semantic versioning for the 1.x release series. To install or update <Constant name="core"/>, see [Install dbt](/docs/local/install-dbt?version=1).

<Snippet path="core-version-support" />

<Snippet path="core-versions-table" />

### How <Constant name="core" /> uses semantic versioning {#how-dbt-v1-uses-semantic-versioning}

dbt follows [semantic versioning](https://semver.org/):

- **Major versions** (for example, v1 to v2) may include breaking changes. Deprecated functionality will stop working.
- **Minor versions** (for example, v1.8 to v1.9) add features and are backwards compatible. They will not break project code that relies on documented functionality.
- **Patch versions** (for example, v1.8.0 to v1.8.1) include fixes only: bug fixes, security fixes, or installation fixes.

We are committed to avoiding breaking changes in minor versions for end users of dbt. There are two types of breaking changes that may be included in minor versions:

- Changes to the Python interface for adapter plugins. These changes are relevant only to adapter maintainers, and they will be clearly communicated in documentation and release notes. For more information, refer to [Build, test, document, and promote adapters guide](/guides/adapter-creation).

- Changes to metadata interfaces, including [artifacts](/docs/deploy/artifacts) and [logging](/reference/events-logging), signalled by a version bump. Those version upgrades may require you to update external code that depends on these interfaces, or to coordinate upgrades between dbt orchestrations that share metadata, such as [state-powered selection](/reference/node-selection/syntax#about-node-selection).

### Adapter plugin versions

dbt releases `dbt-core` and adapter plugins (such as `dbt-snowflake`) independently. Their minor and patch version numbers may not match, but they coordinate through the `dbt-adapters` interface so you won't get a broken experience. For example, `dbt-core==1.8.0` can work with `dbt-snowflake==1.9.0`.

If you're building or maintaining an adapter, refer to the [adapter creation guide](/guides/adapter-creation) for details on the `dbt-adapters` interface.

Run `dbt --version` to check your installed versions:

```
$ dbt --version
Core:
  - installed: 1.8.0
  - latest:    1.8.0 - Up to date!

Plugins:
  - snowflake: 1.9.0 - Up to date!
```

You can also find the registered adapter version in [logs](/reference/global-configs/logs). For example, in `logs/dbt.log`:

```
[0m13:13:48.572182 [info ] [MainThread]: Registered adapter: snowflake=1.9.0
```

Refer to [Supported data platforms](/docs/supported-data-platforms) for the full list of adapters.


### Further reading

- [Choosing a <Constant name="core" /> version in <Constant name="dbt" />](/docs/dbt-versions/upgrade-dbt-platform-version): Learn how to use <Constant name="core" /> versions in <Constant name="dbt" />.
- [Install <Constant name="core" />](/docs/local/install-dbt?version=1): Install or update <Constant name="core" />.
- [`require-dbt-version`](/reference/project-configs/require-dbt-version) and [`dbt_version`](/reference/dbt-jinja-functions/dbt_version): Restrict your project to work with a specific range of versions.

## End-of-life versions

:::info

On <Constant name="legacy_deprecation_date" />, <Constant name="dbt" /> versions v1.3-v1.7 will be deprecated and removed from availability in <Constant name="dbt_platform" />. Upgrade any environments still on these versions to a supported version or a [release track](/docs/dbt-versions/dbt-release-tracks) before then.

:::

Once a dbt version reaches end-of-life (EOL), it no longer receives patches, including for known bugs. We recommend upgrading to a newer version in [<Constant name="dbt" />](/docs/dbt-versions/upgrade-dbt-platform-version), [<Constant name="fusion" />](/docs/local/install-dbt?version=2), or [<Constant name="core" />](/docs/local/install-dbt). All versions prior to v1.0 have been deprecated.

## Current version support

dbt supports each minor version (for example, v1.8) for _one year_ from its initial release. During that window, we release patches with bug fixes and security updates. When we refer to a minor version, we mean its latest available patch (v1.8.x).

After a newer minor version ships, the previous one transitions to **critical support** (security and installation fixes only) for the remainder of its one-year window. After the one-year window ends, the version reaches **end of life** and no longer receives patches.

While a minor version is officially supported:
- You can use it in <Constant name="dbt" />. For more on <Constant name="dbt" /> versioning, see [Choosing a dbt version](/docs/dbt-versions/upgrade-dbt-platform-version).
- You can select it from the version dropdown on this website to see documentation that is accurate for use with that minor version.

## Upgrading

Upgrade to new patch versions as soon as they're available. Upgrade to new minor versions when you're ready because you can only get some features and fixes on the latest minor version.

dbt makes all versions available as prereleases before the final release. For minor versions, we aim to release one or more betas 4+ weeks before the final release so you can try new features and share feedback. Release candidates are available about two weeks before the final release for testing in production-like environments. Refer to the [`dbt-labs/dbt` milestones](https://github.com/dbt-labs/dbt/milestones) for details.


