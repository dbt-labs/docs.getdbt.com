---
title: "Hybrid development with dbt platform and Fusion"
id: "fusion-platform-local-workflow"
level: 'Beginner'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt platform', 'Local development']
recently_updated: true
---

## Introduction

Hybrid dbt deployments are becoming increasingly common. <Constant name="fusion" /> adopters are frequently working in several places at once: in the <Constant name="dbt_platform" /> for production runs and IDE-based development, and locally using the <Constant name="dbt_platform"/> CLI or the dbt VS Code extension.

These paths are fully supported for <Constant name="dbt_platform" /> users. Keeping the environments in sync across credentials, environment variables, and engine versions is one of the first operational challenges teams encounter.

This guide walks through credentials, environment variables, <Constant name="fusion" /> versions, and Mesh or deferral, with concrete, copy-paste-ready steps to keep everything aligned.

## Prerequisites

- You have a <Constant name="dbt_platform" /> account with at least one project using the <Constant name="fusion_engine" />.
- You have either the [dbt platform CLI](/docs/platform/dbt-cli-installation) or the [dbt VS Code extension + local <Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2.0#installation) installed.


## 1. Managing credentials

How you authenticate to your data warehouse locally depends on which local tool you use:
- [dbt platform CLI](/guides/fusion-platform-local-workflow?step=3#dbt-platform-cli): For a CLI-only local development experience (without the dbt VS Code extension), use the dbt platform CLI with <Constant name="fusion"/> set as your platform release track. Warehouse credentials are managed centrally in <Constant name="dbt_platform" /> and passed through automatically &mdash; no `profiles.yml` required.
- [dbt VS Code extension](/guides/fusion-platform-local-workflow?step=3#dbt-vs-code-extension-profilesyml-required): For IDE-based local development, the dbt VS Code extension runs the <Constant name="fusion_engine" /> and its <Term id="lsp" /> features in a local process. This path requires a `profiles.yml` to connect directly to your warehouse.

### dbt platform CLI

The [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) is the lowest-friction path for <Constant name="dbt_platform" /> users who want a CLI-only local workflow without VS Code. It authenticates using your <Constant name="dbt_platform" /> session, and your warehouse credentials are managed centrally in <Constant name="dbt_platform" /> and passed through automatically.

For detailed installation instructions, refer to [Install the dbt CLI](/docs/platform/dbt-cli-installation?version=1.10).

The dbt platform CLI is installed from your local command prompt. For example:

```shell
# Install the dbt platform CLI (if not already installed)
pip3 install dbt

# Verify your connection
dbt debug
```

The configuration file downloaded from your <Constant name="dbt_platform" /> **Account settings** will facilitate the connection and authentication with your existing credentials. 

This is the lowest-friction path for teams that don't need full IDE integration locally.

### dbt VS Code extension (profiles.yml required)

The dbt VS Code extension runs <Constant name="fusion" /> and its language server in a local process and connects directly to your warehouse. For this reason, you need a `profiles.yml` for local extension development sessions.

Download your `dbt_cloud.yml` from your <Constant name="dbt_platform" /> **Account settings** (refer to [Register with dbt_cloud.yml](/docs/install-dbt-extension#register-with-dbt_cloudyml) for detailed instructions) and <Constant name="fusion" /> attempts to hydrate non-sensitive credential metadata from <Constant name="dbt_platform" /> automatically. To avoid manually recreating your warehouse configuration, use `dbt init`.

```shell
dbt init
```

<Constant name="fusion" /> pulls down fields such as your **username**, **role**, **warehouse**, **database**, and **schema**, but never sensitive values like passwords or tokens. If your authentication mechanism is passwordless (such as `externalbrowser` or SSO-based OAuth), <Constant name="fusion" /> configures that too, so you can work without storing secrets locally.

:::note
This hydration happens once during initial setup and does not stay in sync automatically. When your warehouse configuration changes in <Constant name="dbt_platform" />, run `dbt init` again to refresh your local `profiles.yml`.
:::

The dbt VS Code extension first-time setup flow prompts you through this process, so you usually don't need to run `dbt init` manually.

:::info Coming soon
We're working on a solution that lets you develop locally in the dbt VS Code extension while you manage credentials entirely in <Constant name="dbt_platform" />, without a local `profiles.yml`. We'll update this page when that ships.
:::

## 2. Managing environment variables

Environment variables you set in <Constant name="dbt_platform" /> apply to production runs and the <Constant name="studio_ide" /> sessions. For local development, you manage environment variables separately.

### dbt platform CLI

When you use the dbt platform CLI, <Constant name="dbt_platform" /> injects the same environment variables you use in production into your dbt CLI session. You don't need extra setup.

### VS Code extension (.env file)

The dbt VS Code extension runs <Constant name="fusion" /> as a local process, so environment variables from <Constant name="dbt_platform" /> are not automatically available. Instead, use a [`.env` file](https://dotenvx.com/docs) at the root of your dbt project:

```shell
# .env
DBT_MY_DATABASE=my_database
DBT_MY_SCHEMA=my_dev_schema
DBT_TARGET_SCHEMA=analytics_dev
```

<Constant name="fusion" /> and the dbt VS Code extension automatically load values from this file. You can also view and override individual environment variables from the extension's settings UI.

Reference these variables in your `profiles.yml` or elsewhere in your dbt project using the [`env_var` Jinja function](/reference/dbt-jinja-functions/env_var):

```yaml
# profiles.yml
my_profile:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: my_account
      database: "{{ env_var('DBT_MY_DATABASE') }}"
      schema: "{{ env_var('DBT_MY_SCHEMA') }}"
```

For a full walkthrough of `.env` file usage and variable precedence, see [Environment variables](/docs/build/environment-variables) for more information on where to find your configured variables and [Set environment variables locally](/docs/configure-dbt-extension?version=2.0#set-environment-variables-locally) for local configuration instructions.

### Keeping platform and local variables in sync

Environment variables in <Constant name="dbt_platform" /> and a local `.env` file don't sync automatically. 

Commit a `.env.example` file with the list of required variables to your repo. Each developer copies it locally and fills in their own values and their copy is never committed.

```shell
# .env.example (committed to version control)
DBT_MY_DATABASE=            # Your development database name
DBT_MY_SCHEMA=              # Your personal dev schema, for example dbt_yourname
DBT_TARGET_SCHEMA=          # Target schema for dbt output
```

```shell
# Developer setup: copy the example and fill in your values
cp .env.example .env
```

:::warning Do not commit .env
<Constant name="fusion" /> and the dbt VS Code extension only load from a file named exactly `.env`, so each developer needs their own copy. Make sure `.env` is in your `.gitignore` so credentials are never committed. Running `dbt init` adds this automatically.

```shell
echo ".env" >> .gitignore
```
:::

When environment variables change in <Constant name="dbt_platform" /> (you add variables or rename values), update `.env.example` in the same pull request so local developers know to update their own `.env`.

:::tip For teams with strict security requirements 

Consider a script that fetches variables from your secrets manager (for example, AWS Secrets Manager or 1Password) and writes them to `.env` at the start of a session, instead of storing values in a file long term.

:::

## 3. Managing Fusion versions

The **Latest** release track on <Constant name="dbt_platform" /> updates continuously as <Constant name="fusion" /> ships new releases. If your local version falls behind, you might see inconsistent behavior. The same query could compile differently locally than in production, or a feature might exist in <Constant name="dbt_platform" /> but not in your local binary. Stay current to avoid these mismatches.

### Versions on the dbt platform

On <Constant name="dbt_platform" />, <Constant name="fusion" /> follows a versionless release track model. The default release track is **Latest**, which always runs the most recent stable release. For details on release tracks and their stability levels, see [<Constant name="fusion" /> releases](/docs/fusion/fusion-releases).

### Versions installed locally

By default, the <Constant name="fusion" /> [installation script](/docs/local/install-dbt?version=2#installation) installs the latest stable release, the same version that ships with the **Latest** release track on <Constant name="dbt_platform" />:

```shell
# macOS / Linux
curl -fsSL https://downloads.getdbt.com/install/dbt-fusion.sh | sh
```

To update your local installation to the latest stable release at any time:

```shell
dbt system update
```

To check your current version:

```shell
dbt --version
```

### Keeping versions in sync: dev containers (recommended)

Use a [VS Code dev container](https://code.visualstudio.com/docs/devcontainers/containers) for the most reliable match between local <Constant name="fusion" /> versions and <Constant name="dbt_platform" />. A dev container runs your environment inside a Docker image that rebuilds at the start of each session and performs a fresh <Constant name="fusion" /> install each time, so everyone on your team uses the same version as <Constant name="dbt_platform" /> without manual updates.

Our friends at Brooklyn Data have published a ready-to-use <Constant name="fusion" /> dev container:

- **Dev container template:** [brooklyn-data/dbt-fusion-devcontainer](https://github.com/brooklyn-data/dbt-fusion-devcontainer)
- **Blog post:** [Why you should use dev containers with dbt <Constant name="fusion" />](https://www.brooklyndata.co/ideas/2025/06/11/why-you-should-use-dev-containers-with-dbt-fusion)

To get started with their template:

```shell
# Clone the devcontainer template into your project
curl -fsSL https://raw.githubusercontent.com/brooklyn-data/dbt-fusion-devcontainer/main/setup.sh | sh
```

Then open your project in VS Code and select **Reopen in Container** when prompted. VS Code builds the image and installs the latest stable <Constant name="fusion" /> release automatically.

:::info Coming soon
We're introducing additional <Constant name="fusion" /> release tracks on <Constant name="dbt_platform" /> beyond **<Constant name="fusion" /> Latest**. When they're available, we'll update this guide with steps to pin your dev container to a specific track.
:::

### Without dev containers: update at the start of each session

If dev containers aren't an option for your team, run `dbt system update` at the start of each development session instead. That installs the latest stable release, the same version as the **Latest** track on <Constant name="dbt_platform" />, so your local binary stays current:

```shell
dbt system update && dbt debug
```

Pinning to a specific version number does not work long term here: the **Latest** track on <Constant name="dbt_platform" /> keeps advancing, and a pinned local install falls behind. Aim to stay on **Latest** instead of locking to one release.

To make this easy to remember, add a `dev` target to your project's `Makefile`:

```makefile
# Makefile
.PHONY: dev
dev:
	dbt system update
	dbt debug
```

Then developers start their session with:

```shell
make dev
```

You can also document this convention in your project's `CONTRIBUTING.md` so it's part of your onboarding checklist.

---

## 4. dbt Mesh and deferral

If your project uses [dbt Mesh](/docs/mesh/about-mesh), referencing models from other dbt projects via cross-project refs, <Constant name="fusion" /> handles this automatically during local development when a `dbt_cloud.yml` is present.

### How it works

When <Constant name="fusion" /> detects upstream projects defined in your `dependencies.yml`, it downloads the publication artifact for each upstream project from <Constant name="dbt_platform" /> before resolving cross-project refs. Then `ref('upstream_project', 'model_name')` works locally without manual setup.

Your logs include lines such as the following while <Constant name="fusion" /> resolves cross-project refs:

```
Downloading publication artifact for <upstream_project> (resolving cross-project refs)
Downloaded publication artifact for <upstream_project> to <path> (resolving cross-project refs)
```

<Constant name="fusion" /> caches downloaded publication artifacts for up to one hour, so subsequent runs in the same session skip the download and resolve refs from the local cache.

Auto-deferral is also on by default. When a `dbt_cloud.yml` is present, <Constant name="fusion" /> defers to your project's configured deferral environment, so you build only modified models and their downstream dependencies while the rest resolve against the production state.

### Disabling deferral

- **In the VS Code extension:** Disable auto-deferral in the extension settings. Search for `Dbt > Flag: Defer` and uncheck the option:

    <Lightbox src="/img/fusion/vsce-defer-settings.png"  title="dbt VS Code extension deferral settings" />

- **On the CLI:** Pass `--no-defer` to any command to skip both deferral and the publication artifact download:

    ```shell
    dbt run --no-defer
    dbt compile --no-defer
    ```

## Reference table

The following table summarizes the key differences between the two local development paths covered in this guide:

<SimpleTable>

| Area | dbt platform CLI | dbt VS Code extension |
|---|---|---|
| **Credentials** | Managed through your <Constant name="dbt_platform" /> session, no `profiles.yml` needed | `profiles.yml` required; use `dbt init` to hydrate from <Constant name="dbt_platform" /> |
| **Environment variables** | Same env vars as in <Constant name="dbt_platform" /> automatically | Use a `.env` file at the project root |
| **Version management** | `dbt system update` to stay current | Dev container recommended for automatic sync |
| **dbt Mesh / deferral** | Auto-enabled when `dbt_cloud.yml` present; `--no-defer` to disable | Auto-enabled when `dbt_cloud.yml` present; toggle off in extension settings |
</SimpleTable>

## Related docs

- [Install <Constant name="fusion" />](/docs/local/install-dbt?version=2#installation)
- [dbt platform CLI installation](/docs/platform/dbt-cli-installation)
- [<Constant name="fusion" /> releases and release channels](/docs/fusion/fusion-releases)
- [About profiles.yml](/docs/local/profiles.yml)
- [Environment variables (local)](/docs/local/install-dbt?version=2#environment-variables)
- [VS Code dev containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [dbt Mesh overview](/docs/mesh/about-mesh)
- [Deferral in dbt](/docs/platform/about-defer)
