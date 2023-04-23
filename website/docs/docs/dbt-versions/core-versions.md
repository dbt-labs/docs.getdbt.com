---
title: "About dbt Core versions"
id: "core"
description: "Learn about semantic versioning for dbt Core, and how long those versions are supported."
---

dbt Core releases follow [semantic versioning](https://semver.org/) guidelines. For more on how we use semantic versions, see [How dbt Core uses semantic versioning](#how-dbt-core-uses-semantic-versioning).

<Snippet src="core-versions-table" />

### Further reading

- To learn how you can use dbt Core versions in dbt Cloud, see [Choosing a dbt Core version](/docs/dbt-versions/upgrade-core-in-cloud).
- To learn about installing dbt Core, see "[How to install dbt Core](/docs/core/installation)."
- To restrict your project to only work with a range of dbt Core versions, or use the currently running dbt Core version, see [`require-dbt-version`](require-dbt-version) and [`dbt_version`](dbt_version).

## Version support prior to v1.0

All dbt Core versions released prior to 1.0 and their version-specific documentation have been deprecated. If upgrading to a currently supported version, reference our [best practices for upgrading](#best-practices-for-upgrading)

## Current version support

### Minor versions

Minor versions include new features and capabilities. They will be supported for one year from their initial release date. _dbt Labs is committed to this 12-month support timeframe._ Our mechanism for continuing to support a minor version is by releasing new patches: small, targeted bug fixes. Whenever we refer to a minor version, such as v1.0, we always mean its latest available patch release (v1.0.x).

While a minor version is officially supported:
- You can use it in dbt Cloud. For more on dbt Cloud versioning, see [Choosing a dbt version](/docs/dbt-versions/upgrade-core-in-cloud).
- You can select it from the version dropdown on this website, to see documentation that is accurate for use with that minor version.

### Ongoing patches

During the 12-month support window, we will continue to release new patch versions that include fixes.

**Active Support:** In the first few months after a minor version's initial release, we will patch it with "bugfix" releases. These will include fixes for regressions and net-new bugs that were present in the minor version's original release.

**Critical Support:** When a newer minor version is available, we will transition the previous minor version into "Critical Support." Subsequent patches to that older minor version will be "security" releases only, limited to critical fixes related to security and installation.

After a minor version reaches the end of its critical support period, one year after its initial release, no new patches will be released.

### Future versions

We aim to release a new minor "feature" every 3 months. _This is an indicative timeline ONLY._ For the latest information about upcoming releases, including their planned release dates and which features and fixes might be included in each, always consult the [`dbt-core` repository milestones](https://github.com/dbt-labs/dbt-core/milestones).

## Best practices for upgrading

Because of our new version practice, we've outlined best practices and expectations for dbt users to upgrade as we continue to release new versions of dbt Core.

### Upgrading to new patch versions

We expect users to upgrade to patches as soon as they're available. When we refer to a "minor version" of dbt Core, such as v1.0, we are always referring to the latest available patch release for that minor version. We encourage you to structure your development and production environments so that you can always install the latest patches of `dbt-core` and any adapter plugins. (Note that patch numbers may be different between dbt-core and plugins. [See below](#how-we-version-adapter-plugins) for an explanation.)

### Upgrading to new minor versions

During the official support period, minor versions will remain available in dbt Cloud and the version dropdown on the docs site. While we do not expect users to immediately upgrade to newer minor versions as soon as they're available, there will always be some features and fixes only available for users of the latest minor version.

### Trying prereleases

All dbt Core versions are available as _prereleases_ before the final release. "Release candidates" are available for testing, in production-like environments, two weeks before the final release. For minor versions, we also aim to release one or more "betas," which include new features and invite community feedback, 4+ weeks before the final release. It is in your interest to help us test prereleases—we need your help!

## How dbt Core uses semantic versioning

Like many software projects, dbt Core releases follow [semantic versioning](https://semver.org/), which defines three types of version releases.

- **Major versions:** To date, dbt Core has had one major version release: v1.0.0. When v2.0.0 is released, it will introduce new features, and functionality that has been announced for deprecation will stop working.
- **Minor versions**, also called "feature" releases, include a mix of new features, behind-the-scenes improvements, and changes to existing capabilities that are **backwards compatible** with previous minor versions. They will not break code in your project that relies on documented functionality.
- **Patch versions**, also called "bugfix" or "security" releases, include **fixes _only_**. These fixes could be needed to restore previous (documented) behavior, fix obvious shortcomings of new features, or offer critical fixes for security or installation issues. We are judicious about which fixes are included in patch releases, to minimize the surface area of changes.

We are committed to avoiding breaking changes in minor versions for end users of dbt. There are two types of breaking changes that may be included in minor versions:

- Changes to the [Python interface for adapter plugins](/guides/dbt-ecosystem/adapter-development/3-building-a-new-adapter). These changes are relevant _only_ to adapter maintainers, and they will be clearly communicated in documentation and release notes.
- Changes to metadata interfaces, including [artifacts](dbt-artifacts) and [logging](events-logging), signalled by a version bump. Those version upgrades may require you to update external code that depends on these interfaces, or to coordinate upgrades between dbt orchestrations that share metadata, such as [state-powered selection](/docs/deploy/about-state).

### How we version adapter plugins

When you use dbt, you use a combination of `dbt-core` and an adapter plugin specific to your database. You can see the current list in [Supported Data Platforms](supported-data-platforms). Both `dbt-core` and dbt adapter plugins follow semantic versioning.

`dbt-core` and adapter plugins coordinate new features and behind-the-scenes changes in minor releases. When fixing bugs, sooner is better, so patch versions are released independently for `dbt-core` and plugins.

That means that patch version numbers will likely differ between `dbt-core` and the adapter plugin(s) you have installed. However, major and minor version numbers should always match.

For example, you may find you're using `dbt-core==1.2.3` with `dbt-snowflake==1.2.0`. It is critical that you're using the latest patch available for both core and the adapter (v1.2.x). Use the `dbt --version` command to see which versions you have installed:
```
$ dbt --version
installed version: 1.2.3
   latest version: 1.2.3

Up to date!

Plugins:
  - snowflake: 1.2.0 - Up to date!
```
It's likely that newer patches have become available since then, so it's always important to check and make sure you're up to date!
