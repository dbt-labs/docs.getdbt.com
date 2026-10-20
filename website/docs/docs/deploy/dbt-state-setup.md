---
title: "Setting up dbt State"
sidebar_label: "Set up dbt State"
description: "Learn how to install and configure dbt State across dbt v1, dbt platform, and dbt v2."
id: "dbt-state-setup"
tags: ['dbt State']
availability: everywhere_usage
---

import LagToleranceRecommendationsTip from '/snippets/_lag-tolerance-recommendations-tip.md';

# Setting up dbt State

This page walks you through setting up dbt State across <Constant name="core" />, <Constant name="fusion" />, and <Constant name="dbt_platform" />.

## Prerequisites

Before you set up dbt State, make sure you have:

- **A supported dbt version**: dbt State is natively available in <Constant name="dbt_platform" />, <Constant name="fusion_engine" />, and dbt v1.13. It's also available as a plugin for dbt v1.7–1.12.
- **A supported data platform**: Snowflake, Databricks, BigQuery, or Redshift. More warehouses are on the roadmap.
- **A dbt account**: dbt State uses your dbt account for authentication, even if you're running dbt locally or in a non-interactive environment like CI/CD pipelines or an external orchestrator. Refer to [About dbt State](/docs/deploy/dbt-state-about#signing-up-for-dbt-state) for sign-up details, and [dbt State usage and pricing](/docs/platform/billing/dbt-state-usage) for pricing details. Note that dbt State isn't available on [legacy Starter](/docs/platform/billing/plans-and-billing#legacy-plans) plan. Please [contact dbt Labs](https://www.getdbt.com/contact) if that applies to you.

## Setting up dbt State

<Tabs queryString="user-type">
<TabItem value="self-hosted" label="Self-hosted dbt">

dbt State requires a dbt account, even when running dbt locally, to authenticate to the dbt State service. No need to migrate your existing workflows or purchase any dbt seats.

1. Log in to your dbt account and start your dbt State trial.


   <Tabs queryString="cli-version">
   <TabItem value="latest-versions" label="dbt v1.13 / dbt v2">

   1. Navigate to your project:

      ```bash
      cd to/your/project
      ```

   2. Log in to your dbt account:

      ```bash
      dbt login
      ```

      This opens a browser window where you can log in to or create a free dbt account. If you're creating a new account:

      1. Enter your name and password.
      2. Select **Enable a trial of dbt State**.
      3. Agree to the Terms of Service and click **Continue**.
      4. Sign in to <Constant name="dbt_platform" />.
      5. Set up an authentication method.
      6. Verify your email address.

   3. Agree to the dbt State Terms of Service and click **Start 30-day trial**.

      Once started, you cannot pause the trial. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

   You can also enable or disable dbt State per run using [CLI flags](/reference/global-configs/about-global-configs): `--manage-state` or `--no-manage-state`, or set the `DBT_ENGINE_MANAGE_STATE` environment variable.

   To enable dbt State for everyone on your project, add [`manage_state: true`](/reference/global-configs/about-global-configs) to the `flags:` block in `dbt_project.yml`:

   ```yaml
   flags:
     manage_state: true
   ```

   </TabItem>
   <TabItem value="core-legacy" label="dbt v1.7–1.12">

   dbt State is available as a plugin for dbt v1.7-1.12. If you are running on dbt v1.9 or older, we encourage you to upgrade to a [more recent version with ongoing support](/docs/dbt-versions#latest-releases).

   1. Navigate to your project:

      ```bash
      cd to/your/project
      ```

   2. Create and activate a virtual environment:

      ```bash
      python3 -m venv .venv
      source .venv/bin/activate
      ```

   3. Install the dbt State plugin:

      ```bash
      pip install dbt-state
      ```

   4. Run `dbt run` or `dbt build`.

      The first time you execute `dbt run` or `dbt build`, a browser window opens and prompts you to log in to or create a free dbt account. If you're creating a new account:

      1. Enter your name and password.
      2. Select **Enable a trial of dbt State**.
      3. Agree to the Terms of Service and click **Continue**.
      4. Sign in to <Constant name="dbt_platform" />.
      5. Set up an authentication method.
      6. Verify your email address.

   5. Agree to the dbt State Terms of Service and click **Start 30-day trial**.

      Once started, you cannot pause the trial. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

   The CLI flags `--manage-state` and `--no-manage-state` are not available in older <Constant name="core" /> versions. Use the environment variable (`DBT_ENGINE_ENABLE_STATE`) or project flag (`enable_state`) to enable or disable dbt State.

   </TabItem>
   </Tabs>

2. Run `dbt run` or `dbt build`.

   - **First run:** With no prior state to compare against, dbt builds every node from scratch. dbt State captures metadata from this run for future comparisons.
   - **Later runs:** dbt State compares each node's logic and upstream data against previous builds across all environments. It rebuilds a node when its logic has changed, or when its upstream data has changed and its last build is older than the [`lag_tolerance`](#configuring-lag-tolerance) window. Otherwise, it skips or clones an existing node.

   To see how dbt State optimizes your runs, refer to [dbt State usage examples](/docs/deploy/dbt-state-examples).

3. Set up your orchestration environment.

   - **Own orchestrator**: Before you can use dbt State in your own orchestrator, create a service token in <Constant name="dbt_platform" /> and configure your orchestration environment to use it. Refer to [Setting up authentication for non-interactive environments](/docs/deploy/dbt-state-cicd) for steps. Once configured, you can use your orchestrator to run dbt.
   - **<Constant name="dbt_platform" />**: Go to **Orchestration** to [create your environments](/docs/deploy/deploy-environments) and [jobs](/docs/deploy/jobs), then [enable dbt State on them](/docs/deploy/dbt-state-enable-env-jobs).

4. [Verify dbt State is active](#verify).

5. [Invite your team to use dbt State](#invite).

</TabItem>
<TabItem value="existing-account" label="Existing dbt platform account">

**Prerequisite**: You must be an admin in your <Constant name="dbt_platform" /> account.

1. Start your dbt State trial. 

   1. In your <Constant name="dbt_platform" /> account, click your account name in the lower-left corner above your username and click **Account settings**.

   2. Under **Settings**, go to **Billing & Usage** > **Usage-based features**.

   3. Under the **State** tab, click **Start free trial**.

      Once started, you cannot pause the trial. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

      :::info Extended trial for state-aware orchestration users
      If you were using state-aware orchestration prior to June 1, 2026, your dbt State trial will be extended beyond 30 days. If the extension isn't applied to your account, contact your account team.
      :::

   4. Review and agree to the terms of service.

   5. Click **Start 30-day trial**.

2. Click **Enable dbt State**.

3. Select where to enable dbt State. You can either enable:

   - **By environment**: Enables dbt State on the selected deployment or development environment. 
   
      - For deployment environments, new jobs automatically default to **Inherited from environment** and have dbt State enabled without additional configuration. Existing jobs are not automatically updated &mdash; you must [configure each job manually](/docs/deploy/dbt-state-enable-env-jobs#enabling-dbt-state-on-individual-jobs). 
      - For development environments, this [enables dbt State in the <Constant name="studio_ide" />](/docs/deploy/dbt-state-enable-studio).
      
      <!-- TODO (ORC-4324): When this ships, replace with:
      - **By environment**: Enables dbt State on the selected environment. New jobs automatically default to **Inherited from environment** and have dbt State enabled without additional configuration. Existing jobs with **dbt State** set to **Off** automatically switch to **Inherited from environment**, enabling dbt State for those jobs.
      -->
   - **By specific jobs**: Enables dbt State on individual jobs. To enable it on additional jobs, refer to [Enabling dbt State on individual jobs](/docs/deploy/dbt-state-enable-env-jobs#enabling-dbt-state-on-individual-jobs).

4. Click **Enable dbt State**.

5. [Verify dbt State is active](#verify).

6. [Invite your team to use dbt State](#invite).

</TabItem>
</Tabs>

## Verifying dbt State is active {#verify}

After a run completes, confirm that dbt State is active:

- **From the CLI:** Check the log output for a message like `dbt State adapter: dbt-state v2.10.1 is enabled`.
- **From <Constant name="dbt_platform" />:** Check the [logs view of built resources](/docs/deploy/dbt-state-interface#logs-view-of-built-resources) to see if they were built or reused, or open the [**Explain** tab](/docs/deploy/dbt-state-interface#explain-tab) on the job run details page to see the State decision for each resource.

If dbt State isn't behaving as expected, refer to [Debugging dbt State](#debugging-dbt-state).

## Inviting team members {#invite}

The more team members you have using dbt State, the better it gets; more team members means more opportunities to clone existing nodes rather than rebuilding them. To invite colleagues:

- **From the CLI (dbt v1.13+):** Have your colleagues run [`dbt login`](/reference/commands/login) after dbt State is enabled on the account.
- **From <Constant name="dbt_platform" />:** Go to **Account settings** > **Users** and click **Invite users**. For more information, refer to [Invite new users](/docs/platform/manage-access/invite-users#invite-new-users).

## Configuring lag tolerance

Lag tolerance controls how long dbt State waits before rebuilding a node once its upstream data changes. A node rebuilds only when its last build is older than the tolerance window and its upstream data has changed. You can set it at the project, environment, or model level. If not configured, `lag_tolerance` defaults to `45m`. We recommend starting with the following Jinja expression:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild once their last build is more than 4 hours old and their upstream data has changed. In all other environments, models rebuild once their last build is more than 7 days old and their upstream data has changed.

For more details, refer to the [`lag_tolerance` config reference](/reference/resource-configs/lag-tolerance).

<LagToleranceRecommendationsTip />

## Debugging dbt State

If dbt State is behaving unexpectedly, you can prepend your run command with the `DBT_ENGINE_MANAGE_STATE` environment variable to isolate the issue:

```bash
DBT_ENGINE_MANAGE_STATE=0 dbt run --target dev --select "customers"
```

To see which decision dbt State made for each node after a run and why, you can run the <VersionBlock firstVersion="2.0">[`dbt state explain`](/reference/commands/state-explain)</VersionBlock><VersionBlock lastVersion="1.99">[`dbt-state explain`](/reference/commands/state-explain)</VersionBlock> command. If you use the <Constant name="dbt_platform" />, the same information is available without running a command &mdash; go to the [**Explain** tab](/docs/deploy/dbt-state-interface#explain-tab) on the job run details page to see the full decision breakdown for each node.

## Next steps

- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
- [`dbt login` with dbt State](/reference/commands/login?version=2.0#dbt-login-with-dbt-state)
- [Configure deferral](/docs/deploy/dbt-state-deferral)
- [Setting up authentication for non-interactive environments](/docs/deploy/dbt-state-cicd)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Monitor dbt State activity](/docs/deploy/dbt-state-interface)
