---
title: "About dbt login"
sidebar_label: "login"
id: "login"
description: "Use dbt login in dbt Core v2.0 and later to authenticate and unlock gated features across dbt tools."
intro_text: "Use dbt login to authenticate once and unlock gated features across dbt tools."
---

<VersionBlock lastVersion="1.12">

:::info
Available in <Constant name="dbt" /> v1.12 and v2.0 and later.
:::

</VersionBlock>

`dbt login` signs you in to dbt from the command line to access advanced features requiring login. It opens browser-based authentication, prompting you to either sign in to an existing dbt platform account or create a free account. 

Run [`dbt login status`](#dbt-login-status) to view your current authentication status.

## When to use dbt login

`dbt login` is intended for [dbt State](#dbt-login-with-dbt-state) or local development ([interactive](#interactive-authentication)) on macOS, Linux, and Windows, where you can complete authentication in a browser. 

It does not support non-interactive authentication. For [non-interactive](#non-interactive-environments) environments, such as CI/CD jobs, scheduled jobs, or external orchestrators, use a service token instead to access advanced features.

### What dbt login unlocks

Use `dbt login` to unlock advanced features including:

- advanced features in the [dbt VS Code extension](/docs/about-dbt-extension)
- [dbt State](#dbt-login-with-dbt-state)
- advanced features in v2.0 CLI

Refer to [VS Code extension features](/docs/fusion/fusion-availability?version=1.13#dbt-vs-code-extension-features) for the full list of features and their availability.

## Before you log in

Most advanced features are available free for 14 days from your first use of the dbt VS Code extension. After the 14-day period ends, most features continue to work without signing in. [Advanced features](/docs/fusion/fusion-availability?version=1.13#dbt-vs-code-extension-features) prompt you to run `dbt login` to register. 

Signing in with `dbt login`, or [signing in or registering](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account, unlocks the full feature set across dbt tools that use the shared login state.

Refer to [VS Code extension features](/docs/fusion/fusion-availability?version=1.13#dbt-vs-code-extension-features) for the full list of features and their availability.

<VersionBlock firstVersion="1.12">

## `dbt login` with dbt State

When [dbt State](/docs/deploy/dbt-state-about) is enabled, `dbt login` is used specifically for dbt State authentication, not for general <Constant name="dbt_platform" /> access. Running this command opens a browser window with two options:

- **Log in with your <Constant name="dbt_platform" /> account**: Enter your email address. If you don't have a <Constant name="dbt_platform" /> account, dbt Labs will create a standalone [Developer account](https://www.getdbt.com/pricing) for you. After that, you'll authorize access between the CLI and <Constant name="dbt_platform" />.

  In the <Constant name="fusion_engine" />, once authenticated, the CLI checks your configuration and responds accordingly:

  | dbt State enabled in <Constant name="dbt_platform" />? | dbt State enabled locally? | Behavior |
  |---|---|---|
  | ✅ | ✅ | dbt State is ready to use. |
  | ✅ | ❌ | CLI prompts you to enable dbt State locally. If you confirm, [`user_settings.yml`](/reference/global-configs/user-settings) is updated automatically. |
  | ❌ | ✅ | CLI prompts you to enable dbt State in your platform account. |

  In <Constant name="core" /> v1.12, `dbt login` automatically sets `manage_state: true` in [`user_settings.yml`](/reference/global-configs/user-settings) after platform authentication, unless you've explicitly disabled it. Whether dbt State is enabled in your <Constant name="dbt_platform" /> account is checked when you run a dbt command &mdash; if it's not enabled, dbt will fail on your next `dbt run` or `dbt build`. To resolve this, refer to [User settings](/reference/global-configs/user-settings#when-dbt-state-is-enabled-locally-but-not-in-dbt-platform).

- **Log in without a <Constant name="dbt_platform" /> account**: Redirects you to the dbt State standalone app at [app.state.dbt.com](https://app.state.dbt.com), where a token is created and stored locally at `~/.dbt/auth_state.json`. dbt State is automatically enabled locally after account creation. Select this option if any of the following apply:
  - You don't have a <Constant name="dbt_platform" /> account.
  - You don't have admin permissions to enable dbt State in your <Constant name="dbt_platform" /> account.
  - You want to try dbt State independently first.

</VersionBlock>

## Authentication methods

`dbt login` is interactive only. It opens a browser-based sign-in flow and stores your session locally.

You can log into dbt either using [interactive](#interactive-authentication) or [non-interactive](#non-interactive-environments) methods.

### Interactive authentication

Use `dbt login` when you're developing locally in a terminal or IDE and can complete sign-in in a browser.

- When you run `dbt login`, dbt opens a browser-based authentication flow. After you complete authentication, dbt stores your login state locally and confirms that you're signed in.
- After you sign in, dbt can use your login state to unlock advanced features across the dbt CLI, VS Code extension, and dbt State.
- Your session stays active across terminal sessions. The local license expires after 7 days, but dbt can automatically refresh it while you're active. If dbt can't refresh your session, or if your session expires after inactivity, dbt prompts you to run `dbt login` again.

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

## Usage

This page lists the commands and output you can use with `dbt login`.

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

Your login session remains active across terminal sessions. While you're actively using dbt, your session renews automatically. If your session expires, dbt prompts you to run `dbt login` again.

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

### dbt --help

`dbt login` appears in the `dbt --help` available commands list:

```text
Available Commands:
  login          Log in to dbt
```

## Related commands

- [`dbt login status`](#dbt-login-status) &mdash; Shows your current dbt authentication status.
- [`dbt init`](/reference/commands/init) &mdash; Use during first-time project setup; prompts you to run `dbt login` to unlock authenticated features.
- [`dbt deps`](/reference/commands/deps) &mdash; Installs packages for a dbt project.
- [`dbt debug`](/reference/commands/debug) &mdash; Tests your dbt project and connection configuration.
