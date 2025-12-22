---
title: "Fusion package upgrade guide"
id: "fusion-package-compat"
description: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
intro_text: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
hoverSnippet: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
# time_to_complete: '30 minutes' commenting out until we test
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine']
level: 'Advanced'
---

## Introduction

Thank you for being part of the [dbt's package hub community](https://hub.getdbt.com/) and maintaining [packages](/docs/build/packages)! Your work makes dbt’s ecosystem possible and helps thousands of teams reuse trusted models and macros to build faster, more reliable analytics.

This guide helps you upgrade your dbt packages to be [<Constant name="fusion" />](/docs/fusion)-compatible. A <Constant name="fusion" />-compatible package:
- Supports [<Constant name="fusion_engine" />](/docs/fusion) version `2.0.0`
- Uses the [`require-dbt-version` config](/reference/project-configs/require-dbt-version) to signal compatibility in the dbt package hub
- Aligns with the latest JSON schema introduced in <Constant name="core"/> v1.10.0

In this guide, we'll go over:

- Updating your package to be compatible with <Constant name="fusion"/>
- Testing your package with <Constant name="fusion"/>
- Updating the `require-dbt-version` config to include `2.0.0`
- Updating your README to note that the package is compatible with <Constant name="fusion"/>

### Who is this for?

This guide is for any dbt package maintainer, like [`dbt-utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), that's looking to upgrade their package to be compatible with <Constant name="fusion"/>. Updating your package ensures users have the latest version of your package, your package stays trusted on dbt package hub, and users benefit from the latest features and bug fixes. 

A user stores their package in a `packages.yml` or `dependencies.yml` file. If a package excludes `2.0.0`, <Constant name="fusion"/> warns today and errors in a future release, matching <Constant name="core"/> behavior. 

This guide assumes you're using the command line and Git to make changes in your package repository. If you're interested in creating a new package from scratch, we recommend using the [dbt package guide](/guides/building-packages) to get started.

## Prerequisites

Before you begin, make sure you meet the following:

- dbt package maintainer &mdash; You maintain a package on [dbt's package hub](https://hub.getdbt.com/) or are interested in [creating one](/guides/building-packages?step=1). 
- `dbt-autofix` installed &mdash; [Install `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) to automatically update the package's YAML files to align with the latest dbt updates and best practices. We recommend [using/installing uv/uvx](https://docs.astral.sh/uv/getting-started/installation/) to run the tool.
  - Run the command `uvx dbt-autofix` for the latest version of the tool. For more installation options, see the [official `dbt-autofix` doc](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).
- Repository access &mdash; You’ll need permission to create a branch and release updates/a new version of your package. You’ll need to tag a new version of your package once it’s <Constant name="fusion"/>-compatible.
- A <Constant name="fusion"/> installation or test environment &mdash; You can use <Constant name="fusion"/> locally (using the `dbtf` binary) or in your CI pipeline to validate compatibility.
- CLI and Git usage &mdash; You’re comfortable using the command line and Git to update the repository.

## Upgrade the package
This section covers how to upgrade your package to be compatible with <Constant name="fusion"/> by:
- [Using `dbt-autofix` to automatically update your YAML files](/guides/fusion-package-compat?step=)
- [Testing your package with <Constant name="fusion"/>](/guides/fusion-package-compat?step=5)
- [Updating your `require-dbt-version` config](/guides/fusion-package-compat?step=6)
- [Publishing a new release of your package](/guides/fusion-package-compat?step=7)

If you're ready to get started, let's begin!

## Run dbt-autofix

1. Before you begin, make sure you have `dbt-autofix` installed. If you don't have it installed, run the command `uvx dbt-autofix`. For more installation options, see the [official `dbt-autofix` doc](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).

2. In your dbt package repository, create a branch to work in. For example:
    ```bash
    git checkout -b fusion-compat
    ```

3. Run `dbt-autofix deprecations` in your package directory so it automatically updates your package code and rewrites YAML to conform to the latest JSON schema:
    ```bash
    dbt-autofix deprecations
    ```

<!-- 4. (Optional) You can also run `dbt-autofix` as a temporary continuous integration (CI) check until the package is <Constant name="fusion"/>-compatible:
    ```bash
    dbt-autofix deprecations --check
    ```
-->

## Test package with Fusion

Now that you've run `dbt-autofix`, let's test your package with <Constant name="fusion"/> to ensure it's compatible before [updating](https://docs.getdbt.com/guides/fusion-package-compat?step=6) your `require-dbt-version` config. Refer to the [<Constant name="fusion"/> limitations documentation](/docs/fusion/supported-features#limitations) for more information on what to look out for. You can test your package two ways:

<!-- no toc -->
- [Running your integration tests with Fusion](#running-your-integration-tests-with-fusion) &mdash; Use if your package has [integration tests](https://docs.getdbt.com/guides/building-packages?step=4) using an `integration_tests/` folder.
- [Manually validating your package](#manually-validating-your-package) &mdash; Use if your package doesn't have [integration tests](https://docs.getdbt.com/guides/building-packages?step=4). Consider creating one to help validate your package.

#### Running your integration tests with Fusion

If your package includes an `integration_tests/` folder ([like `dbt-utils`](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests)), follow these steps:

1. Navigate to the folder (`cd integration_tests`) to run your tests. If you don't have an `integration_tests/` folder, you can either [create one](https://docs.getdbt.com/guides/building-packages?step=4) or navigate to the folder that contains your tests.
2. Then, run your tests with <Constant name="fusion"/> by running the following `dbtf build` command (or whatever <Constant name="fusion"/> executable is available in your environment).
3. If there are no errors, your package likely supports <Constant name="fusion"/> and you're ready to [update your `require-dbt-version`](https://docs.getdbt.com//guides/fusion-package-compat?step=5#update-your-require-dbt-version). If there are errors, you'll need to fix them first before updating your `require-dbt-version`.

#### Manually validating your package

If your package doesn't have integration tests, follow these steps:

1. Create a small, <Constant name="fusion"/>-compatible dbt project that installs your package and has a `packages.yml` or `dependencies.yml` file. 
2. Run it with <Constant name="fusion"/> using the `dbtf run` command.
3. Confirm that models build successfully and that there are no warnings. If there are errors/warnings, you'll need to fix them first. If you still have issues, reach out to the [#package-ecosystem channel](https://getdbt.slack.com/archives/CU4MRJ7QB) on Slack for help.

## Update `require-dbt-version` 

Only update the [`require-dbt-version` config](/reference/project-configs/require-dbt-version) after testing and confirming that your package works with <Constant name="fusion"/>. 

1. Update the `require-dbt-version` in your `dbt_project.yml` to include `2.0.0`. We recommend using a range to ensure stability across releases:
    ```yaml
    require-dbt-version: [">=1.10.0,<3.0.0"] 
    ```
    This signals that your package supports both <Constant name="core"/> and <Constant name="fusion"/>. 
    dbt Labs uses this release metadata to mark your package with a <Constant name="fusion"/>-compatible badge in the [dbt package hub](https://hub.getdbt.com/). Packages without this metadata don't
    display the <Constant name="fusion"/>-compatible badge.

2. Commit and push your changes to your repository.

## Publish a new release

1. After committing and pushing your changes, publish a new release of your package by merging your branch into main (or whatever branch you're using for your package).
2. Update your `README` to note that the package is <Constant name="fusion"/>-compatible.
3. (Optional) Announce it in [#package-ecosystem on dbt Slack](https://getdbt.slack.com/archives/CU4MRJ7QB) if you’d like.

:::tip CI Fusion testing
When possible, add a step to your CI pipeline that runs `dbtf build` or equivalent to ensure ongoing <Constant name="fusion"/> compatibility.
:::

Your package is now <Constant name="fusion"/>-compatible and the dbt package hub reflects these changes. To summarize, you've now:

- Created a fusion compatible branch
- Run `dbt-autofix` deprecations
- Reviewed, committed, and tested changes 
- Updated `require-dbt-version: [">=1.10.0,<3.0.0"]` to include `2.0.0`
- Published a new release
- Announced the update (optional)
- Celebrate your new <Constant name="fusion"/>-compatible badge 🎉

## Final thoughts

<ConfettiTrigger>

Now that you've upgraded your package to be <Constant name="fusion"/>-compatible, users can use your package with <Constant name="fusion"/>! 🎉

By upgrading now, you’re ensuring a smoother experience for users, paving the way for the next generation of dbt projects, and helping dbt <Constant name="fusion"/> reach full stability.

If you have questions or run into issues:

- Join the conversation in the [#package-ecosystem channel](https://getdbt.slack.com/archives/CU4MRJ7QB) on Slack.
- Open an issue in the [dbt-autofix repository](https://github.com/dbt-labs/dbt-autofix/issues) on GitHub.

Lastly, thank you for your help in making the dbt ecosystem stronger &mdash; one package at a time 💜.
</ConfettiTrigger>

## Frequently asked questions

The following are some frequently asked questions about upgrading your package to be <Constant name="fusion"/>-compatible.

<Expandable alt_header="Why do we need to update our package?"> 

<Constant name="fusion"/> and <Constant name="core"/> v1.10+ use the same new authoring layer. Ensuring your package supports `2.0.0` in your `require-dbt-version` config ensures your package is compatible with both.

Updating your package ensures users have the latest version of your package, your package stays trusted on dbt package hub, and users benefit from the latest features and bug fixes. <Constant name="fusion"/>-compatible packages display a badge in the dbt package hub.

If a package excludes `2.0.0`, <Constant name="fusion"/> will warn today and error in a future release, matching dbt <Constant name="core"/> behavior. 

</Expandable>

<Expandable alt_header="How do I test Fusion in CI?">

Add a separate job that installs <Constant name="fusion"/> (`dbtf`) and runs `dbtf build`. See this [PR](https://github.com/godatadriven/dbt-date/pull/31) for a working example.

You want to do this to ensure any changes to your package remain compatible with <Constant name="fusion"/>.
</Expandable>

<Expandable alt_header="How will users know my package is Fusion-compatible?">

Users can identify your package as <Constant name="fusion"/>-compatible by checking for 2.0.0 or higher in the `require-dbt-version` range config.

<Constant name="fusion"/>-compatible packages also display a badge in the dbt package hub. This is automatically determined based on your package’s metadata and version requirements.

</Expandable>
