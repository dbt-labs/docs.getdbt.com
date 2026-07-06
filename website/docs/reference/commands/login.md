---
title: "About dbt login"
sidebar_label: "login"
id: "login"
description: "Use dbt login in dbt Core v2.0 and later to authenticate and unlock gated features across dbt tools."
intro_text: "Use dbt login to authenticate once and unlock gated features across dbt tools."
---

:::info
Available in <Constant name="dbt" /> v1.12 and v2.0 and later.
:::

Run `dbt login` from the command line to unlock advanced dbt features. It'll open browser-based authentication where you can sign in to your existing <Constant name="dbt_platform" /> account or create a free one &mdash; no credit card required!

Run [`dbt login status`](#dbt-login-status) to view your current authentication status.

## When to use dbt login

`dbt login` is an interactive, browser-based sign-in flow for local development on macOS, Linux, and Windows. Use `dbt login` to unlock advanced features including:

- advanced features in the [dbt VS Code extension](/docs/about-dbt-extension)
- [dbt State](/docs/deploy/dbt-state-setup?version=2.0#how-dbt-login-works-with-dbt-state)
- advanced features in v2.0 CLI

Refer to [VS Code extension features](/docs/fusion/fusion-availability?version=1.13#dbt-vs-code-extension-features) for the full list of features and their availability.

`dbt login` doesn't support non-interactive authentication. For [non-interactive](#non-interactive-environments) environments, such as CI/CD jobs, scheduled jobs, or external orchestrators, use a service token instead.

## Before you log in

Downloading the dbt VS Code extension gives you 14 days to try [advanced features](/docs/fusion/fusion-availability#dbt-vs-code-extension-features) &mdash; no account needed. After the trial ends, sign in to or create a free <Constant name="dbt_platform" /> account to keep using them. The vast majority of features keep working either way.

This 14-day trial applies to the dbt VS Code extension only. It's separate from the [dbt platform trial](https://www.getdbt.com/pricing) and doesn't require a credit card or a paid plan.

A free <Constant name="dbt_platform" /> account keeps advanced features working after your trial ends and carries your access across all your dbt tools &mdash; the CLI, the VS Code extension, and dbt State &mdash; so you only log in once. No credit card required.

Run `dbt login` to create a free account, or log in to an existing one. Logging in is simply how dbt confirms your access to advanced features in local development.

Note that this is separate from [<Constant name="dbt_platform"/> user license types](/docs/platform/manage-access/seats-and-users?version=2.0&name=Fusion) (such as Developer or Analyst), which controls what you can do _inside_ <Constant name="dbt_platform" />.

Refer to [VS Code extension features](/docs/fusion/fusion-availability#dbt-vs-code-extension-features) for the full list of features and their availability.

<VersionBlock firstVersion="1.12">

## `dbt login` with dbt State

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

</VersionBlock>

## Authentication methods

`dbt login` is interactive only. It opens a browser-based sign-in flow and stores your session locally.

You can log into dbt either using [interactive](#interactive-authentication) or [non-interactive](#non-interactive-environments) methods.

### Interactive authentication

Use `dbt login` when you're developing locally in a terminal or IDE and can complete sign-in in a browser.

- When you run `dbt login`, dbt opens a browser-based authentication flow. After you complete authentication, dbt stores your login state locally and confirms that you're signed in.
- After you sign in, dbt can use your login state to unlock advanced features across the dbt CLI, VS Code extension, and dbt State.
- Your session stays active across terminal sessions, and dbt refreshes it automatically while you're active. As long as you use dbt at least once every 7 days, you stay signed in. If you're inactive for longer, dbt prompts you to run `dbt login` again. Refer to [Staying signed in](#staying-signed-in) for details.

Run `dbt login` from your **local terminal** (not in the <Constant name="dbt_platform" /> UI).

**Example (interactive):**

```shell
dbt login
dbt login status
```

Complete the browser prompts to sign in or register for a <Constant name="dbt_platform" /> account.

### Non-interactive environments

Non-interactive means dbt runs without a person at a keyboard to open a browser — for example, a GitHub Actions workflow, a cron job, or a scheduled <Constant name="dbt_platform" /> job. There is no separate "non-interactive login" command. You do not run `dbt login` in these environments.

If you are new to dbt, start with [interactive authentication](#interactive-authentication). You only need the guidance in this section when you automate dbt runs.

#### Authenticate with a service token

In non-interactive environments (such as CI/CD jobs, scheduled jobs, or external orchestrators like Airflow), use a [service token](/docs/dbt-apis/service-tokens) instead of `dbt login`. The service token does two jobs:
- authenticates the run 
- unlocks access to advanced features, so they work in your pipeline the same way they do locally.

Unlike interactive `dbt login`, service tokens don't expire, so there's nothing to refresh. Rotate them yourself in <Constant name="dbt_platform" /> when you need to.

Set the following [environment variables](/docs/build/environment-variables#special-environment-variables) so dbt can authenticate and unlock that access:

<SimpleTable>

| Environment variable | Description |
|---|---|
| `DBT_CLOUD_ACCOUNT_HOST` | Your <Constant name="dbt_platform" /> [access URL](/docs/platform/about-platform/access-regions-ip-addresses) (for example, `abc123.us1.dbt.com`). |
| `DBT_CLOUD_ACCOUNT_ID` | Your <Constant name="dbt_platform" /> account ID. |
| `DBT_CLOUD_TOKEN` | The service token value. Create a service token with a permission set that includes feature licensing access, such as `Job Runner`, `Job Creator`, `Job Admin`, `Developer`, or `Account Admin`. |
| `DBT_CLOUD_PROJECT_ID` | Your <Constant name="dbt_platform" /> project ID. |

</SimpleTable>

```shell
export DBT_CLOUD_ACCOUNT_HOST=abc123.us1.dbt.com
export DBT_CLOUD_ACCOUNT_ID=12345
export DBT_CLOUD_TOKEN=dbtc_xxxxxxxx
export DBT_CLOUD_PROJECT_ID=67890
```

<Expandable title="What to do in common scenarios">

**I develop on my laptop (VS Code, Cursor, or a local terminal)**

1. Run `dbt login` once in your terminal, or [sign in or register](/docs/sign-in-dbt-extension) from the dbt VS Code extension.
2. Use dbt normally. Your login applies across the CLI, extension, and other tools on that machine.

**I run jobs in <Constant name="dbt_platform" /> (scheduled deploys, CI jobs in the product)**

1. Do not run `dbt login` in the job. <Constant name="dbt_platform" /> runs dbt for you using credentials from the deployment environment.
2. In <Constant name="dbt_platform" />, go to **Orchestration** → **Environments** and configure [environment variables](/docs/build/environment-variables#setting-and-overriding-environment-variables) and deployment credentials for that environment.
3. Use the `DBT_ENV_SECRET_` prefix for sensitive values referenced in your project with `env_var()`. Refer to [Handling secrets](/docs/build/environment-variables#handling-secrets).

**I need a token for an API integration (not for `dbt login`)**

1. In <Constant name="dbt_platform" />, go to **Account settings** → **Service tokens** and create a token. Refer to [Service account tokens](/docs/dbt-apis/service-tokens).
2. Store the token wherever that integration's documentation tells you to (for example, your CI secret store or MCP server config). That path is separate from `dbt login`.

</Expandable>

## How shared login works across dbt tools

- Use `dbt login` to authenticate with [dbt State](/docs/deploy/dbt-state-about).
You can start the sign-in flow from the [dbt VS Code extension](/docs/about-dbt-extension):
- If you run `dbt login` from the CLI, the dbt VS Code extension uses that login in your next extension session.
- If you sign in from the dbt VS Code extension, you can use that login the next time you run a login-gated command.


When you run a command or use a feature that requires authentication, dbt checks your current login state. If you're signed in, the feature runs. If you're not signed in, dbt tells you which feature requires authentication and prompts you to run `dbt login`.

For the VS Code extension registration flow, refer to [Sign in or register](/docs/sign-in-dbt-extension).

## Staying signed in

Once you log in, dbt keeps you signed in automatically &mdash; you usually won't notice it at all.

You stay signed in as long as you use dbt at least once every 7 days. If you're inactive for longer than that, dbt might ask you to log in again in your next session to ensure security.

If your access expires, run `dbt login` to sign back in.
- On the 14-day trial without a dbt account? Create a free account with `dbt login` &mdash; it's the best way to use the [full set of features](/docs/fusion/fusion-availability#dbt-vs-code-extension-features) and get the most out of the extension. 
- Not ready to run `dbt login`? No worries &mdash; continue using the vast majority of features after the trial ends.

If you're not sure where you stand, run [`dbt license info`](#troubleshooting) to check your status.

<Expandable title="How staying signed in works under the hood">

The only number that matters to you is 7 days: use dbt at least once a week and you stay signed in. Here's what happens behind the scenes to make that work.

Once you've logged in, dbt keeps two short-lived credentials fresh for you, automatically and in the background &mdash; you don't need to do anything:

- A 24-hour access token validates your access to advanced features. dbt renews it about once an hour whenever it can reach <Constant name="dbt_platform" />, so it never actually runs out while you're working &mdash; you won't hit the 24-hour limit in practice.
- A 7-day sign-in backs those renewals. Any dbt activity resets the 7-day clock, so the only way to get signed out is to not use dbt for more than 7 days straight.

If you go offline, your current access keeps working until it expires, and dbt retries the next time you run a command.

</Expandable>

## Usage

This page lists the commands and output you can use with `dbt login`:
- [`dbt login`](#dbt-login)
- [`dbt login --help`](#dbt-login---help)
- [`dbt login status`](#dbt-login-status)
- [`dbt license info`](#dbt-license-info)

### dbt login

Run `dbt login` from your terminal to open browser-based authentication:

```shell
dbt login
```

The CLI opens your default browser and shows the authentication URL:

```text
Opening your browser to complete login...
→ https://us1.dbt.com/register

If you need to reset your password, complete the reset, then re-run dbt login to finish authenticating.
Waiting for authentication…
```

After you sign in or register, dbt saves your credentials to your local dbt configuration directory:

- macOS and Linux: `~/.dbt/`
- Windows: `C:\Users\[username]\.dbt\`

Refer to [Staying signed in](#staying-signed-in) for details on how long you stay signed in.

When authentication completes successfully, the CLI shows:

```text
Congratulations! You are now signed in.
```

When authentication fails, the CLI shows:

```text
Authentication failed. Re-run dbt login to try again.

[Placeholder for user-facing error message on failure reason]
```

:::note dbt State and dbt login
If you have a <Constant name="dbt_platform" /> account, you can use the same account to authenticate with dbt State — no separate sign-in required. For full dbt State setup, refer to [Setting up dbt State](/docs/deploy/dbt-state-setup).
:::

### dbt login --help

```text
Usage: dbt login [OPTIONS] <COMMAND>

Commands:
  status          Show dbt authentication status
```

### dbt login status

Run `dbt login status` to show whether dbt is authenticated:

```shell
dbt login status
```

If dbt is authenticated, the CLI shows the authentication method:

```text
Status: authenticated (via METHOD)
```

If dbt is not authenticated, the CLI shows:

```text
Status: unauthenticated
```

### dbt license info

<Constant name="fusion" /> uses local licenses to cache your logged-in state and give you access to advanced features. Run `dbt license info` as an additional check to verify the status of the license used by <Constant name="fusion" />. This is useful when an advanced feature isn't working and `dbt login status` tells you you're authenticated:

```shell
dbt license info
```

The output should look like this:
```shell
dbtf license info
...
status: valid
licensing_enabled: true
license_type: developer
features: compare, state-aware-orchestration, strict-static-analysis
issued_at: June 17, 2026 10:55 UTC
expires_at: June 18, 2026 10:55 UTC
```

Add `--json` for machine-readable output:

```shell
dbt license info --json
```

For how to interpret each status, refer to [Troubleshooting](#troubleshooting).

## Troubleshooting

If an advanced feature isn't working, or you're not sure whether you're still signed in, run `dbt license info` to check your access:

```shell
dbt license info
```

Add `--json` for machine-readable output:

```shell
dbt license info --json
```

The output shows your current status. Use the following table to interpret it:

| Status | What it means | What to do |
|---|---|---|
| `valid` | You're signed in and your features are available. | Nothing &mdash; you're all set. |
| `trial_expired` | Your 14-day dbt VS Code extension trial has ended. | [Sign in or register](/docs/sign-in-dbt-extension) for a free <Constant name="dbt_platform" /> account. |
| `expired` | Your access has expired. | Run `dbt login` to sign in again. |
| `not_found` | dbt couldn't find any sign-in for you. | Run `dbt login`, or set a [service token](#authenticate-with-a-service-token) for orchestrated runs. |
| `invalid` | Your access failed validation. | Run `dbt login` to refresh it. |
| `transient_error` | A temporary network or server issue. | Retry &mdash; your cached access stays active in the meantime. |

:::note If you just registered a new account
If you created a new <Constant name="dbt_platform" /> account but haven't verified your email yet, dbt warns you on each run during a short grace period.

After the grace period ends, advanced features stop working until you verify. You can still use the vast majority of features like code error diagnostics and Jinja LSP go-to ref definition, [and more](/docs/fusion/fusion-availability?version=1.11#dbt-vs-code-extension-features).

Check your inbox for the verification email, or [contact dbt Support](/docs/dbt-support) if you need it resent.
:::

## Related commands

- [`dbt login status`](#dbt-login-status) &mdash; Shows your current dbt authentication status.
- [`dbt license info`](#dbt-license-info) &mdash; Shows your current access status and helps diagnose feature availability.
- [`dbt init`](/reference/commands/init) &mdash; Use during first-time project setup; prompts you to run `dbt login` to unlock authenticated features.
- [`dbt deps`](/reference/commands/deps) &mdash; Installs packages for a dbt project.
- [`dbt debug`](/reference/commands/debug) &mdash; Tests your dbt project and connection configuration.
