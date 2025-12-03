---
title: Fusion readiness checklist
id: fusion-readiness
description: "Your to-do list for preparing for Fusion"
sidebar_label: "Fusion readiness checklist"
pagination_next: null
pagination_prev: null
---

The <Constant name="fusion_engine" /> is here! We currently offer it as a [private preview](/docs/dbt-versions/product-lifecycles#the-dbt-platform) on the <Constant name="dbt_platform" />. Even if we haven't enabled it for your account, you can still start preparing your projects for upgrade. Use this checklist to ensure a smooth upgrade once <Constant name="fusion" /> becomes available. If this is all new to you, first [learn about <Constant name="fusion" />](/docs/fusion), its current state, and the features available. 

## Preparing for Fusion

Use the following checklist to prepare your projects for the <Constant name="fusion_engine" />

### 1. Upgrade to the latest dbt version

The `Latest` [release track](/docs/dbt-versions/cloud-release-tracks) has all of the most recent features to help you prepare for <Constant name="fusion" />.

- [ ] Make sure all your projects are on the `Latest` release track across all deployment environments and jobs. This will ensure the simplest, most predictable experience by allowing you to pre-validate that your project doesn't rely on deprecated behaviors. 

### 2. Resolve all deprecation warnings

You must resolve deprecations while your projects are on a <Constant name="core" /> release track, as they result in warnings that will become errors once you upgrade to <Constant name="fusion" />. The autofix tool can automatically resolve many deprecations (such as moving arbitrary configs into the meta dictionary). Start a new branch to begin resolving deprecation warnings using one of the following methods:

- [ ] **Run autofix in the dbt platform:** You can address deprecation warnings using the [autofix tool in the Studio IDE](/docs/cloud/dbt-cloud-ide/autofix-deprecations). You can run the autofix tool on the `Compatible` or `Latest` release track.
- [ ] **Run autofix locally:** Use the [VS Code extension](/docs/about-dbt-extension). The extension has a built-in ["Getting Started" workflow](/docs/install-dbt-extension#getting-started) that will debug your dbt project in the VS Code or Cursor IDE and execute the autofix tool. This has the added benefit of installing <Constant name="fusion" /> to your computer so you can begin testing locally before implementing in your <Constant name="dbt_platform" /> account.
- [ ] **Run autofix locally (without the extension):** Visit the autofix [GitHub repo](https://github.com/dbt-labs/dbt-autofix) to run the tool locally if you're not using VS Code or Cursor. This will only run the tool, it will not install <Constant name="fusion" />.

### 3. Validate and upgrade your dbt packages

The most commonly used dbt Labs managed packages (such as `dbt_utils` and `dbt_project_evaluator`) are already compatible with <Constant name="fusion" />, as are a large number of external and community packages. We list many known supported packages [here](https://docs.getdbt.com/docs/fusion/supported-features#package-support), but more exist. 

- [ ] Make sure that all of your packages are upgraded to the most recent version, many of which contain enhancements to support <Constant name="fusion" />. 
- [ ] Check package repositories to make sure they're compatible with <Constant name="fusion" />. If a package you use is not yet compatible, we recommend opening an issue with the maintainer, making the contribution yourself, or removing the package temporarily before you upgrade.

### 4. Check for known Fusion limitations

Your project may implement features that <Constant name="fusion" /> currently [limits](/docs/fusion/supported-features#limitations) or doesn't support. 

- [ ] Remove unnecessary features from your project to make it <Constant name="fusion" /> compatible. 
- [ ] Monitor progress for critical features, knowing we are working to bring them to <Constant name="fusion" />. You can monitor their progress using the issues linked in the [limitations table](/docs/fusion/supported-features#limitations). 

### 5. Review jobs configured in the dbt platform

We determine <Constant name="fusion" /> eligibility using data from your job runs. 

- [ ] Ensure you have at least one job running in each of your projects in the <Constant name="dbt_platform" />. 
- [ ] Delete any jobs that are no longer in use to ensure accurate eligibility reporting. 
- [ ] Make sure you've promoted the changes for deprecation resolution and package upgrades to your git branches that map to your deployment environments.

### 6. Stay informed about Fusion progress

The <Constant name="fusion_engine" /> remains in private preview and we currently offer it for eligible projects! We will notify you when all your projects are ready for <Constant name="fusion" /> based on our eligibility checks on your deployment jobs. In the meantime, keep up-to-date with these resources: 

- [ ] Check out the [Fusion homepage](https://www.getdbt.com/product/fusion) for available resources, including supported adapters, prerequisites, installation instructions, limitations, and deprecations.
- [ ] Read the [Upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) to learn about the new features and functionality that impact your dbt projects.
- [ ] Monitor progress and get insight into the development process by reading the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements).
- [ ] Catch up on the [cost savings potential](https://www.getdbt.com/blog/announcing-state-aware-orchestration) of Fusion-powered [state-aware orchestration](https://docs.getdbt.com/docs/deploy/state-aware-about) (hint: 30%+ reduction in warehouse spend!)