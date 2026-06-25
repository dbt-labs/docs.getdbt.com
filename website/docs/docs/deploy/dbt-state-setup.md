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

- A supported dbt version or experience. dbt State is:
    - Natively available in <Constant name="dbt_platform" />, <Constant name="core" /> v1.12 and later, and the <Constant name="fusion_engine" />
    - Available as a plugin for <Constant name="core" /> v1.7 through v1.11
- A supported data platform. dbt State currently supports Snowflake, Databricks, BigQuery, and Redshift
- A supported dbt State account type. dbt State requires authentication through either:
   - A current <Constant name="dbt_platform" /> account*
   - A standalone dbt State account that's independent of <Constant name="dbt_platform" />
   
   To learn more about which account option is right for you, refer to [About dbt State](/docs/deploy/dbt-state-about#signing-up-for-dbt-state). For pricing information, refer to [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage).

*dbt State isn't available to users on [legacy Starter](/docs/platform/billing#legacy-plans) plans. If you're on a legacy Starter plan, [reach out to dbt Labs](https://www.getdbt.com/contact) for guidance.

More data warehouses are on the roadmap. If you're using another data warehouse and are interested in dbt State, [let us know](https://www.getdbt.com/contact).

## Setting up dbt State

Set up dbt State either in <Constant name="dbt_platform" /> or locally in <Constant name="core" /> by using the following steps depending on how you're using dbt.

<Tabs>
<TabItem value="platform" label="dbt platform">

#### Enabling dbt State on your account

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

#### Enabling dbt State in Studio

When you enable dbt State in the <Constant name="studio_ide" />, it runs automatically on every `dbt run` or `dbt build` during development &mdash; skipping unchanged models and reusing production results so your runs are _faster_.

You can [turn it on for your development environment](#enabling-dbt-state-on-a-development-environment) so it's the default for everyone, or you can [override that setting just for your own account](#overriding-dbt-state-setting-per-user).

**Prerequisite**: An account admin must [enable dbt State](#enabling-dbt-state-on-your-account) before you can use it.

##### Enabling dbt State on a development environment

Enabling dbt State on your development environment turns it on for everyone using the <Constant name="studio_ide" />, unless they override it for their own account.

1. Go to **Orchestration** > **Environments** and select your development environment.
2. Click **Settings** > **Edit**.
3. In the **dbt State** section, select **Enable dbt State**.
4. Click **Save**. 
5. In the pop-up box, click **Continue** if you want to go ahead with the changes and restart all IDE sessions for this project.

##### Overriding dbt State setting per user

You can override the development environment's dbt State setting for your own account without affecting other users. Because the user-level setting takes precedence over the environment-level setting, you can turn dbt State on for yourself before enabling it for your whole team, or turn it off when it's enabled at the environment level.

1. Click your account name in the lower-left corner and select **Account settings**.
2. Under **Your profile**, go to **Credentials**.
3. Select the project you want to enable dbt State for.
4. Click **Edit** and go to the **User development settings** section.
5. Under **dbt State**, select one of the following options:
   - **Enabled**: Enables dbt State for your user regardless of the development environment setting.
   - **Disabled**: Disables dbt State for your user regardless of the development environment setting.
   - **Reset (inherit from development)**: Only appears after you've saved an **Enabled** or **Disabled** override. Clears your override and falls back to the dbt State setting configured on your development environment.
6. Click **Save**.

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

   This opens a browser window where you can log in with your <Constant name="dbt_platform" /> account or the [standalone dbt State app](https://app.state.dbt.com). For details on authentication behavior and how it affects [`user_settings.yml`](/reference/global-configs/user-settings), refer to [`dbt login` with dbt State](#dbt-login-with-dbt-state).

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

## How `dbt login` works with dbt State

When [dbt State](/docs/deploy/dbt-state-about) is enabled, [`dbt login`](/reference/commands/login?#dbt-login---help) is used for dbt State authentication. Running this command opens a browser window with two options:

- **Log in with your <Constant name="dbt_platform" /> account**: Enter your email address. If you don't have a <Constant name="dbt_platform" /> account, dbt Labs will create a standalone [Developer account](https://www.getdbt.com/pricing) for you. After that, you'll authorize access between the CLI and <Constant name="dbt_platform" />.
- **Log in without a <Constant name="dbt_platform" /> account**: Redirects you to the dbt State standalone app at [app.state.dbt.com](https://app.state.dbt.com), where a token is created and stored locally at `~/.dbt/auth_state.json`. dbt State is automatically enabled locally after account creation.

In the <Constant name="fusion_engine" />, after platform authentication, the CLI checks your configuration and responds accordingly:

<SimpleTable>

| dbt State enabled in <Constant name="dbt_platform" />? | dbt State enabled locally? | Behavior |
|---|---|---|
| ✅ | ✅ | dbt State is ready to use. |
| ✅ | ❌ | CLI prompts you to enable dbt State locally. If you confirm, [`user_settings.yml`](/reference/global-configs/user-settings) is updated automatically. |
| ❌ | ✅ | CLI prompts you to enable dbt State in your platform account. |

</SimpleTable>

In <Constant name="core" /> v1.12, `dbt login` automatically sets `manage_state: true` in [`user_settings.yml`](/reference/global-configs/user-settings) after platform authentication, unless you've explicitly disabled it. Whether dbt State is enabled in your <Constant name="dbt_platform" /> account is checked when you run a dbt command &mdash; if it's not enabled, dbt will fail on your next `dbt run` or `dbt build`. To resolve this, refer to [User settings](/reference/global-configs/user-settings#when-dbt-state-is-enabled-locally-but-not-in-dbt-platform).

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
- [Non-interactive environment setup](/docs/deploy/dbt-state-cicd)
- [Configuring deferral](/docs/deploy/dbt-state-deferral)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
- [dbt State usage and pricing](/docs/platform/billing#dbt-state-usage)
