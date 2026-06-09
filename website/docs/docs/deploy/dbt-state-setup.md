---
title: "Setting up dbt State"
sidebar_label: "Set up dbt State"
description: "Learn how to install and configure dbt State across dbt Core, dbt platform, and Fusion."
id: "dbt-state-setup"
tags: ['dbt State']
---

# Setting up dbt State <Lifecycle status="preview" />

dbt State is natively available in <Constant name="dbt_platform" /> and locally in <Constant name="core" /> v1.12+ and the <Constant name="fusion_engine" />. It is also available as a plugin for older versions of <Constant name="core" /> (1.7-1.11).

Once enabled, dbt State runs automatically on every `dbt run` or `dbt build`.

Before you begin:

- dbt State supports Snowflake, Databricks, BigQuery, and Redshift.
- dbt State requires authentication either through a <Constant name="dbt_platform" /> account, or a [standalone account](https://app.state.dbt.com) that's independent of <Constant name="dbt_platform" />. For details on which option is right for you, refer to [About dbt State](/docs/deploy/dbt-state-about#signing-up-for-dbt-state). For pricing information, refer to [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage).

Select the option that matches your setup:

<Tabs>
<TabItem value="platform" label="dbt platform">

**Prerequisite**: You must be an admin in your <Constant name="dbt_platform" /> account.

To enable dbt State:

1. In your <Constant name="dbt_platform" /> account, click your account name in the lower-left corner above your username and click **Account settings**.
2. Under **Settings**, go to **State**.
3. Click **Start your 30-day free trial**.

   Once started, you cannot pause the trial. After 30 days, you must add a credit card or enterprise contract to continue. For more information, refer to [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage).

      :::info Extended trial for state-aware orchestration users
      If you're using state-aware orchestration prior to June 1, 2026, your dbt State trial will be extended until the billing period begins on September 1, 2026. If the extension isn’t applied to your account, contact your account team.
      :::

4. Review and agree to the terms of service.

5. Click **Start 30-day trial**.

6. Click **Enable dbt State**.

   <Lightbox src="/img/docs/dbt-state/dbt_state_enable.png" title="dbt State page" />

7. In the **Upgrade to dbt State** page, select the jobs to enable dbt State for. You can either enable:

   - **By environment**: Enables dbt State on all existing jobs within the selected environment at once. New deploy jobs created in that environment will have dbt State enabled automatically.
   - **By specific jobs**: Enables dbt State on individual jobs. To enable it on additional jobs later, refer to [Enabling dbt State on individual jobs](#enabling-dbt-state-on-individual-jobs).

8. Click **Enable dbt State**.

The **dbt State** page where you started your trial in step 3 displays how many days remain in your trial period alongside the following monthly data:

- Number of models reused
- Total % build reduction
- Total query run time reduction 

#### Enabling dbt State on individual jobs

To enable dbt State on any job &mdash; whether already existing or newly created in an environment that doesn't have dbt State enabled:

1. Go to **Orchestration** > **Jobs**.
2. Select the job you want dbt State enabled for.
3. Click **Settings** > **Edit**.
4. In the **Execution settings** section of the job, select **Enable dbt State**.
5. Click **Save**.

</TabItem>
<TabItem value="fusion" label="dbt Core 1.12 / Fusion">

1. Navigate to your project:

   ```bash
   cd to/your/project
   ```

2. Log in to dbt State:

   ```bash
   dbt login
   ```

   This opens a browser window where you can log in with your <Constant name="dbt_platform" /> account or the [standalone dbt State app](https://app.state.dbt.com). For details on authentication behavior and how it affects [`user_settings.yml`](/reference/global-configs/user-settings), refer to [`dbt login`](/reference/commands/login#dbt-login-with-dbt-state).

   If dbt State is already enabled on your <Constant name="dbt_platform" /> account, you'll be prompted to enable it on your machine. You can change this at any time by editing the settings file located at `~/.dbt/user_settings.yml`. For more information about login behavior, refer to [`dbt login` with dbt State](/reference/commands/login#dbt-login-with-dbt-state).

dbt State is now enabled and will run automatically on every `dbt run` or `dbt build`. 

You can also enable or disable dbt State per run using [CLI flags](/reference/global-configs/about-global-configs): `--manage-state` or `--no-manage-state`, or set the `DBT_ENGINE_MANAGE_STATE` environment variable. 

To enable dbt State for everyone on your project, add [`manage_state: true`](/reference/global-configs/about-global-configs) to the `flags:` block in `dbt_project.yml`:

```yaml
flags:
  manage_state: true
```

</TabItem>

<TabItem value="core-legacy" label="dbt Core 1.7–1.11">

dbt State is available as a plugin for older versions of <Constant name="core" /> (v1.7+). If you are running on <Constant name="core" /> v1.9 or older, we encourage you to upgrade to a [more recent version with ongoing support](/docs/dbt-versions#latest-releases).

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

dbt State works out of the box, but the following steps can help you get more value from it.

- [Configuring lag tolerance](#configuring-lag-tolerance)
- [Configuring deferral](#configuring-deferral)

## Configuring lag tolerance

Lag tolerance allows you to set a tolerance level for older data at the project, environment, or model level. We recommend starting with the following Jinja expression, which tolerates older data locally and requires fresher data in production. As you get a better feel for where adjustments make sense, you can tune individual models.

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild only when upstream data is more than 4 hours old. In all other environments, models wait 7 days before rebuilding.

For more details, refer to the [`lag_tolerance` config reference](/reference/resource-configs/lag-tolerance).

## Configuring deferral

By default, dbt State defers to your production environment. To customize which environment dbt defers to, use the [`defer_to_target`](/reference/resource-configs/defer-to-target) config.

For the full list of available configs, see [dbt State configs](/reference/resource-configs/dbt-state-configs).

## Inviting team members

The more team members you have using dbt State, the better it gets; more team members means more opportunities to clone existing nodes rather than rebuilding them.

- **For [standalone app](https://app.state.dbt.com) users**: Click the invite link in the upper-right corner of the **Users** page.
- **For <Constant name="dbt_platform" /> users**: Have your colleagues run [`dbt login`](/reference/commands/login) after dbt State is enabled on the account.

## Debugging dbt State

If dbt State is behaving unexpectedly, you can prepend your run command with the `DBT_ENGINE_MANAGE_STATE` environment variable to isolate the issue:

```bash
DBT_ENGINE_MANAGE_STATE=1 dbt run --target dev --select "customers"
```

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [CI/CD setup](/docs/deploy/dbt-state-cicd)
- [Configuring deferral](/docs/deploy/dbt-state-deferral)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
- [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage)
