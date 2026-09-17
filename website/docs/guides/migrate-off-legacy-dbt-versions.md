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

## Choose your migration path

Pick the workflow that fits how your team works. All paths land in the same place: environments and jobs pinned to a [release track](/docs/dbt-versions/dbt-release-tracks) instead of a legacy version.

| Path | Best for |
|------|----------|
| [Manual migration](#manual-migration) | Making the change directly in the dbt platform UI, environment by environment |
| [Autofix your project](#autofix-your-project) | Developers who also want to resolve deprecation warnings that surface after the version change, using the Studio IDE or the VS Code extension |

## Delete a dormant environment

Before you migrate a project off a deprecated version, consider whether it's needed at all. If a legacy environment has been dormant for a year or more, you probably no longer need it, so delete it.

import DeleteEnvironment from '/snippets/_delete-environment.md';

<DeleteEnvironment />

## Manual migration

Find the row that matches each environment, then follow the linked steps.

| Environment version | Job version | What you do |
|---------------------|-------------|-------------|
| Legacy (v1.3–v1.7) | Inherits from environment, or pinned to a legacy version | [Migrate the environment to a release track](#migrate-an-environment-to-a-release-track) |
| Legacy (v1.3–v1.7) | At least one job pinned to a supported version | [Migrate the environment to a release track](#migrate-an-environment-to-a-release-track); the supported jobs are retained |
| Supported | One or more jobs pinned to a legacy version | [Update the job's version](#update-a-jobs-version); the environment is untouched |
| Legacy and **dormant** (unused 12+ months) | — | [Delete the environment](#delete-a-dormant-environment), or migrate it if you still need it |

If you don't migrate a legacy environment or clear a legacy job, it's cleaned up when legacy versions are retired: a legacy environment (and its jobs) is deleted, a legacy environment that already has a job on a supported version is **updated** with only the legacy jobs removed, and a supported environment with legacy-pinned jobs keeps the environment and loses **only those jobs**.

### Migrate an environment to a release track

To update your environment to a release track:

1. Navigate to the Settings page of the environment, then click **Edit**.
2. Click the **dbt version** dropdown and select a [release track](/docs/dbt-versions/dbt-release-tracks) (**v1 Latest** is recommended).
3. Save your changes.

As a best practice, test the upgrade in a development environment first. See [Upgrade versions in dbt platform](/docs/dbt-versions/upgrade-dbt-platform-version) for the full walkthrough, including how to set the version through the [Admin API](/docs/dbt-apis/admin-api) or Terraform.

Once the environment is on the new version, resolve any deprecation warnings it surfaces with [autofix](#autofix-migration).

### Update a job's version

If a job on a supported environment is pinned to a legacy version, clear or change the override:

1. Open the job's settings and find the **dbt version** setting.
2. Either clear the override so the job inherits the environment's version, or set it to a [release track](/docs/dbt-versions/dbt-release-tracks).
3. Save your changes.

## Autofix your project

Moving to a new version can surface deprecation warnings that weren't visible on the legacy version. Autofix finds and resolves these in your project code; it doesn't change an environment's or job's pinned version, so start with [manual migration](#manual-migration) first.

### Studio IDE

To prepare your project for the **v1 Latest** release track or the migration to v2:

1. Update the environment's version, as described in [Migrate an environment to a release track](#migrate-an-environment-to-a-release-track).
2. Open the environment in the [Studio IDE](/docs/platform/studio-ide/develop-in-studio).
3. Use [Check & fix deprecations](/docs/platform/studio-ide/autofix-deprecations) from the IDE's three-dot menu to find and resolve deprecation warnings.
4. Commit and sync the changes to your project repository.

### VS Code extension

To prepare your project for the **v1 Latest** release track or the migration to v2:

1. Update the environment's version, as described in [Migrate an environment to a release track](#migrate-an-environment-to-a-release-track).
2. In the [dbt VS Code extension](/docs/about-dbt-extension), pull the updated environment configuration and reparse your project to surface any deprecation warnings.
3. Resolve them with the [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) tool, either from the CLI or by following the prompts in the extension's upgrade assistant.
4. If you're also moving this project to <Constant name="fusion" />, use the extension's [agentic migration](/docs/upgrade-to-dbt-extension#agentic-migration) flow instead, which runs autofix as part of the full v1-to-v2 upgrade.

## Validate your migration

Moving from a pinned legacy version to a release track can surface behavior changes, dependency issues, or adapter differences that weren't visible before. To reduce risk:

- Test in a development environment before upgrading your production and default development environments.
- Review your compile, build, and job run results after the change.
- Establish a fallback path in case you need to roll back.

## Get help

If you hit a blocker you can't resolve, [contact Support](mailto:support@getdbt.com) with your project ID, environment ID, affected job run IDs and logs, your current version, and your target release track.
