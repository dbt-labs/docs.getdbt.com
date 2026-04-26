---
title: "Developing with Fusion: dbt Platform and local workflows"
id: "fusion-platform-local-workflow"
level: 'Intermediate'
icon: 'zap'
hide_table_of_contents: false
tags: ['dbt Fusion engine', 'dbt platform', 'Local development']
recently_updated: true
---

## Introduction

Many teams use <Constant name="fusion" /> in several places at once: in **<Constant name="dbt_platform" />** for production runs and IDE-based development, and **locally** using the Fusion CLI or the dbt VS Code extension. Keeping these two environments in sync across credentials, environment variables, and engine versions is one of the first operational challenges teams encounter.

This guide walks through each of these three areas and gives you concrete, copy-paste-ready steps for managing them consistently.

## Prerequisites

- You have a <Constant name="dbt_platform" /> account with at least one project using the <Constant name="fusion_engine" />.
- You have [installed Fusion locally](/docs/local/install-dbt?version=2#installation) — either via the CLI or the VS Code extension.

---

## 1. Managing credentials

How you authenticate to your data warehouse locally depends on which local tool you use.

### Fusion CLI (Cloud CLI)

If you're developing locally with only the CLI, Fusion works natively with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). The Cloud CLI authenticates using your dbt Platform session. Your warehouse credentials are managed centrally in dbt Platform and passed through automatically.

```shell
# Install the Cloud CLI (if not already installed)
pip install dbt

# Verify your connection
dbt debug
```

This is the lowest-friction path for teams that don't need full IDE integration locally.

### VS Code extension (profiles.yml required)

The dbt VS Code extension runs Fusion, and its LSP, in a local process and connects directly to your warehouse. For this reason, a `profiles.yml` is required for local extension development sessions.

To avoid manually recreating your warehouse configuration, use `dbt init`. If you have a `dbt_cloud.yml` in your project (created when you clone a dbt Platform project), Fusion will attempt to hydrate non-sensitive credential metadata from dbt Platform automatically:

```shell
dbt init
```

Fusion pulls down things like your **username**, **role**, **warehouse**, **database**, and **schema** — but never sensitive values like passwords or tokens. If your authentication mechanism is passwordless (such as `externalbrowser` or SSO-based OAuth), Fusion will configure that too, so you can be fully operational without storing any secrets locally.

:::note
This hydration happens once during initial setup and is not kept in sync automatically. If your warehouse configuration changes in dbt Platform, re-run `dbt init` to refresh your local `profiles.yml`.
:::

The dbt VS Code extension's first-time setup flow will prompt and guide you through this process — you don't need to run `dbt init` manually in most cases.

:::info Coming soon
We're working on a solution that allows you to develop locally in the VS Code extension while managing credentials entirely in dbt Platform, eliminating the need for a local `profiles.yml`. Stay tuned.
:::

---

## 2. Managing environment variables

Environment variables set in dbt Platform are available to your production runs and Cloud IDE sessions. For local development, you need to manage these separately.

### Fusion CLI (Cloud CLI)

When using the Cloud CLI, environment variables configured in dbt Platform are automatically available during your local development session — the same variables used in production are injected into your CLI session. No extra setup is needed.

### VS Code extension (.env file)

The VS Code extension runs Fusion as a local process, so platform-managed environment variables are not automatically available. Instead, use a [`.env` file](https://dotenvx.com/docs) at the root of your dbt project:

```shell
# .env
DBT_MY_DATABASE=my_database
DBT_MY_SCHEMA=my_dev_schema
DBT_TARGET_SCHEMA=analytics_dev
```

Fusion and the VS Code extension automatically load values from this file. You can also view and override individual environment variables from the VS Code extension's settings UI.

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

For a full walkthrough of `.env` file usage and variable precedence, see [Environment variables](/docs/local/install-dbt?version=2#environment-variables).

:::tip Add .env to .gitignore
Add `.env` to your `.gitignore` to prevent credentials from being committed. Running `dbt init` will do this automatically.

```shell
echo ".env" >> .gitignore
```
:::

### Keeping platform and local variables in sync

There is currently no automatic sync between environment variables set in dbt Platform and a local `.env` file. We recommend the following pattern:

**Commit a `.env.example` file with placeholder values.** Keep the list of required variables visible to the whole team by committing a `.env.example` to your repo. Each developer copies it locally and fills in their own values — their copy is never committed.

```shell
# .env.example (committed to version control)
DBT_MY_DATABASE=            # Your development database name
DBT_MY_SCHEMA=              # Your personal dev schema, e.g. dbt_yourname
DBT_TARGET_SCHEMA=          # Target schema for dbt output
```

```shell
# Developer setup: copy the example and fill in your values
cp .env.example .env
```

:::warning Do not commit .env
Fusion and the VS Code extension only load from a file named exactly `.env` — so each developer needs their own copy. Make sure `.env` is in your `.gitignore` so credentials are never committed:

```shell
echo ".env" >> .gitignore
```
:::

When environment variables change in dbt Platform (new vars added, values renamed), update `.env.example` in the same PR so local developers know to update their own `.env`.

**For teams with stricter security requirements:** consider a script that fetches variables from your secrets manager (e.g. AWS Secrets Manager, 1Password) and writes them to `.env` at the start of a session, rather than storing values in a file at all.

---

## 3. Managing Fusion versions

The dbt Platform's **Latest** release track is continuously updated as new Fusion releases ship. If your local Fusion version falls behind, you may encounter behavior differences — a query that compiles one way locally and another way in production, or a feature available in Platform that isn't available in your local binary. Staying current eliminates this class of problem entirely.

### Versions in dbt Platform

<Constant name="dbt_platform" /> versions Fusion using a versionless release track model. The default release track is **Latest**, which always runs the most recent stable release. For details on release tracks and their stability levels, see [Fusion releases](/docs/fusion/fusion-releases).

### Versions installed locally

By default, the Fusion [installation script](/docs/local/install-dbt?version=2#installation) installs the **latest stable release** — the same version that ships with the **Latest** release track in dbt Platform:

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

The most reliable way to keep local Fusion versions consistent with dbt Platform is to use a [VS Code dev container](https://code.visualstudio.com/docs/devcontainers/containers). A dev container runs your development environment inside a Docker image that is rebuilt at the start of each session — always doing a fresh install of Fusion. This means every developer on your team automatically picks up the same version that's running in dbt Platform, without any manual update steps.

Our friends at Brooklyn Data have published a ready-to-use Fusion dev container:

- **Dev container template:** [brooklyn-data/dbt-fusion-devcontainer](https://github.com/brooklyn-data/dbt-fusion-devcontainer)
- **Blog post:** [Why you should use dev containers with dbt Fusion](https://www.brooklyndata.co/ideas/2025/06/11/why-you-should-use-dev-containers-with-dbt-fusion)

To get started with their template:

```shell
# Clone the devcontainer template into your project
curl -fsSL https://raw.githubusercontent.com/brooklyn-data/dbt-fusion-devcontainer/main/setup.sh | sh
```

Then open your project in VS Code and select **Reopen in Container** when prompted. VS Code will build the image and install the latest stable Fusion release automatically.

:::info Coming soon
We're introducing additional Fusion release tracks in dbt Platform beyond **Fusion Latest**. Once available, we'll update this guide with guidance on how to pin your dev container to a specific track.
:::

### Without dev containers: update at the start of each session

If dev containers aren't an option for your team, the equivalent behavior is to run `dbt system update` at the start of each development session. This installs the latest stable release — the same version running in dbt Platform's Latest track — so your local binary stays current:

```shell
dbt system update && dbt debug
```

Note that pinning to a specific version number is not a viable long-term strategy here: dbt Platform's Latest track will keep advancing, and a pinned local version will fall behind. The goal is to stay on latest, not to lock to a specific release.

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

If your project uses [dbt Mesh](/docs/mesh/about-mesh) — referencing models from other dbt projects via cross-project refs — Fusion handles this automatically during local development when a `dbt_cloud.yml` is present.

### How it works

When Fusion detects upstream projects defined in your `dependencies.yml`, it automatically downloads the **publication artifact** for each upstream project from dbt Platform before resolving cross-project refs. This means `ref('upstream_project', 'model_name')` works locally without any manual setup.

You'll see these lines in your logs when this is happening:

```
Downloading  publication artifact for <upstream_project> (resolving cross-project refs)
Downloaded   publication artifact for <upstream_project> to <path> (resolving cross-project refs)
```

Fusion caches downloaded publication artifacts for up to one hour, so subsequent runs in the same session skip the download and resolve refs from the local cache.

Auto-deferral is also enabled by default. When a `dbt_cloud.yml` is present, Fusion will defer to your project's configured deferral environment, meaning only modified models and their downstream dependencies are built — the rest resolve against the production state.

### Disabling deferral

**In the VS Code extension**, you can disable auto-deferral from the extension settings. Search for `Dbt > Flag: Defer` and uncheck the option:

![VS Code extension setting showing the Defer flag checkbox unchecked](/img/fusion/vsce-defer-settings.png)

**On the CLI**, pass `--no-defer` to any command to skip both deferral and the publication artifact download:

```shell
dbt run --no-defer
dbt compile --no-defer
```

---

## Summary

| Area | Fusion CLI (Cloud CLI) | VS Code extension |
|---|---|---|
| **Credentials** | Managed via dbt Platform session — no `profiles.yml` needed | `profiles.yml` required; use `dbt init` to hydrate from Platform |
| **Environment variables** | Platform env vars available automatically | Use a `.env` file at project root |
| **Version management** | `dbt system update` to stay current | Dev container recommended for automatic sync |
| **dbt Mesh / deferral** | Auto-enabled when `dbt_cloud.yml` present; `--no-defer` to disable | Auto-enabled when `dbt_cloud.yml` present; toggle off in extension settings |

## Related docs

- [Install Fusion](/docs/local/install-dbt?version=2#installation)
- [dbt Cloud CLI installation](/docs/cloud/cloud-cli-installation)
- [Fusion releases and release channels](/docs/fusion/fusion-releases)
- [About profiles.yml](/docs/local/profiles.yml)
- [Environment variables (local)](/docs/local/install-dbt?version=2#environment-variables)
- [VS Code dev containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [dbt Mesh overview](/docs/mesh/about-mesh)
- [Deferral in dbt](/docs/cloud/about-cloud-develop-defer)
