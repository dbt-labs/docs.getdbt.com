---
title: "Migrate off legacy dbt versions"
id: migrate-off-legacy-dbt-versions
description: "Use the Legacy dbt versions dashboard to move environments and jobs off legacy dbt versions to the dbt v1 Latest release track."
hoverSnippet: "Move your environments and jobs off legacy dbt versions to the v1 Latest release track."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration', 'dbt v1', 'dbt platform', 'Upgrade']
keywords: ['legacy dbt version', 'release track', 'migrate dbt version', 'upgrade dbt version']
level: 'Beginner'
---

Legacy <Constant name="dbt" /> versions v1.3–v1.7 are being deprecated on <Constant name="legacy_deprecation_date" />. To keep your work running and supported, move your environments and jobs to the **v1 Latest** [<Constant name="dbt" /> release track](/docs/dbt-versions/dbt-release-tracks) now. A release track keeps you on a supported version automatically.

:::info Migrating to v1 Latest

This guide and the **Legacy dbt versions** dashboard migrate you to the **v1 Latest** release track only. The tooling doesn't support migrating directly to <Constant name="fusion" />. If you want to move to v2, you can do so yourself after you finish this migration. Refer to [Upgrading to v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2).

:::

Your project code, connections, and history stay accessible throughout.

The fastest way to migrate is the **Legacy dbt versions** dashboard in your account settings. It inventories every project, environment, and job on a legacy version, and lets you upgrade code with <Constant name="wizard" /> and upgrade environments and jobs from one place. This guide walks through that workflow. Manual upgrade alternatives are at the end of the guide.

## Legacy dbt versions dashboard

1. In your **Account settings**, click **Legacy dbt versions**. You need permission to manage the account's projects and environments.
2. Review **At a glance**. Each tile (**Projects**, **Environments**, and **Jobs**) shows how many are **Supported** (on a currently supported release track) and how many are **Unsupported** (on a legacy version, v1.3–v1.7). The tiles are informational only.

<Lightbox src="/img/docs/dbt-platform/legacy-dbt-versions/legacy-versions-dashboard.png" width="90%" title="The Legacy dbt versions dashboard" />

3. Scroll to **Projects and environments**. Each project is listed with its environments, and each environment shows:
   - **dbt version**: the version it's currently on.
   - **Jobs**: the number of unsupported jobs over the total number of jobs.
   - **Last runs**: the date and time of the most recent job run, or **No runs recorded**.

   The **All environments** tab lists everything still on a legacy version. The **Upgraded** tab lists environments you already upgraded from the dashboard, which you can revert.

<Lightbox src="/img/docs/dbt-platform/legacy-dbt-versions/projects-and-environments.png" width="90%" title="Projects and environments on legacy versions" />

Use the following table to decide what to do with each environment.

| Environment | Jobs | What you do |
|-------------|------|-------------|
| Legacy (v1.3–v1.7) | Inherit the environment's version or are pinned to a legacy version | [Upgrade the project's code](/guides/migrate-off-legacy-dbt-versions?step=3&version=2), then [upgrade the environment](/guides/migrate-off-legacy-dbt-versions?step=4&version=2) |
| Supported | One or more jobs pinned to a legacy version | [Update the jobs](/guides/migrate-off-legacy-dbt-versions?step=5&version=2) from **View jobs** |
| Legacy and **dormant** (unused 12+ months) | — | [Delete the environment](/guides/migrate-off-legacy-dbt-versions?step=2&version=2), or upgrade it if you still need it |

If you don't upgrade a legacy environment or clear a legacy job, it's cleaned up when legacy versions are retired on <Constant name="legacy_deprecation_date" />: a legacy environment (and its jobs) is deleted, a legacy environment that already has a job on a supported version is **updated** with only the legacy jobs removed, and a supported environment with legacy-pinned jobs keeps the environment and loses **only those jobs**.

## Delete a dormant environment

Before you migrate a project off a deprecated version, consider whether it's needed at all. If a legacy environment has been dormant for a year or more (the **Last runs** column shows **No runs recorded** or an old date), you probably no longer need it, so delete it. The dashboard doesn't delete environments, so do this from the environment's settings.

import DeleteEnvironment from '/snippets/_delete-environment.md';

<DeleteEnvironment />

## Upgrade a project's code with dbt Wizard

Upgrading a release track can surface deprecation warnings and incompatibilities that weren't visible on your legacy version. Fix these in your project code before you upgrade the project's environments.

On the dashboard, each project has an **Upgrade with dbt Wizard** button. <Constant name="wizard" /> understands your project's lineage, tests, contracts, and run results, so it can resolve the deprecations and compatibility issues that a script alone can't. For more information, refer to [About dbt Wizard](/docs/platform/wizard-overview).

1. On the **Legacy dbt versions** dashboard, find the project and click **Upgrade with dbt Wizard**.
2. Read the confirmation window, which explains how the migration runs:
   - <Constant name="studio_ide" /> is pinned to the **Latest** release track for the project, so checks like `dbt parse` test your changes against the release track rather than the legacy version you're leaving. If <Constant name="studio_ide" /> is open for the project, it restarts. Saved files are preserved, but anything in progress is lost, including a running dbt command, unsaved editor changes, and the current <Constant name="wizard" /> conversation.
   - <Constant name="wizard" /> loads any skills in your project (`SKILL.md` files under a `skills/` folder). A project skill with the same name as a built-in one replaces it, which can change how the migration runs. Consider removing or renaming custom skills first.
   - <Constant name="wizard" /> works on a new branch and leaves the changes uncommitted for you to review. It doesn't change your environments or jobs.

   <Constant name="wizard" /> migrates your project code to the v1 **Latest** release track.
   
<Lightbox src="/img/docs/dbt-platform/legacy-dbt-versions/wizard-upgrade-confirmation.png" width="60%" title="The dbt Wizard migration confirmation" />

3. Click **Start migration**.
4. Review the changes <Constant name="wizard" /> made. Treat them like any other contributor's: review the diff, run your CI checks, then commit and merge.

For better results, ask <Constant name="wizard" /> to triage deprecations by type before it edits, to check upstream and downstream impact for macros and packages that many models depend on, and to compile and build the affected models after each batch of fixes. Ask it to summarize what changed and why so reviewers can follow along in your pull request.

Once the migration is merged, [upgrade the project's environments](#upgrade-environments).

## Upgrade environments {#upgrade-environments}

Start with development or test environments. Moving them to a release track first lets you find any remaining issues before you touch production.

1. On the **Legacy dbt versions** dashboard, find the environment and click **Upgrade**. To upgrade several at once, select the checkboxes next to the environments (or a whole project) and click **Upgrade** above the list.
2. Read the confirmation window and click **Upgrade**. Upgrading starts a trial period in which your jobs run on **v1 Latest**. Upgrading:
   - Moves the environment to the **v1 Latest** release track. Normal runs of jobs on unsupported versions use **v1 Latest**, including jobs explicitly pinned below v1.8. Job pins on supported versions and explicit per-run version overrides keep priority.
   - Takes effect on each job's next run. It doesn't start runs, unpause jobs, or verify compatibility.
   - Leaves saved versions, code, schedules, and <Constant name="studio_ide" /> sessions as they are.
<Lightbox src="/img/docs/dbt-platform/legacy-dbt-versions/environment-upgrade-confirmation.png" width="60%" title="The environment upgrade confirmation" />

3. Confirm the environment now appears on the **Upgraded** tab.

<Lightbox src="/img/docs/dbt-platform/legacy-dbt-versions/upgraded-environments-tab.png" width="90%" title="The Upgraded tab with a Revert option" />

If a job fails after the upgrade, select the environment on the **Upgraded** tab and click **Revert**. Jobs run on the previously configured version until you upgrade again. Reverting is temporary, because legacy versions are retired on <Constant name="legacy_deprecation_date" />.

:::caution Upgrading from the dashboard is a trial run

Upgrading from the dashboard only puts the environment on a trial run, where jobs execute on **v1 Latest**. After you verify that your jobs run successfully during the trial, update the environments and jobs to the **v1 Latest** release track yourself. Refer to [Upgrade an environment from its settings](#upgrade-an-environment-from-its-settings) and [Update jobs](#update-jobs).

:::

### Move to v2 later

After you finish migrating to v1 Latest, you can optionally move to [dbt v2](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2) on your own by selecting the **V2 Stable** release track in the environment's settings. Refer to [Upgrade versions in dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version) for the full walkthrough.

## Update jobs

Jobs that are pinned to a legacy version in an otherwise supported environment need their own update.

1. On the **Legacy dbt versions** dashboard, click **View jobs** for the environment. **View jobs** appears only for environments that have jobs.
2. In the list of jobs, click a job to open its page in the product. This is the same page you reach from **Orchestration** > **Jobs**.
3. In the job's settings, find the **dbt version** setting and either clear the override so the job inherits the environment's version or set it to the **v1 Latest** [release track](/docs/dbt-versions/dbt-release-tracks).
4. Save your changes.

## Other ways to upgrade

If you can't use the dashboard, or you want to handle part of the migration yourself, use the following methods.

### Upgrade an environment from its settings

1. Navigate to **Orchestration** > **Environments** and select the environment.
2. Click **Settings**, then **Edit**.
3. Click the **dbt version** dropdown and select the **v1 Latest** [release track](/docs/dbt-versions/dbt-release-tracks).
4. Save your changes.

### Fix compatibility issues with autofix

Autofix runs the [dbt-autofix](https://github.com/dbt-labs/dbt-autofix) script to resolve many deprecation warnings for you. It's available from both the <Constant name="studio_ide" /> and the VS Code extension.

- **<Constant name="studio_ide" />**: Open the environment in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), select **[Check & fix deprecations](/docs/platform/studio-ide/autofix-deprecations)** from the three-dot menu, then click **Commit and sync**.
- **dbt VS Code extension**: Run `dbt parse` in the [dbt VS Code extension](/docs/about-dbt-extension) to surface deprecation warnings, then resolve them with [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) or the extension's upgrade assistant.

### Fix compatibility issues manually

1. Run `dbt parse --no-partial-parse --show-all-deprecations` to list the deprecations in your project, or view them from the **Dashboard** in your <Constant name="dbt_platform" /> account.
2. Look up each warning in [Deprecations](/reference/deprecations) and update your project code accordingly.
3. Rerun `dbt parse` to confirm the warnings are resolved, then commit your changes.

## Validate your migration

Moving from a pinned legacy version to a release track can surface behavior changes, dependency issues, or adapter differences that weren't visible before. To reduce risk:

- Test in a development environment before upgrading your production and default development environments.
- Review your compile, build, and job run results after the change.
- Check the **Upgraded** tab of the dashboard, and revert an environment if you need a fallback.

## Get help

If you hit a blocker you can't resolve, [contact Support](mailto:support@getdbt.com) with your project ID, environment ID, affected job run IDs and logs, your current version, and the target release track.
