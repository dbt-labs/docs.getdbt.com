---
title: "Upgrade to Fusion part 1: Preparing to upgrade"
id: "prepare-fusion-upgrade"
level: 'Intermediate'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt platform', 'Upgrade']
recently_updated: true
intro_text: This guide helps you prepare for an in-place upgrade from dbt Core to the dbt Fusion engine in the dbt platform.
---

<div style={{maxWidth: '900px'}}>

import FusionAdapters from '/snippets/_fusion-dwh.md';

## Introduction

import FusionPreview from '/snippets/_fusion-private-preview.md';

<FusionPreview />

The <Constant name="fusion_engine" /> represents the next evolution of data transformation. dbt has been rebuilt from the ground up but at its most basic, <Constant name="fusion" /> is a new version, and like any new version you should take steps to prepare to upgrade. This guide will take you through those preparations. 

If <Constant name="fusion" /> is brand new to you, take a look at our [comprehensive documentation](/docs/fusion) on what it is, how it behaves, and what's different from <Constant name="core" /> before getting started with this guide. Once you're caught up, it's time to begin preparing your projects for the speed and power that <Constant name="fusion" /> has to offer.

## Prerequisites

This guide will cover the preparations for upgrading to the <Constant name="fusion_engine" /> and is intended for customers already using the <Constant name="dbt_platform" /> with a version of <Constant name="core" />. If you're brand new to dbt, check out our [quickstart guides](/guides).

To follow the steps in this guide, you must meet the following prerequisites:

- You're using a <Constant name="dbt_platform" /> account on any tier.
- You have a developer license.
- You have [proper permissions](/docs/cloud/manage-access/enterprise-permissions) to edit projects.
- Your project is using a <Constant name="fusion" /> supported adapter:
    <FusionAdapters/>

:::tip Upgrading your first project

Start with smaller, newer, or more familiar projects first. This makes it easier to identify and troubleshoot any issues before upgrading larger, more complex projects.

:::

## Upgrade to the latest dbt Core version

Before upgrading to <Constant name="fusion" />, you need to move your environments to the `Latest` [<Constant name="core" /> release track](/docs/dbt-versions/cloud-release-tracks). The `Latest` track includes all the features and tooling to help you prepare for <Constant name="fusion" />. It ensures the smoothest upgrade experience by validating that your project doesn't rely on deprecated behaviors.

:::tip Test before you deploy

Always test version upgrades in development first. Use the [Override dbt version](#step-1-test-in-development-using-override) feature to safely try the `Latest` release track without affecting your team or production runs.

:::

### Step 1: Test in development (using override)

Test the `Latest` release track for your individual account without changing the environment for your entire team:

1. Click your account name in the left sidebar and select **Account settings**.
2. Select **Credentials** from the sidebar and choose your project.
3. In the side panel, click **Edit** and scroll to **User development settings**.
4. Select **Latest** from the **dbt version** dropdown and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Override dbt version in your account settings"/>

5. Launch the <Constant name="cloud_ide" /> or <Constant name="cloud_cli" /> and test your normal development workflows.
6. Verify the override is active by running any dbt command and checking the **System Logs**. The first line should show `Running with dbt=` and your selected version. If the version number is `v1.11` or higher, you're on the right path to <Constant name="fusion" /> readiness.

If everything works as expected, proceed to the next step to start upgrading your environments. If you encounter deprecation warnings, don't fear! We'll address those [later in this guide](/guides/prepare-fusion-upgrade?step=4). If you encounter errors, revert to your previous version and refer to the [version upgrade guides](/docs/dbt-versions/core-upgrade) to resolve any differences between your current version and the latest available <Constant name="core" /> version.

### Step 2: Upgrade your development environment

After successfully testing your individual development environment with the override, upgrade the development environment for the entire project (be sure to give your team notice!):

1. Navigate to **Environments** in your project settings.
2. Select your **Development** environment and click **Edit**.
3. Click the **dbt version** dropdown and select **Latest**.
4. Click **Save** to apply the changes.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/select-development.png" width="90%" title="Upgrade development environment to Latest dbt Core release track"/>

:::info Remove your override

Once your development environment is upgraded, you can remove your personal override by returning to your account credentials and selecting the same version as your environment.

:::

### Step 3: Upgrade staging and pre-production

If your organization has staging or pre-production environments, upgrade these before production:

1. Navigate to **Environments** and select your staging/pre-production environment.
2. Click **Edit** and select **Latest** from the **dbt version** dropdown.
3. Click **Save**.
4. Run your jobs in this environment for a few days to validate everything works correctly.

This provides a final validation layer before upgrading production environments.

### Step 4: Upgrade your production environment

After validating in staging (or development if you don't have staging), upgrade your production environment:

1. Navigate to **Environments** and select your **Production** environment.
2. Click **Edit** and select **Latest** from the **dbt version** dropdown.
3. Click **Save** to apply the changes.
4. Monitor your first few production runs to ensure everything executes successfully.


### Step 5: Update jobs

While environments control the dbt version for most scenarios, some older job configurations may have version overrides. Review your jobs and [update any that specify a dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#jobs) to ensure they use the environment's Latest release track.

## Resolve all deprecation warnings

<Constant name="fusion" /> enforces strict validation and won't accept deprecated code that currently generates warnings in <Constant name="core" />. You must resolve all deprecation warnings before upgrading to <Constant name="fusion" />. Fortunately, the autofix tool in the <Constant name="cloud_ide" /> can automatically resolve most common deprecations for you.

:::tip VS Code extension

This guide provides steps to resolve deprecation warnings without leaving <Constant name="dbt_platform" />. If you prefer to work in the VS Code or Cursor editors locally, you can run the autofix in our dbt VS Code extension. Check out the [installation guide](/docs/install-dbt-extension) for more information about those workflows.

:::

### What the autofix tool handles

The autofix tool can resolve many deprecations automatically, including:

- Moving custom configurations into the `meta` dictionary
- Fixing duplicate YAML keys
- Correcting unrecognized resource properties
- Updating deprecated configuration patterns

Check out the [autofix readme](https://github.com/dbt-labs/dbt-autofix/) for a complete list of the deprecations it addresses.

:::note Fusion package compatibility

In addition to deprecations, the autofix tool attempts to upgrade packages to the lowest supported <Constant name="fusion" />-compatible version. Check out [package support](/docs/fusion/supported-features#package-support) for more information about <Constant name="fusion" /> compatibility.

:::

### Step 1: Create a new branch

Before running the autofix tool, create a new branch to isolate your changes:

1. Navigate to the <Constant name="cloud_ide" /> by clicking **Studio** in the left-side menu.
2. Click the **Version control** panel (git branch icon) on the left sidebar.
3. Click **Create branch** and name it something descriptive like `fusion-deprecation-fixes`.
4. Click **Create** to switch to your new branch.

:::warning Save before autofixing

The autofix tool will modify files in your project. Make sure to commit or stash any unsaved work to avoid losing changes.

:::

### Step 2: Run the autofix tool

Now you're ready to scan for and automatically fix deprecation warnings:

1. Click the **three-dot menu** in the bottom right corner of the <Constant name="cloud_ide" />.
2. Select **Check & fix deprecations**.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.png" width="90%" title="Access the Studio IDE options menu"/>

The tool runs `dbt parse --show-all-deprecations --no-partial-parse` to identify all deprecations in your project. This may take a few moments depending on your project size.

3. When parsing completes, view the results in the **Command history** panel in the bottom left.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/command-history.png" width="90%" title="View command history and deprecation results"/>

### Step 3: Review and apply autofixes

After the deprecation scan completes, review the findings and apply automatic fixes:

1. In the **Command history** panel, review the list of deprecation warnings.
2. Click the **Autofix warnings** button to proceed.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-button.png" width="90%" title="Click Autofix warnings to resolve deprecations automatically"/>

3. In the **Proceed with autofix** dialog, review the warning and click **Continue**.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/proceed-with-autofix.png" width="90%" title="Confirm autofix operation"/>

The tool automatically modifies your project files to resolve fixable deprecations, then runs another parse to identify any remaining warnings.

4. When complete, a success message appears. Click **Review changes**.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-success.png" width="90%" title="Autofix complete"/>

### Step 4: Verify the changes

Review the changes made by the autofix tool to ensure they're correct:

1. Open the **Version control** panel to view all modified files.
2. Click on individual files to review the specific changes.
3. Look for files with moved configurations, corrected properties, or updated syntax.
4. If needed, make any additional manual adjustments.

### Step 5: Commit your changes

Once you're satisfied with the autofix changes, commit them to your branch:

1. In the **Version control** panel, add a descriptive commit message like "Fix deprecation warnings for Fusion upgrade".
2. Click **Commit and sync** to save your changes.

### Step 6: Address remaining deprecations

If the autofix tool reports remaining deprecation warnings that couldn't be automatically fixed:

1. Review the warning messages in the **Command history** panel. Each warning includes the file path and line number.
2. Manually update the code based on the deprecation guidance:
   - Custom inputs should be moved to the `meta` config.
   - Deprecated properties should be updated to their new equivalents.
   - Refer to specific [version upgrade guides](/docs/dbt-versions/core-upgrade) for detailed migration instructions.
3. After making manual fixes, run **Check & fix deprecations** again to verify all warnings are resolved.
4. Commit your changes.

### Step 7: Merge to your main branch

Once all deprecations are resolved:

1. Create a pull request in your git provider to merge your deprecation fixes.
2. Have your team review the changes.
3. Merge the PR to your main development branch.
4. Ensure these changes are deployed to your environments before proceeding with the <Constant name="fusion" /> upgrade.

## Validate and upgrade your dbt packages

:::tip Run autofix first

This section contains instructions for manual package upgrades. We recommend running the autofix tool before taking these steps.

The autofix tool finds packages incompatible with <Constant name="fusion" /> and upgrades them to the lowest compatible version. For more information, check out [package support](/docs/fusion/supported-features#package-support).

:::

dbt packages extend your project's functionality, but they must be compatible with <Constant name="fusion" />. Most commonly used packages from dbt Labs (like `dbt_utils` and `dbt_project_evaluator`) and many community packages [already support <Constant name="fusion" />](/docs/fusion/supported-features#package-support). Before upgrading, verify your packages are compatible and upgrade them to the latest versions. Check for packages that support version 2.0.0, or ask the maintainer if you're unsure.

What if a package isn't compatible?

If a critical package isn't yet compatible with <Constant name="fusion" />:
- Check with the package maintainer about their roadmap.
- Open an issue requesting <Constant name="fusion" /> support.
- Consider contributing the compatibility updates yourself.
- Try it out anyway! The incompatible portion of the package might not impact your project. 

import FusionPackageCompatibility from '/snippets/_fusion-package-compatibility.md';

<FusionPackageCompatibility />

### Step 1: Review your current packages

Identify which packages your project uses:

1. In the <Constant name="cloud_ide" />, open your project's root directory.
2. Look for either `packages.yml` or `dependencies.yml` file.
3. Review the list of packages and their current versions.

Your file will look something like this:

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.0.0
  - package: dbt-labs/codegen
    version: 0.9.0
```

### Step 2: Check compatibility and find the latest package versions

Review [the dbt package hub](https://hub.getdbt.com) to see verified <Constant name="fusion" />-compatible packages by checking that the `require-dbt-version` configuration includes `2.0.0` or higher. Refer to [package support](/docs/fusion/supported-features#package-support) for more information.

For packages that aren't <Constant name="fusion" />-compatible:
   - Visit the package's GitHub repository.
   - Check the README or recent releases for <Constant name="fusion" /> compatibility information.
   - Look for issues or discussions about <Constant name="fusion" /> support.

For each package, find the most recent version:

- Visit [dbt Hub](https://hub.getdbt.com) for packages hosted there.
- For packages from GitHub, check the repository's releases page.
- Note the latest version number for each package you use.

For Hub packages, you can use version ranges to stay up-to-date:

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.0.0", "<3.0.0"]  # Gets latest 1.x or 2.x version
```

### Step 3: Update your package versions

Update your `packages.yml` or `dependencies.yml` file with the latest compatible versions:

1. In the <Constant name="cloud_ide" />, open your `packages.yml` or `dependencies.yml` file.
2. Update each package version to the latest compatible version.
3. Save the file.

   Before update:
   ```yaml
   packages:
   - package: dbt-labs/dbt_utils
      version: 0.9.6
   - package: dbt-labs/codegen
      version: 0.9.0
   ```

   After update:
   ```yaml
   packages:
   - package: dbt-labs/dbt_utils
      version: [">=1.0.0", "<2.0.0"]
   - package: dbt-labs/codegen
      version: [">=0.12.0", "<1.0.0"]
   ```

### Step 4: Install updated packages

After updating your package versions, install them:

1. In the <Constant name="cloud_ide" /> command line, run:
   ```bash
   dbt deps --upgrade
   ```

The `--upgrade` flag ensures dbt installs the latest versions within your specified ranges, updating the `package-lock.yml` file.

2. Review the output to confirm all packages installed successfully.
3. Check that the `package-lock.yml` file was updated with the new package versions.

:::info About package-lock.yml

The `package-lock.yml` file pins your packages to specific versions for reproducible builds. We recommend committing this file to version control so your entire team uses the same package versions.

:::

### Step 5: Test your project with updated packages

After upgrading packages, test your project to ensure everything works:

1. Run a subset of your models to verify basic functionality:
   ```bash
   dbt run --select tag:daily
   ```

2. Run your tests to catch any breaking changes (exact command may vary):
   ```bash
   dbt test
   ```

3. If you encounter issues:
   - Review the package's changelog for breaking changes
   - Adjust your code to match new package behavior
   - If problems persist, temporarily pin to an older compatible version (if possible)

### Step 6: Commit package updates

Once you've verified the updated packages work correctly:

1. In the **Version control** panel, stage your changes:
   - `packages.yml` or `dependencies.yml`
   - `package-lock.yml`

2. Add a commit message like "Upgrade dbt packages for Fusion compatibility".
3. Click **Commit and sync**.

## Check for known Fusion limitations

While <Constant name="fusion" /> supports most of <Constant name="core" />'s capabilities, some features have limited support or are still in development. Before upgrading, review your project to identify any features that <Constant name="fusion" /> doesn't yet fully support. This allows you to plan accordingly &mdash; whether that means removing non-critical features, implementing workarounds, or waiting for specific features to become available.

:::note Fusion is rapidly evolving

Many limitations are being addressed as <Constant name="fusion" /> moves toward General Availability. You can track progress on specific features through the [dbt-fusion GitHub milestones](https://github.com/dbt-labs/dbt-fusion/milestones) and stay updated via the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements).

:::

### Step 1: Review the limitations table

Start by understanding which features have limited or no support in <Constant name="fusion" />:

Visit the [Fusion supported features page](/docs/fusion/supported-features#limitations) and review the limitations table to see features that may affect your project.

Common limitations include:
- **Python models:** Not currently supported (Fusion cannot parse Python to extract dependencies)
- **Microbatch incremental strategy:**  Not yet available
- **Model-level notifications:** Job-level notifications work, model-level don't yet
- **Semantic Layer development:** Active semantic model development should stay on <Constant name="core" />
- **SQLFluff linting:** Not integrated yet (though linting will be built into <Constant name="fusion" /> directly)

### Step 2: Search your project for limited features

Check if your project uses any features with limited support. For example:

1. Check for Python models:
   - In the <Constant name="cloud_ide" />, look in your `models/` directory
   - Search for files with `.py` extensions
   - If found, you'll need to either remove them or keep those models on <Constant name="core" />

2. Review your `dbt_project.yml` for specific configurations:
   - Look for `store_failures` settings
   - Check for custom materializations beyond `view`, `table`, and `incremental`
   - Review any `warn-error` or `warn-error-options` configurations

3. Check your job configurations:
   - Review any jobs using `--fail-fast` flag
   - Identify jobs using `--store-failures`
   - Note any Advanced CI "compare changes" workflows

4. Review model governance settings:
   - Search for models with `deprecation_date` set
   - Note these may not generate deprecation warnings yet in <Constant name="fusion" />

### Step 3: Assess the impact

For each limitation that affects your project, determine its criticality:

- **Critical features:** Features your project can't function without:
    - If Python models are essential, you may need to wait or refactor them to SQL
    - If Semantic Layer development is active, continue those workloads on <Constant name="core" />

- **Nice-to-have features:** Features that improve workflows but aren't blockers:
    - Model-level notifications can be replaced with job-level notifications temporarily
    - SQLFluff linting can continue running with <Constant name="core" /> in CI

- **Minimal impact:** Features you can easily work around:
    - `--fail-fast` can be removed from job commands
    - `--store-failures` can be disabled temporarily

### Step 4: Create an action plan

Based on your assessment, decide how to handle each limitation:

- Remove non-critical features:

    Temporarily disable features you can live without:
   
   Before (in model config): 

   ```SQL
   {{ config(
     materialized='incremental',
     store_failures=true
   ) }}
   ```
   
   After:
   ```SQL
   {{ config(
     materialized='incremental'
   ) }}
   ```
- Implement workarounds for low-impact features.
   - Use job-level notifications instead of model-level
   - Run SQLFluff linting separately in CI with <Constant name="core" />
   - Use standard state selection instead of granular subselectors


### Step 5: Document your findings

Create a record of limitations affecting your project:

1. In your <Constant name="cloud_ide" />, create a document (like `FUSION_MIGRATION.md`) listing:
   - Features your project uses that <Constant name="fusion" /> doesn't fully support
   - Which models or jobs are affected
   - Your mitigation strategy for each limitation
   - GitHub issue links to track when features become available

2. It's critical that your teams understand the limitations so share this document with your stakeholders.

### Step 6: Track feature progress

Stay up-to-date with feature availability:

1. Subscribe to relevant GitHub issues for features you need (linked in the [limitations table](/docs/fusion/supported-features#limitations)).
2. Follow the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) for updates.
3. Check the [dbt-fusion milestones](https://github.com/dbt-labs/dbt-fusion/milestones) to see release timelines.


## What's next? 

With limitations identified and addressed, you've completed all the preparation steps. Your project is now ready to upgrade to <Constant name="fusion" />!

Check out [Part 2: Making the move](/guides/upgrade-to-fusion)

</div>
