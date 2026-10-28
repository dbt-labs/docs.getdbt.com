---
title: "Release tracks in dbt platform"
sidebar_label: "About release tracks"
id: "dbt-release-tracks"
description: "Learn how to get automatic upgrades to dbt in the dbt platform. Access new features and enhancements as soon as they become available."
availability: platform_login
---

New capabilities in the dbt framework are delivered continuously to <Constant name="dbt_platform" />. Your projects and environments are upgraded automatically on a cadence that you choose, depending on your <Constant name="dbt" /> plan.

## Which release tracks are available?

The release tracks available for your project vary depending on the major version of dbt.

### dbt v2 release tracks

The <Constant name="dbt_platform" /> has five <Constant name="fusion" /> release tracks available to give you control over stability vs. velocity.

_`v2 Stable` is the default for all new <Constant name="fusion" />-powered projects._

| Release track | Updates | Description | [Plan availability](https://www.getdbt.com/pricing) | API value |
| ------------- | ------- | ----------- | ----------------- | --------- |
| **v2 Nightly** | Nightly | A new build cut from `main` every night, versioned by build date (for example, `2.x.0.dev20261022`). Includes early access to new features. | All plans. See [dbt releases](/docs/dbt/dbt-releases) for current version. | `fusion-nightly` |
| **v2 Preview** | Weekly | The most recent prerelease (alpha, beta, or release candidate) of the next minor version. Each week the prerelease is incremented (for example, `2.x-alpha.1` to `2.x-alpha.2`). When a release candidate reaches general availability (GA), Preview moves to `alpha.1` of the next minor version. Use it to test upcoming changes before they reach Stable. For what can change at each stage, refer to [Prerelease stages](/docs/dbt-versions/dbt-versions#prerelease-stages). | TBD | TBD |
| **v2 Stable** (default) | Each new minor version GA | The latest generally available minor version, including its patches. Balances stability and feature access. | All plans | `fusion-stable` |
| **v2 Extended** | Each new minor version GA | The previous minor version, including its patches. When a new minor version reaches GA, Extended moves to the previous minor version. Designed for those who want maximum stability and additional testing time. | Enterprise, Enterprise+ | `fusion-extended` |
| **v2 Fallback** | Each new minor version GA | The minor version two back (N-2), including its patches. Emergency rollback option for account admins. | Enterprise+ | `fusion-fallback` |


### <Constant name="core" /> release tracks {#dbt-v1-release-tracks}

| Release track | Description | Plan availability | API value |
| ------------- | ----------- | ----------------- | --------- |
| **v1 Latest** | Provides a continuous release of the latest functionality in the <Constant name="dbt_platform" /> .<br /><br />Includes early access to new features of the dbt framework before they're available in <Constant name="core" />. | All plans | `latest` |
| **v1 Compatible** | Provides a monthly release aligned with the most recent open source versions of <Constant name="core" /> and adapters, plus functionality exclusively available in the dbt platform.<br /><br />See [v1 Compatible track changelog](/docs/dbt-versions/compatible-track-changelog) for more information. |  Starter, Enterprise, Enterprise+ | `compatible` |
| **v1 Extended** | The previous month's **v1 Compatible** release. | Enterprise, Enterprise+ | `extended` |
| **v1 Fallback** | The previous month's **v1 Extended** release. | Enterprise+ | `fallback` |

### API release tracks

:::note API naming differences

API release track names differ from the names in the UI. They still use legacy names. We plan to add aliases for the new names soon. We'll notify customers when those are available and update this page.

Names prefixed with `fusion` are for v2. Names without that prefix are for v1.

:::

To configure an environment in the [dbt Admin API](/docs/dbt-apis/admin-api) or [Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest) to use a release track, set `dbt_version` to the release track name:
- `fusion-nightly`
- `fusion-stable` (formerly `latest-fusion`)
- `fusion-extended`
- `fusion-fallback`
- `latest`
- `compatible`
- `extended`

## Which release track should I choose?

We recommend that all new projects run dbt v2. Projects still on v1 release tracks are eligible for upgrade to v2 and projects on legacy versions of v1.x should [migrate to release tracks](/guides/migrate-off-legacy-dbt-versions).

### Choosing a dbt v2 release track

Choose **v2 Stable** (the default for new projects) for the latest generally available minor version, which balances stability and feature access. This is the recommended starting point for most customers migrating to <Constant name="fusion_engine" />.

Choose **v2 Nightly** if you want the latest features and are comfortable with a daily release cadence. This track is ideal for teams prioritizing the most recent features.

Choose **v2 Preview** if you want to test the next minor version before it reaches GA, including new experimental features and behavior change flags. Preview is a prerelease track and isn't recommended for production.

Choose **v2 Extended** if your team needs maximum stability and more time to test before updates roll out. This track lags v2 Stable by one minor version and is available for Enterprise and Enterprise+ accounts.

Choose **v2 Fallback** as an emergency measure only. It runs the minor version two back (N-2), so expect more differences from Stable than with Extended. This is a temporary rollback option for Enterprise+ accounts, not for ongoing use.

Account admins can set the org-wide default release track for new projects via a toggle in **Account Settings**. Individual project owners can then override that default per environment.

### Choosing a dbt v1 release track

Choose the **v1 Latest** release track to continuously receive new features, fixes, performance improvements — latest & greatest dbt. This is the default for all customers on <Constant name="dbt" />.

Choose the **v1 Compatible** and **v1 Extended** release tracks if you need a less-frequent release cadence, the ability to test new dbt releases before they go live in production, and/or ongoing compatibility with the latest open source releases of <Constant name="core" />.

### Using the v2 Fallback release track

The **v2 Fallback** release track provides an emergency rollback option for account admins if you suspect a regression in the "v2 Extended" track. This is available only for <Constant name="fusion_engine" /> in Enterprise+ accounts.

1. Go to **Account settings**
2. Click the **Revert to Fallback** release track button in the <Constant name="dbt_platform" /> interface. This is not accessible through environment settings.
3. Fill in the details in the **Revert to Fallback** pop-up to confirm and share information with dbt Support.

Switching to **v2 Fallback** alerts the dbt Support team, who may reach out to help resolve the issue. This track is meant only as a temporary safety option to unblock you and not for ongoing use. Return to "v2 Extended" or "v2 Stable" (<Constant name="fusion" />) / "v1 Compatible" (<Constant name="core" />) once the issue is resolved.
<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-versions/rollback.png" width="80%" title="v2 Fallback release track button in dbt platform"/>

<Lightbox src="/img/docs/dbt-versions/rollback-popup.png" width="80%" title="v2 Fallback release track popup in dbt platform"/>

</DocCarousel>


### Common architectures

#### dbt v2 track architectures

**Default** &mdash; All plans
- Prioritize the latest generally available minor version, which balances stability and new features
- Leave all environments on the **v2 Stable** release track (default for new projects at GA)

**Pre-GA testing** &mdash; All plans
- Prioritize early visibility into upcoming changes, such as behavior change flags and experimental features, before they reach production
- Configure development or test environments to use **v2 Preview**
- Leave production environments on **v2 Stable**

**Velocity-focused** &mdash; All plans
- Prioritize immediate access to the latest v2 features and fixes
- Configure all environments to use the **v2 Nightly** release track

**Cautious** &mdash; Enterprise, Enterprise+
- Prioritize maximum stability and additional testing time
- Configure production environments to use **v2 Extended** (one minor version behind v2 Stable)
- Configure development environments to use **v2 Stable** so developers get access to upcoming changes before they reach production

#### dbt v1 track architectures

**Default** &mdash; Majority of customers on all plans
- Prioritize immediate access to fixes and features
- Leave all environments on the **v1 Latest** release track (default configuration)

**Hybrid** &mdash; Starter, Enterprise, Enterprise+
- Prioritize ongoing compatibility between <Constant name="dbt" /> and <Constant name="core" /> for development & deployment using both products in the same dbt projects
- Configure all environments to use the **v1 Compatible** release track
- Understand that new features will not be available until they are first released in <Constant name="core" /> OSS (several months after the **v1 Latest** release track)

**Cautious** &mdash; Enterprise, Enterprise+, Business Critical
- Prioritize "bake in" time for new features & fixes
- Configure development & test environments to use the **v1 Compatible** release track
- Configure pre-production & production environments to use the **v1 Extended** release track
- Understand that new features will not be available until _a month after_ they are first released in <Constant name="core" /> OSS and the v1 Compatible track. Developers (on **v1 Compatible**) will get access to new features before they can leverage those capabilities in production (on **v1 Extended**), and must be mindful of the additional delay.

**Virtual Private dbt or Single Tenant**
- Changes to all release tracks roll out as part of <Constant name="dbt" /> instance upgrades once per week

## Upgrading from older versions

### How to upgrade {#upgrade-tips}

If you're running a deprecated version of dbt, we recommend that you upgrade or delete your project. For more information about the right path for you, refer to [Migrate off legacy dbt versions](/guides/migrate-off-legacy-dbt-versions).

We recommend you start upgrading projects that are smaller, newer, or more familiar for your team first. They'll be faster and easier to troubleshoot and enable you to more efficiently migrate complex projects.

### Considerations

To learn more about how dbt Labs deploys stable dbt upgrades in a safe manner to <Constant name="dbt" />, we recommend that you read our blog post: [How we're making sure you can confidently switch to the \"Latest\" release track in <Constant name="dbt" />](/blog/latest-dbt-stability).


<Expandable alt_header="I'm using an older version of dbt in the dbt platform. What should I do? What happens if I do nothing?" >

If you're on version v1.3-v1.7, you need to follow the path for your project(s) as outlined in [Migrate off legacy versions](/guides/migrate-off-legacy-dbt-versions). If you have not migrated by January 31, 2027, you will lose access to these projects. If you have any questions or concerns, please [contact support](/docs/dbt-support) 

</Expandable>

<Expandable alt_header="What are other known issues when upgrading from older v1 versions?" >

If you are upgrading from a very old unsupported version of <Constant name="core" />, you may run into one of these edge cases after the upgrade to a newer version:

- [v1.3] Customers with non-dbt `.py` files defined within their project directories, such as `models/`. Since v1.3, dbt expects these files be valid [Python models](/docs/build/python-models). The customer needs to move these files out of their `models/` directory, or ignore them via `.dbtignore`
- [v1.5] Customers who have `--m` in their job definitions, instead of `-m` or `--models`. This autocompletion (`--m[odels]` for `--models`) has never been officially documented or supported. It was an implicit behavior of argparse (CLI library used in dbt-core v1.0-1.4) that is not supported by `click` (the CLI library used in dbt-core since v1.5+).
- [v1.5] Empty invalid `tests` config start raising a validation error](/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.5). Replace empty `tests` config with `tests: []` or remove it altogether.
- [v1.6] Performance optimization to `load_result` means you cannot call it on the same query result multiple times. Instead, save it to a local variable once, and reuse that variable (context: [dbt-labs/dbt#7371](https://github.com/dbt-labs/dbt/pull/7371)

You should [contact dbt support](/docs/dbt-support#dbt-cloud-support) to request an extension, during which you will need to make those updates.

</Expandable>

<Expandable alt_header="I see that my account was migrated to v1 Latest. What should I do" >

For the vast majority of customers, there is no further action needed.

If you see new failures in your scheduled jobs now that they are running on a newer version of dbt, you may need to update your project code to account for one of the edge cases described on this page. You should [contact dbt support](/docs/dbt-support#dbt-cloud-support) to request an extension, during which you will need to make those updates.

</Expandable>

<Expandable alt_header="What about breaking changes to packages (maintained by dbt Labs or by others)?" >

When we talk about _latest version_, we’re referring to the underlying runtime for dbt, not the versions of packages you’re installing. Our continuous release for dbt includes testing against several popular dbt packages. This ensures that updates we make to `dbt`, adapters, or anywhere else are compatible with the code in those packages.

If a new version of a dbt package includes a breaking change (for example, a change to one of the macros in `dbt_utils`), you don’t have to immediately use the new version. In your `packages` configuration (in `dependencies.yml` or  `packages.yml`), you can still specify which versions or version ranges of packages you want dbt to install. If you're not already doing so, we strongly recommend [checking `package-lock.yml` into version control](/reference/commands/deps#predictable-package-installs) for predictable package installs in deployment environments and a clear change history whenever you install upgrades.

If you upgrade to the **v1 Latest** release track, and immediately see something that breaks, please [contact support](/docs/dbt-support#dbt-cloud-support) and, in the meantime, downgrade back to v1.7.

If you’re already on the **v1 Latest** release track, and you observe a breaking change (like something worked yesterday, but today it isn't working, or works in a surprising/different way), please [contact support](/docs/dbt-support#dbt-cloud-support) immediately. Depending on your contracted support agreement, the dbt Labs team will respond within our SLA time and we would seek to roll back the change and/or roll out a fix (just as we would for any other part of dbt). This is the same whether or not the root cause of the breaking change is in the project code or in the code of a package.

If the package you’ve installed relies on _undocumented_ functionality of dbt, it doesn't have the same guarantees as functionality that we’ve documented and tested. However, we will still do our best to avoid breaking them.

</Expandable>

