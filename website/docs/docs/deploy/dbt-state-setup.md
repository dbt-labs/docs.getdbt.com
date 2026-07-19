---
title: "Setting up dbt State"
sidebar_label: "Set up dbt State"
description: "Learn how to install and configure dbt State across dbt Core, dbt platform, and Fusion."
id: "dbt-state-setup"
tags: ['dbt State']
---

# Setting up dbt State <Lifecycle status="preview" />

This page walks you through setting up dbt State across <Constant name="core" />, <Constant name="dbt_platform" />, and <Constant name="fusion" />.

## Prerequisites

Before you set up dbt State, make sure you have:

- **A supported dbt version**: dbt State is natively available in <Constant name="dbt_platform" /> and the <Constant name="fusion_engine" />. It's also available as a plugin for <Constant name="core" /> v1.7–1.12.
- **A supported data platform**: Snowflake, Databricks, BigQuery, or Redshift. More warehouses are on the roadmap.
- **A dbt State account**: Authenticate through a <Constant name="dbt_platform" /> account or a [standalone dbt State account](https://app.state.dbt.com). Refer to [About dbt State](/docs/deploy/dbt-state-about#signing-up-for-dbt-state) to choose the right option, and [dbt State usage and pricing](/docs/platform/billing/dbt-state-usage) for pricing details. Note that dbt State isn't available on [legacy Starter](/docs/platform/billing/plans-and-billing#legacy-plans) plan. Please [contact dbt Labs](https://www.getdbt.com/contact) if that applies to you.

## Setting up dbt State

Set up dbt State either in <Constant name="dbt_platform" /> or locally in <Constant name="core" /> by using the following steps depending on how you're using dbt.

<Tabs queryString="type">
<TabItem value="platform" label="dbt platform">

#### Enabling dbt State on your account

**Prerequisite**: You must be an admin in your <Constant name="dbt_platform" /> account.

To enable dbt State:

1. In your <Constant name="dbt_platform" /> account, click your account name in the lower-left corner above your username and click **Account settings**.

2. Under **Settings**, go to **Billing & Usage** > **Usage-based features**.

3. Under the **State** tab, click **Start free trial**.

   Once started, you cannot pause the trial. After 30 days, you must add a credit card or enterprise contract to continue. For information about how the trial period and billing work, refer to [dbt State trial and billing](/docs/deploy/dbt-state-trial).

   :::info Extended trial for state-aware orchestration users
   If you're using state-aware orchestration prior to June 1, 2026, your dbt State trial will be extended until the billing period begins on September 1, 2026. If the extension isn’t applied to your account, contact your account team.
   :::

4. Review and agree to the terms of service.

5. Click **Start 30-day trial**.

6. Click **Enable dbt State**.

7. Select the jobs to enable dbt State for. You can either enable:

   - **By environment**: Enables dbt State on all existing jobs within the selected environment at once. New deploy jobs created in that environment will have dbt State enabled automatically.
   - **By specific jobs**: Enables dbt State on individual jobs. To enable it on additional jobs later, refer to [Enabling dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs).

8. Click **Enable dbt State**.

For next steps, see:
- [Enable dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs)
- [Enable dbt State in Studio](/docs/deploy/dbt-state-enable-studio)

</TabItem>
<TabItem value="fusion" label="Fusion">

1. Navigate to your project:

   ```bash
   cd to/your/project
   ```

2. Log in to dbt State:

   ```bash
   dbt login
   ```

   This opens a browser window where you can log in with your <Constant name="dbt_platform" /> account or the [standalone dbt State app](https://app.state.dbt.com). For details on authentication behavior and how it affects [`user_settings.yml`](/reference/global-configs/user-settings), refer to [`dbt login` with dbt State](/reference/commands/login#dbt-login-with-dbt-state).

dbt State is now enabled and will run automatically on every `dbt run` or `dbt build`. 

You can also enable or disable dbt State per run using [CLI flags](/reference/global-configs/about-global-configs): `--manage-state` or `--no-manage-state`, or set the `DBT_ENGINE_MANAGE_STATE` environment variable. 

To enable dbt State for everyone on your project, add [`manage_state: true`](/reference/global-configs/about-global-configs) to the `flags:` block in `dbt_project.yml`:

```yaml
flags:
  manage_state: true
```

</TabItem>

<TabItem value="core-legacy" label="dbt Core 1.7–1.12">

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

dbt State is now enabled. The first time you execute `dbt run` or `dbt build`, a browser window opens where you can log in with your <Constant name="dbt_platform" /> account or the [standalone dbt State app](https://app.state.dbt.com). After authenticating, dbt State runs automatically on every `dbt run` or `dbt build`.

The CLI flags `--manage-state` and `--no-manage-state` are not available in older <Constant name="core" /> versions. Use the environment variable (`DBT_ENGINE_ENABLE_STATE`) or project flag (`enable_state`) to enable or disable dbt State.

</TabItem>
</Tabs>

To see how dbt State optimizes your runs, refer to [dbt State usage examples](/docs/deploy/dbt-state-examples).

## Configuring lag tolerance

Lag tolerance allows you to set a tolerance level for older data at the project, environment, or model level. We recommend starting with the following Jinja expression:

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

The more team members you have using dbt State, the better it gets; more team members means more opportunities to clone existing nodes rather than rebuilding them.

- **For [standalone app](https://app.state.dbt.com) users**: Click the invite link in the upper-right corner of the **Users** page.
- **For <Constant name="dbt_platform" /> users**: Have your colleagues run [`dbt login`](/reference/commands/login) after dbt State is enabled on the account.

## Debugging dbt State

If dbt State is behaving unexpectedly, you can prepend your run command with the `DBT_ENGINE_MANAGE_STATE` environment variable to isolate the issue:

```bash
DBT_ENGINE_MANAGE_STATE=0 dbt run --target dev --select "customers"
```

## Next steps

- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
- [`dbt login` with dbt State](/reference/commands/login#dbt-login-with-dbt-state)
- [Configure deferral](/docs/deploy/dbt-state-deferral)
- [Non-interactive environment setup](/docs/deploy/dbt-state-cicd)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)

