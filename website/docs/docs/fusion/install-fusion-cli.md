---
title: "Install Fusion CLI"
sidebar_label: "Install Fusion CLI only" 
description: "Install the Fusion engine locally from the command line interface (CLI) to take data transformation to the next level."
keywords: ["dbt Fusion engine", "Fusion", "Install Fusion", "Update Fusion", "Fusion updates" ]
id: install-fusion-cli
---

import FusionManualInstall from '/snippets/_fusion-manual-install.md';

# Install Fusion from the CLI <Lifecycle status="preview" />

Fusion can be installed via the command line from our official content delivery network (CDN).

<FusionManualInstall />

## Update Fusion

The following command will update to the latest version of Fusion and adapter code:

```shell
dbtf system update
```

## Uninstall Fusion

This command will uninstall the Fusion binary from your system, but aliases will remain wherever they are installed (for example `~/.zshrc`):

```shell
dbtf system uninstall
```

## Adapter installation

The Fusion install automatically includes adapters outlined in the [Fusion requirements](/docs/fusion/supported-features#requirements). Other adapters will be available at a later date.

## Environment variables

<Constant name="fusion"/> automatically loads environment variables from a `.env` file in your current working directory. This provides a convenient way to manage credentials and configuration without hardcoding them in your `profiles.yml` or exposing them in your shell history.

### Using .env files

1. Create a `.env` file in your current working directory (typically at the root of your dbt project):
   ```env
   DBT_MY_DATABASE=my_database
   DBT_MY_SCHEMA=my_schema
   DBT_SECRET_KEY=my_secret_value
   ```

2. Reference these variables in your `profiles.yml` using the [`env_var` Jinja function](/reference/dbt-jinja-functions/env_var):
   ```yaml
   my_profile:
     target: dev
     outputs:
       dev:
         type: snowflake
         account: my_account
         database: "{{ env_var('DBT_MY_DATABASE') }}"
         schema: "{{ env_var('DBT_MY_SCHEMA') }}"
   ```

3. Try running your dbt commands normally, <Constant name="fusion"/> will automatically load the variables from the `.env` file.

### Precedence order

When the same environment variable is defined in multiple places, <Constant name="fusion"/> uses the following precedence order (highest to lowest):

1. **Shell environment** &mdash; Variables set directly in your shell (for example, `export DBT_MY_VAR=value`)
2. **`.env` file** &mdash; Variables defined in the `.env` file in your current working directory

This means shell environment variables always override values from the `.env` file.

:::tip
Add `.env` to your `.gitignore` file to prevent sensitive credentials from being committed to version control. The `dbt init` command automatically includes `.env` in the generated `.gitignore` file.
:::

For more details on managing environment variables across different development environments, refer to [Configure your local environment](/docs/configure-dbt-extension#set-environment-variables-locally).


## Troubleshooting

Common issues and resolutions:

- **dbt command not found:** Ensure installation location is correctly added to your `$PATH`.
- **Version conflicts:** Verify no existing <Constant name="core" /> or dbt CLI versions are installed (or active) that could conflict with Fusion.
- **Installation permissions:** Confirm your user has appropriate permissions to install software locally.

## Frequently asked questions

- Can I revert to my previous dbt installation?

    Yes. If you want to test Fusion without affecting your existing workflows, consider isolating or managing your installation via separate environments or virtual machines.

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
