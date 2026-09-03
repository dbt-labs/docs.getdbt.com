---
title: "Setting up dbt State"
sidebar_label: "Set up dbt State"
description: "Learn how to install and configure dbt State across dbt Core, dbt platform, and Fusion."
id: "dbt-state-setup"
tags: ['dbt State']
availability: everywhere_usage
---

# Setting up dbt State <Lifecycle status="preview" />

This page walks you through setting up dbt State across <Constant name="core" />, <Constant name="dbt_platform" />, and <Constant name="fusion" />.

## Prerequisites

Before you set up dbt State, make sure you have:

- **A supported dbt version**: dbt State is natively available in <Constant name="dbt_platform" /> and the <Constant name="fusion_engine" />. It's also available as a plugin for <Constant name="core" /> v1.7–1.12.
- **A supported data platform**: Snowflake, Databricks, BigQuery, or Redshift. More warehouses are on the roadmap.
- **A <Constant name="dbt_platform" /> account**: Refer to [About dbt State](/docs/deploy/dbt-state-about#signing-up-for-dbt-state) for sign-up details, and [dbt State usage and pricing](/docs/platform/billing/dbt-state-usage) for pricing details. Note that dbt State isn't available on [legacy Starter](/docs/platform/billing/plans-and-billing#legacy-plans) plan. Please [contact dbt Labs](https://www.getdbt.com/contact) if that applies to you.

## Setting up dbt State

Set up dbt State either in <Constant name="dbt_platform" /> or locally in <Constant name="core" /> by using the following steps depending on how you're using dbt:

- Already logged in to <Constant name="dbt_platform" /> and managing your account? Use **dbt Account settings**.
- Signing up or logging in through the [dbt platform sign-up page](http://us1.dbt.com/register?_dbtsrc=dbt-state)? Use **dbt platform sign-up**.
- Using the CLI? Use **dbt v2** or **dbt v1.7-1.12**.

<Tabs queryString="type">
<TabItem value="account-settings" label="dbt Account settings">

#### Enabling dbt State on your account

**Prerequisite**: You must be an admin in your <Constant name="dbt_platform" /> account.

To enable dbt State:

1. In your <Constant name="dbt_platform" /> account, click your account name in the lower-left corner above your username and click **Account settings**.

2. Under **Settings**, go to **Billing & Usage** > **Usage-based features**.

3. Under the **State** tab, click **Start free trial**.

   Once started, you cannot pause the trial. After 30 days, you must add a credit card or enterprise contract to continue. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

   :::info Extended trial for state-aware orchestration users
   If you were using state-aware orchestration prior to June 1, 2026, your dbt State trial will be extended beyond 30 days. If the extension isn’t applied to your account, contact your account team.
   :::

4. Review and agree to the terms of service.

5. Click **Start 30-day trial**.

6. Click **Enable dbt State**.

7. Select the jobs to enable dbt State for. You can either enable:

   - **By environment**: Enables dbt State on all existing jobs within the selected environment at once. New jobs created in that environment will have dbt State enabled automatically.
   - **By specific jobs**: Enables dbt State on individual jobs. To enable it on additional jobs later, refer to [Enabling dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs).

8. Click **Enable dbt State**.

For next steps, see:
- [Enable dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs)
- [Enable dbt State in Studio](/docs/deploy/dbt-state-enable-studio)

</TabItem>
<TabItem value="platform-signup" label="dbt platform sign-up">

1. Go to the [dbt platform sign-up page](http://us1.dbt.com/register?_dbtsrc=dbt-state) to create a new account or log in to an existing one.

   - If you're new to dbt platform, enter your email address and click **Continue**.
      1. Enter your name and password, and agree to the Terms of Service.
      2. Click **Continue**.
      3. Verify your email address.
   - If you already have a dbt platform account, log in with your existing credentials.

2. Agree to the dbt State Terms of Service and click **Start 30-day trial**.
   
   Once started, you cannot pause the trial. After 30 days, you must add a credit card or enterprise contract to continue. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

4. Go to **Orchestration** to create your environments and jobs. For next steps, see:
   - [Enable dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs)
   - [Enable dbt State in Studio](/docs/deploy/dbt-state-enable-studio)

</TabItem>
<TabItem value="fusion" label="v2">

1. Navigate to your project:

   ```bash
   cd to/your/project
   ```

2. Log in to <Constant name="dbt_platform" />:

   ```bash
   dbt login
   ```

   This opens a browser window where you can log in to or create a <Constant name="dbt_platform" /> account.

   For details on authentication behavior, refer to [`dbt login` with dbt State](/reference/commands/login?version=2.0#dbt-login-with-dbt-state). 

3. If prompted to choose your goal, select **Set up dbt State**. The **Start your dbt State trial** dialog appears.

4. Agree to the dbt State Terms of Service and click **Start 30-day trial**.
   
   Once started, you cannot pause the trial. After 30 days, you must add a credit card or enterprise contract to continue. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

dbt State is now enabled and will run automatically on every `dbt run` or `dbt build`. 

You can also enable or disable dbt State per run using [CLI flags](/reference/global-configs/about-global-configs): `--manage-state` or `--no-manage-state`, or set the `DBT_ENGINE_MANAGE_STATE` environment variable. 

To enable dbt State for everyone on your project, add [`manage_state: true`](/reference/global-configs/about-global-configs) to the `flags:` block in `dbt_project.yml`:

```yaml
flags:
  manage_state: true
```

</TabItem>

<TabItem value="core-legacy" label="dbt v1.7-1.12">

dbt State is available as a plugin for <Constant name="core" /> v1.7+. If you are running on <Constant name="core" /> v1.9 or older, we encourage you to upgrade to a [more recent version with ongoing support](/docs/dbt-versions#latest-releases).

To install the plugin:

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

4. Run `dbt run` or `dbt build`

   The first time you execute `dbt run` or `dbt build`, a browser window opens where you can log in to or create a <Constant name="dbt_platform" /> account.

5. If prompted to choose your goal, select **Set up dbt State**. The **Start your dbt State trial** dialog appears.

6. Agree to the dbt State Terms of Service and click **Start 30-day trial**. 

   Once started, you cannot pause the trial. After 30 days, you must add a credit card or enterprise contract to continue. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

dbt State is now enabled and will run automatically on every `dbt run` or `dbt build`. 

The CLI flags `--manage-state` and `--no-manage-state` are not available in older <Constant name="core" /> versions. Use the environment variable (`DBT_ENGINE_ENABLE_STATE`) or project flag (`enable_state`) to enable or disable dbt State.

</TabItem>
</Tabs>

To see how dbt State optimizes your runs, refer to [dbt State usage examples](/docs/deploy/dbt-state-examples).

## Configuring lag tolerance

Lag tolerance allows you to set a tolerance level for older data at the project, environment, or model level. If not configured, `lag_tolerance` defaults to `45m`. We recommend starting with the following Jinja expression:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild only when upstream data is more than 4 hours old. In all other environments, models wait 7 days before rebuilding.

For more details, refer to the [`lag_tolerance` config reference](/reference/resource-configs/lag-tolerance).

## Inviting team members

The more team members you have using dbt State, the better it gets; more team members means more opportunities to clone existing nodes rather than rebuilding them. To invite colleagues:

- From the <Constant name="core_v2" /> CLI: Have your colleagues run [`dbt login`](/reference/commands/login?version=2.0) after dbt State is enabled on the account.
- From <Constant name="dbt_platform" />: Go to **Account settings** > **Users** and click **Invite users**. For more information, refer to [Invite new users](/docs/platform/manage-access/invite-users#invite-new-users).

## Debugging dbt State

If dbt State is behaving unexpectedly, you can prepend your run command with the `DBT_ENGINE_MANAGE_STATE` environment variable to isolate the issue:

```bash
DBT_ENGINE_MANAGE_STATE=0 dbt run --target dev --select "customers"
```

To see which decision dbt State made for each node after a run and why, you can run the <VersionBlock firstVersion="2.0">[`dbt state explain`](/reference/commands/state-explain)</VersionBlock><VersionBlock lastVersion="1.99">[`dbt-state explain`](/reference/commands/state-explain)</VersionBlock> command. If you use the <Constant name="dbt_platform" />, the same information is available without running a command &mdash; go to the [**Explain** tab](/docs/deploy/run-visibility#explain-tab) on the job run details page to see the full decision breakdown for each node.

## Next steps

- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
- [`dbt login` with dbt State](/reference/commands/login?version=2.0#dbt-login-with-dbt-state)
- [Configure deferral](/docs/deploy/dbt-state-deferral)
- [Non-interactive environment setup](/docs/deploy/dbt-state-cicd)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)

