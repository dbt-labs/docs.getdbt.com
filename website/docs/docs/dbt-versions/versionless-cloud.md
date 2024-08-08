---
title: "Upgrade to \"Versionless\" in dbt Cloud"
sidebar_label: "Upgrade to \"Versionless\" "
description: "Learn how to go versionless in dbt Cloud. You never have to perform an upgrade again. Plus, you'll be able to access new features and enhancements as soon as they become available. "
---

dbt Cloud is going versionless. Soon, your environments and jobs will always run the latest features and functionality.

This will require you to make one final update to your current jobs and environments. When that's done, you'll never have to think about managing, coordinating, or upgrading dbt versions again.

Move your environments and jobs to "Versionless" to get all the functionality in the latest features before they're in dbt Core &mdash; and more! &mdash; along with access to the new features and fixes as soon as they’re released.

## Tips for upgrading {#upgrade-tips}

If you regularly develop your dbt project in dbt Cloud and this is your first time trying “Versionless,” dbt Labs recommends that you start in development because it will be the fastest for investigation and iteration. [Override your dbt version in development](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version). Then, launch the IDE or Cloud CLI and do your development work as usual. Everything should work as you expect.

If you do see something unexpected or surprising, revert back to the previous version and record the differences you observed. [Contact dbt Cloud support](/docs/dbt-support#dbt-cloud-support) with your findings for a more detailed investigation.

Next, we recommend that you try upgrading your project’s [deployment environment](/docs/dbt-versions/upgrade-dbt-version-in-cloud#environments). If your project has a [staging deployment environment](/docs/deploy/deploy-environments#staging-environment), upgrade and try working with it for a few days before you proceed with upgrading the production environment. 

If your organization has multiple dbt projects, we recommend starting your upgrade with projects that are smaller, newer, or more familiar for your team. That way, if you do encounter any issues, it'll be easier and faster to troubleshoot those before proceeding to upgrade larger or more complex projects.

## Considerations

The following is our guidance on some important considerations regarding dbt projects as part of the upgrade. 

To learn more about how dbt Labs deploys stable dbt upgrades in a safe manner to dbt Cloud, we recommend that you read our blog post [How we're making sure you can confidently go "Versionless" in dbt Cloud](https://docs.getdbt.com/blog/latest-dbt-stability) for details.

<Expandable alt_header="I'm using an old version of dbt. What should I do?" >

If you're running dbt version 1.5 or older, please know that your version of dbt Core has reached [end-of-life (EOL)](/docs/dbt-versions/core#eol-version-support) and is no longer supported. We strongly recommend that you update to a newer version as soon as reasonably possible. In the coming months, we're planning to automatically migrate jobs and environments on these older, unsupported versions.

</Expandable>

<Expandable alt_header="I'm using the legacy metrics definitions from dbt Core version ≤1.5. What should I do?" >

The legacy dbt Semantic Layer was deprecated in the second half of 2023. We recommend that you refer to the [Legacy dbt Semantic Layer migration guide](/guides/sl-migration?step=1) for more information.

</Expandable>

<Expandable alt_header="What about breaking changes to packages (maintained by dbt Labs or by others)?" >

When we talk about _latest version_, we’re referring to the underlying runtime for dbt, not the versions of packages you’re installing. Our continuous release for dbt includes testing against several popular dbt packages. This ensures that updates we make to dbt-core, adapters, or anywhere else are compatible with the code in those packages.

If a new version of a dbt package includes a breaking change (for example, a change to one of the macros in `dbt_utils`), you don’t have to immediately use the new version. In your `packages` configuration (in `dependencies.yml` or  `packages.yml`), you can still specify which versions or version ranges of packages you want dbt to install. If you're not already doing so, we strongly recommend [checking `package-lock.yml` into version control](/reference/commands/deps#predictable-package-installs) for predictable package installs in deployment environments and a clear change history whenever you install upgrades.

If you upgrade to “Versionless” and immediately see something that breaks, please [contact support](/docs/dbt-support#dbt-cloud-support) and, in the meantime, downgrade back to v1.7.

If you’re already on “Versionless” and you observe a breaking change (like something worked yesterday, but today it isn't working, or works in a surprising/different way), please [contact support](/docs/dbt-support#dbt-cloud-support) immediately. Depending on your contracted support agreement, the dbt Labs team will respond within our SLA time and we would seek to roll back the change and/or roll out a fix (just as we would for any other part of dbt Cloud). This is the same whether or not the root cause of the breaking change is in the project code or in the code of a package.

If the package you’ve installed relies on _undocumented_ functionality of dbt, it doesn't have the same guarantees as functionality that we’ve documented and tested. However, we will still do our best to avoid breaking them.

</Expandable>

<Expandable alt_header="I see that dbt Core version 1.8 was released in April 2024. Will a version 1.8 become available in dbt Cloud?" >

No. Going forward, “Versionless” will be how all customers are going to access new functionality and ongoing support in dbt Cloud. We believe this is the best way for us to offer a reliable, stable, and secure runtime for dbt with continuous and consistent updates.

In 2023 (and earlier), customers were expected to manage their own upgrades by selecting dbt Core versions, up to and including dbt Core v1.7, which was released in October 2023. (Way back in 2021, dbt Cloud customers would pick specific _patch releases_ of dbt Core, such as upgrading from `v0.21.0` to `v0.21.1`. We’ve come a long way since then!)

In 2024, we've changed the way that new dbt functionality is made available for dbt Cloud customers: continuously. Behavior or breaking changes are gated behind opt-in flags. Users don't need to spend valuable time managing their own upgrades. This is called "Versionless" dbt Cloud and it's required for accessing any new functionality that we've put out in 2024+.

We will absolutely continue to release new minor versions of dbt Core (OSS), including v1.9 which will be available later this year. When we do, it will be a subset of the functionality that's already available to dbt Cloud customers and always after the functionality has been available in dbt Cloud.

</Expandable>

If you have comments or concerns, we’re happy to help. If you’re an existing dbt Cloud customer, you may reach out to your account team or [contact support](/docs/dbt-support#dbt-cloud-support).