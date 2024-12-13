---
title: "Release tracks in dbt Cloud"
sidebar_label: "dbt Cloud Release Tracks"
description: "Learn how to get automatic upgrades to dbt in dbt Cloud. Access new features and enhancements as soon as they become available."
---

Since May 2024, new capabilities in the dbt framework are delivered continuously to dbt Cloud. Your projects and environments are upgraded automatically on a cadence that you choose, depending on your dbt Cloud plan.

Previously, customers would pin to a minor version of dbt Core, and receive only patch updates during that specific version's active support period. Release tracks ensure that your project stays up-to-date with the modern capabilities of dbt Cloud and recent versions of dbt Core.

This will require you to make one final update to your current jobs and environments. When that's done, you'll never have to think about managing, coordinating, or upgrading dbt versions again.

By moving your environments and jobs to release tracks you can get all the functionality in dbt Cloud as soon as it's ready. On the "Latest" release track, this includes access to features _before_ they're available in final releases of dbt Core OSS.

## Which release tracks are available?

| Release track | Description | Plan availability | API value |
| ------------- | ----------- | ----------------- | --------- |
| **Latest** <br /> <Lifecycle status="GA"/> |  Formerly called "Versionless", provides a continuous release of the latest functionality in dbt Cloud. Includes early access to new features of the dbt framework before they're available in open source releases of dbt Core. | All plans | `latest` (or `versionless`) |
| **Compatible** <Lifecycle status="preview"/>  | Provides a monthly release aligned with the most recent open source versions of dbt Core and adapters, plus functionality exclusively available in dbt Cloud. |  Team + Enterprise | `compatible` |
| **Extended** <Lifecycle status="preview"/> | The previous month's "Compatible" release. | Enterprise | `extended` |

The first "Compatible" release was on December 12, 2024, after the final release of dbt Core v1.9.0. For December 2024 only, the "Extended" release is the same as "Compatible." Starting in January 2025, "Extended" will be one month behind "Compatible."

To configure an environment in the [dbt Cloud Admin API](/docs/dbt-cloud-apis/admin-cloud-api) or [Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest) to use a release track, set `dbt_version` to the release track name:
- `latest` (or `versionless`, the old name is still supported)
- `compatible`
- `extended`

## Which release track should I choose?

Choose the "Latest" release track to continuously receive new features, fixes, performance improvements — latest & greatest dbt. This is the default for all customers on dbt Cloud.

Choose the "Compatible" and "Extended" release tracks if you need a less-frequent release cadence, the ability to test new dbt releases before they go live in production, and/or ongoing compatibility with the latest open source releases of dbt Core.

### Common architectures

**Default** - majority of customers on all plans
- Prioritize immediate access to fixes and features
- Leave all environments on the "Latest" release track (default configuration)

**Hybrid** - Team, Enterprise
- Prioritize ongoing compatibility between dbt Cloud and dbt Core for development & deployment using both products in the same dbt projects
- Configure all environments to use the "Compatible" release track
- Understand that new features will not be available until they are first released in dbt Core OSS (several months after the "Latest" release track)

**Cautious** - Enterprise, Business Critical
- Prioritize "bake in" time for new features & fixes
- Configure development & test environments to use the "Compatible" release track
- Configure pre-production & production environments to use the "Extended" release track
- Understand that new features will not be available until they are first released in dbt Core OSS + Compatible track

**Virtual Private dbt or Single Tenant**
- Changes to all release tracks roll out as part of dbt Cloud instance upgrades once per week

## Upgrading from older versions

### How to upgrade {#upgrade-tips}

If you regularly develop your dbt project in dbt Cloud, and you're still running on a legacy version of dbt Core, dbt Labs recommends that you try upgrading your project in a development environment. [Override your dbt version in development](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version). Then, launch the IDE or Cloud CLI and do your development work as usual. Everything should work as you expect.

If you do see something unexpected or surprising, revert back to the previous version and record the differences you observed. [Contact dbt Cloud support](/docs/dbt-support#dbt-cloud-support) with your findings for a more detailed investigation.

Next, we recommend that you try upgrading your project’s [deployment environment](/docs/dbt-versions/upgrade-dbt-version-in-cloud#environments). If your project has a [staging deployment environment](/docs/deploy/deploy-environments#staging-environment), upgrade and try working with it for a few days before you proceed with upgrading the production environment. 

If your organization has multiple dbt projects, we recommend starting your upgrade with projects that are smaller, newer, or more familiar for your team. That way, if you do encounter any issues, it'll be easier and faster to troubleshoot those before proceeding to upgrade larger or more complex projects.

### Considerations

To learn more about how dbt Labs deploys stable dbt upgrades in a safe manner to dbt Cloud, we recommend that you read our blog post: [How we're making sure you can confidently switch to the \"Latest\" release track in dbt Cloud](https://docs.getdbt.com/blog/latest-dbt-stability).

If you're running dbt version 1.6 or older, please know that your version of dbt Core has reached [end-of-life (EOL)](/docs/dbt-versions/core#eol-version-support) and is no longer supported. We strongly recommend that you update to a newer version as soon as reasonably possible.

dbt Labs has extended the critical support period of dbt Core v1.7 for dbt Cloud Enterprise customers to March 2025. At that point, we will be encouraging all customers to select a Release Track for ongoing updates in dbt Cloud.

<Expandable alt_header="I'm using an older version of dbt in dbt Cloud. What should I do? What happens if I do nothing?" >

If you're running dbt version v1.6 or older, please know that your version of dbt Core has reached [end-of-life (EOL)](/docs/dbt-versions/core#eol-version-support) and is no longer supported. We strongly recommend that you update to a newer version as soon as reasonably possible.

dbt Labs has extended the "Critical Support" period of dbt Core v1.7 for dbt Cloud Enterprise customers while we work through the migration with those customers to Release Tracks. In the meantime, this means that v1.7 will continue to be accessible in dbt Cloud for Enteprise customers, jobs and environments on v1.7 for those customers will not be automatically migrated to "Latest," and dbt Labs will continue to fix critical bugs and security issues.

Starting in October 2024, dbt Cloud accounts on the Developer and Team plans have been migrated to release tracks from older dbt Core versions. If your account was migrated to the "Latest" release track and you notice new failures in scheduled jobs, please [contact dbt Cloud support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support) to report the problem or request an extension.

</Expandable>

<Expandable alt_header="I'm using the legacy metrics definitions from dbt Core version ≤1.5. What should I do?" >

The legacy dbt Semantic Layer was deprecated in the second half of 2023. We recommend that you refer to the [Legacy dbt Semantic Layer migration guide](/guides/sl-migration?step=1) for more information.

</Expandable>

<Expandable alt_header="What are other known issues when upgrading from older dbt Core versions?" >

If you are upgrading from a very old unsupported version of dbt Core, you may run into one of these edge cases after the upgrade to a newer version:
- [v1.1] Customers on BigQuery should be aware that dbt Cloud sets a default [per-model timeout](/docs/core/connect-data-platform/bigquery-setup#job_execution_timeout_seconds) of 5 minutes. You may override this config in your connection details. Older versions of dbt (including v1.0) did not appropriately respect this timeout configuration.
- [v1.3] Customers with non-dbt `.py` files defined within their project directories, such as `models/`. Since v1.3, dbt expects these files be valid [Python models](/docs/build/python-models). The customer needs to move these files out of their `models/` directory, or ignore them via `.dbtignore`
- [v1.5] Customers who have `--m` in their job definitions, instead of `-m` or `--models`. This autocompletion (`--m[odels]` for `--models`) has never been officially documented or supported. It was an implicit behavior of argparse (CLI library used in dbt-core v1.0-1.4) that is not supported by `click` (the CLI library used in dbt-core since v1.5+).
- [v1.5] Empty invalid `tests` config start raising a validation error](https://docs.getdbt.com/docs/dbt-versions/core-upgrade/upgrading-to-v1.5). Replace empty `tests` config with `tests: []` or remove it altogether.
- [v1.6] Performance optimization to `load_result` means you cannot call it on the same query result multiple times. Instead, save it to a local variable once, and reuse that variable (context: [dbt-core#7371](https://github.com/dbt-labs/dbt-core/pull/7371)

You should [contact dbt Cloud support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support) to request an extension, during which you will need to make those updates.

</Expandable>

<Expandable alt_header="I see that my account was migrated to Latest. What should I do?" >

For the vast majority of customers, there is no further action needed.

If you see new failures in your scheduled jobs now that they are running on a newer version of dbt, you may need to update your project code to account for one of the edge cases described on this page. You should [contact dbt Cloud support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support) to request an extension, during which you will need to make those updates.

</Expandable>

<Expandable alt_header="What about breaking changes to packages (maintained by dbt Labs or by others)?" >

When we talk about _latest version_, we’re referring to the underlying runtime for dbt, not the versions of packages you’re installing. Our continuous release for dbt includes testing against several popular dbt packages. This ensures that updates we make to dbt-core, adapters, or anywhere else are compatible with the code in those packages.

If a new version of a dbt package includes a breaking change (for example, a change to one of the macros in `dbt_utils`), you don’t have to immediately use the new version. In your `packages` configuration (in `dependencies.yml` or  `packages.yml`), you can still specify which versions or version ranges of packages you want dbt to install. If you're not already doing so, we strongly recommend [checking `package-lock.yml` into version control](/reference/commands/deps#predictable-package-installs) for predictable package installs in deployment environments and a clear change history whenever you install upgrades.

If you upgrade to the "Latest" release track, and immediately see something that breaks, please [contact support](/docs/dbt-support#dbt-cloud-support) and, in the meantime, downgrade back to v1.7.

If you’re already on the "Latest" release track, and you observe a breaking change (like something worked yesterday, but today it isn't working, or works in a surprising/different way), please [contact support](/docs/dbt-support#dbt-cloud-support) immediately. Depending on your contracted support agreement, the dbt Labs team will respond within our SLA time and we would seek to roll back the change and/or roll out a fix (just as we would for any other part of dbt Cloud). This is the same whether or not the root cause of the breaking change is in the project code or in the code of a package.

If the package you’ve installed relies on _undocumented_ functionality of dbt, it doesn't have the same guarantees as functionality that we’ve documented and tested. However, we will still do our best to avoid breaking them.

</Expandable>

<Expandable alt_header="I see that dbt Core version 1.8 was released in April 2024. Will a version 1.8 become available in dbt Cloud?" >

No. Going forward, customers will access new functionality and ongoing support in dbt Cloud by receiving automatic updates. We believe this is the best way for us to offer a reliable, stable, and secure runtime for dbt, and for you as dbt users to be able to consistently take advantage of new features.

In 2023 (and earlier), customers were expected to manage their own upgrades by selecting dbt Core versions, up to and including dbt Core v1.7, which was released in October 2023. (Way back in 2021, dbt Cloud customers would pick specific _patch releases_ of dbt Core, such as upgrading from `v0.21.0` to `v0.21.1`. We’ve come a long way since then!)

In 2024, we've changed the way that new dbt functionality is made available for dbt Cloud customers. Behavior or breaking changes are gated behind opt-in flags. Users don't need to spend valuable time managing their own upgrades. Currently, it is possible to receive continuous (daily) updates. We are adding other release cadence options for managed customers of dbt Cloud by the end of the year.

Opting into a release cadence with automated upgrades is required for accessing any new functionality that we've released in 2024, and going forward.

We continue to release new minor versions of dbt Core (OSS). We most recently released dbt Core v1.9 on December 9, 2024. These releases always include a subset of the functionality that's already available to dbt Cloud customers, and always after the functionality has been available in dbt Cloud.

</Expandable>

If you have comments or concerns, we’re happy to help. If you’re an existing dbt Cloud customer, you may reach out to your account team or [contact support](/docs/dbt-support#dbt-cloud-support).
