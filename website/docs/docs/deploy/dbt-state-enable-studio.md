---
title: "Enabling dbt State in Studio"
sidebar_label: "Enable in Studio"
description: "Enable dbt State in the dbt Studio IDE for faster development runs, either at the environment level or per user."
id: "dbt-state-enable-studio"
tags: ['dbt State']
---

# Enabling dbt State in Studio <Lifecycle status="preview" />

When you enable dbt State in the <Constant name="studio_ide" />, it runs automatically on every `dbt run` or `dbt build` during development &mdash; skipping unchanged models and reusing production results so your runs are _faster_.

You can [turn it on for your development environment](#enabling-dbt-state-on-a-development-environment) so it's the default for everyone, or you can [override that setting just for your own account](#overriding-dbt-state-setting-per-user).

**Prerequisite**: An account admin must [enable dbt State](/docs/deploy/dbt-state-setup) before you can use it.

## Enabling dbt State on a development environment

Enabling dbt State on your development environment turns it on for everyone using the <Constant name="studio_ide" />, unless they override it for their own account.

1. Go to **Orchestration** > **Environments** and select your development environment.
2. Click **Settings** > **Edit**.
3. In the **dbt State** section, select **Enable dbt State**.
4. Click **Save**.
5. In the pop-up box, click **Continue** if you want to go ahead with the changes and restart all IDE sessions for this project.

## Overriding dbt State setting per user

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

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [Enable dbt State on individual jobs](/docs/deploy/dbt-state-enable-jobs)
