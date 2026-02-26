---
title: "About dbt Core versions"
id: "core"
description: "Learn about semantic versioning for dbt Core, and how long those versions are supported."
pagination_next: "docs/dbt-versions/upgrade-dbt-version-in-cloud"
pagination_prev: null
---

Learn about versioning for the <Constant name="core"/> engine (Python-based CLI). If you run the <Constant name="core"/> engine locally (for example, using `pip`), then this page is for you. <Constant name="core"/> releases follow [semantic versioning](https://semver.org/).

If you're using <Constant name="dbt_platform" /> (including the <Constant name="cloud_cli"/>, you don't need to manage dbt versions yourself. [Release tracks](/docs/dbt-versions/cloud-release-tracks) automatically keep you up to date and provide early access to new features before they’re available in <Constant name="core" />.

:::note
If you want to use the <Constant name="fusion_engine"/>, locally or in <Constant name="dbt_platform"/>, then read [Get Started](/docs/local/install-dbt?version=2).
:::

If you manage your own <Constant name="core" /> versions locally, read on. <Constant name="core" /> releases follow [semantic versioning](https://semver.org/).

<Snippet path="core-version-support" />

<Snippet path="core-versions-table" />

### Further reading

- [Choosing a <Constant name="core" /> version in <Constant name="cloud" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud): Learn how you can use <Constant name="core" /> versions in <Constant name="cloud" />.
- [How to install <Constant name="core" />](/docs/local/install-dbt): Learn about installing <Constant name="core" />.
- [`require-dbt-version`](/reference/project-configs/require-dbt-version) and [`dbt_version`](/reference/dbt-jinja-functions/dbt_version): Restrict your project to only work with a range of <Constant name="core" /> versions, or use the currently running version.

## End-of-life versions

Once a <Constant name="core" /> version reaches end-of-life (EOL), it no longer receives patches, including for known bugs. We recommend upgrading to a newer version in [<Constant name="cloud" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud) or [<Constant name="core" />](/docs/local/install-dbt#upgrading-dbt-core). All versions prior to v1.0 have been deprecated.

## Current version support

dbt supports each minor version (for example, v1.8) for _one year_ from its initial release. During that window, we release patches with bug fixes and security updates. When we refer to a minor version, we mean its latest available patch (v1.8.x).

After a newer minor version ships, the previous one transitions to **critical support** (security and installation fixes only) for the remainder of its one-year window. After the one-year window ends, the version reaches **end of life** and no longer receives patches.

While a minor version is officially supported:
- You can use it in <Constant name="cloud" />. For more on <Constant name="cloud" /> versioning, see [Choosing a dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud).
- You can select it from the version dropdown on this website, to see documentation that is accurate for use with that minor version.

For upcoming releases, refer to the [`dbt-core` milestones](https://github.com/dbt-labs/dbt-core/milestones).

## Upgrading

Upgrade to new patch versions as soon as they're available. Upgrade to new minor versions when you're ready because you can only get some features and fixes on the latest minor version.

dbt makes all versions available as prereleases before the final release. For minor versions, we aim to release one or more betas 4+ weeks before the final release so you can try new features and share feedback. Release candidates are available about two weeks before the final release for testing in production-like environments. Refer to the [`dbt-core` milestones](https://github.com/dbt-labs/dbt-core/milestones) for details.

## How dbt Core uses semantic versioning

<Constant name="core" /> follows [semantic versioning](https://semver.org/):

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
