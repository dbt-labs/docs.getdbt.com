---
title: "Migrate off legacy dbt versions"
id: migrate-off-legacy-dbt-versions
description: "A quickstart for moving environments and jobs off legacy dbt versions to a dbt v1 release track."
hoverSnippet: "Move your environments and jobs off legacy dbt versions to a release track."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration', 'dbt v1', 'dbt platform', 'Upgrade']
keywords: ['legacy dbt version', 'release track', 'migrate dbt version', 'upgrade dbt version']
level: 'Beginner'
---

Legacy <Constant name="dbt" /> versions v1.3–v1.7 are being deprecated on <Constant name="legacy_deprecation_date" />. To keep your work running and supported, move your environments and jobs to a [<Constant name="core" /> release track](/docs/dbt-versions/dbt-release-tracks) now. A release track keeps you on a supported version automatically and prepares your project for [<Constant name="fusion_engine" />](/docs/introduction) later.

:::info The single-hop path

Move to a <Constant name="core" /> release track now; move to <Constant name="fusion" /> later. Migrating first to a supported release track lowers your migration risk and gets you on a supported version faster.

:::

Your project code, connections, and history stay accessible throughout.

## Identify projects using legacy versions

What you migrate is driven by a job's effective version: the version pinned on the job if one is set, otherwise the version its environment inherits.

1. Navigate to **Orchestration** > **Environments** and note any environment whose **dbt version** is v1.3–v1.7. The current version is displayed below the environment name. 
2. Open the jobs in your supported environments and check for any job with a **version override** pinned to v1.3–v1.7.

Find the row that matches each environment, then follow the linked steps.

| Environment version | Job version | What you do |
|---------------------|-------------|-------------|
| Legacy (v1.3–v1.7) | Inherits from environment, or pinned to a legacy version | [Migrate the environment to a release track](#migrate-an-environment-to-a-release-track) |
| Legacy (v1.3–v1.7) | At least one job pinned to a supported version | [Migrate the environment to a release track](#migrate-an-environment-to-a-release-track); the supported jobs are retained |
| Supported | One or more jobs pinned to a legacy version | [Update the job's version](#update-a-jobs-version); the environment is untouched |
| Legacy and **dormant** (unused 12+ months) | — | [Delete the environment](#delete-a-dormant-environment), or migrate it if you still need it |

If you don't migrate a legacy environment or clear a legacy job, it's cleaned up when legacy versions are retired: a legacy environment (and its jobs) is deleted, a legacy environment that already has a job on a supported version is **updated** with only the legacy jobs removed, and a supported environment with legacy-pinned jobs keeps the environment and loses **only those jobs**.

## Delete a dormant environment

Before you migrate a project off a deprecated version, consider whether it's needed at all. If a legacy environment has been dormant for a year or more, you probably no longer need it, so delete it.

import DeleteEnvironment from '/snippets/_delete-environment.md';

<DeleteEnvironment />

## Migrate an environment to a release track

Start with a development or test environment. Moving it to a release track first lets you find and fix any compatibility issues in your project before you touch your other environments.

1. Navigate to the Settings page of the environment, then click **Edit**.
2. Click the **dbt version** dropdown and select a [release track](/docs/dbt-versions/dbt-release-tracks) (**v1 Latest** is recommended).
3. Save your changes.

You can also set the version through the [Admin API](/docs/dbt-apis/admin-api) or Terraform. Refer to [Upgrade versions in dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version) for the full walkthrough.

Once the environment is on the new version, [fix any compatibility issues it surfaces](#fix-compatibility-issues-in-your-project) before you migrate the rest of your environments and jobs.

## Fix compatibility issues in your project

Moving to a release track can surface deprecation warnings that weren't visible on your legacy version. Resolve these in your project code before you migrate your remaining environments, either by hand or with autofix.

### Manually fix

1. Run `dbt parse --no-partial-parse --show-all-deprecations` to list the deprecations in your project, or view them from the **Dashboard** in your dbt platform account.
2. Look up each warning in [Deprecations](/reference/deprecations) and update your project code accordingly.
3. Rerun `dbt parse` to confirm the warnings are resolved, then commit your changes.

### Autofix (recommended) {#autofix}

Autofix runs the [dbt-autofix](https://github.com/dbt-labs/dbt-autofix) script to resolve many deprecation warnings for you. It's available from both the Studio IDE and the VS Code extension.

#### Studio IDE

1. Open the environment in the [Studio IDE](/docs/platform/studio-ide/develop-in-studio).
2. Select **[Check & fix deprecations](/docs/platform/studio-ide/autofix-deprecations)** from the IDE's three-dot menu to find and resolve deprecation warnings.
3. Click **Commit and sync** to commit the changes to your project repository.

#### dbt VS Code extension

1. In the [dbt VS Code extension](/docs/about-dbt-extension), reparse your project against the updated environment to surface any deprecation warnings.
2. Resolve them with the [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) tool, either from the command line or by following the prompts in the extension's upgrade assistant.
3. We recommend upgrading from a deprecated version to **v1 Latest** first, but if you intend on moving this project to <Constant name="fusion" />, use the extension's [agentic migration](/docs/upgrade-to-dbt-extension#agentic-migration) flow instead, which runs autofix as part of the full v1-to-v2 upgrade.

## Migrate your remaining environments and jobs

Once your project is compatible, apply the same steps to your other environments and jobs. Use the scenarios in [Identify projects using legacy versions](#identify-projects-using-legacy-versions) to confirm what to do for each one.

### Update a job's version

Tp clear or change an override for a job on a supported environment that's pinned to a legacy version:

1. Open the job's settings and find the **dbt version** setting.
2. Either clear the override so the job inherits the environment's version, or set it to a [release track](/docs/dbt-versions/dbt-release-tracks).
3. Save your changes.

## Validate your migration

Moving from a pinned legacy version to a release track can surface behavior changes, dependency issues, or adapter differences that weren't visible before. To reduce risk:

- Test in a development environment before upgrading your production and default development environments.
- Review your compile, build, and job run results after the change.
- Establish a fallback path in case you need to roll back.

## Get help

If you hit a blocker you can't resolve, [contact Support](mailto:support@getdbt.com) with your project ID, environment ID, affected job run IDs and logs, your current version, and your target release track.
