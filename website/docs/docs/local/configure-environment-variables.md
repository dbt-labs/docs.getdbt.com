---
title: Configure environment variables
id: configure-environment-variables
description: "Configure environment variables"
sidebar_label: "Environment variables"
pagination_next: "docs/local/profiles.yml"
pagination_prev: "docs/local/install-dbt"
---

<Constant name="fusion"/> automatically loads environment variables from a `.env` file in your current working directory (the folder you `cd` into and run dbt commands from in your terminal). This helps you manage credentials and settings without hardcoding them in your `profiles.yml` or exposing them in your shell history.

## Using a `.env` file

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

3. Run dbt commands normally. <Constant name="fusion"/> will automatically load the variables from the `.env` file. For example, running `dbtf debug` will show your connection using the values from `.env`:
   ```shell
   dbtf debug
   ...
   Debugging connection:
   "authenticator": "my_authenticator",
   "account": "my_account",
   "user": "my_user",
   "database": "my_database",        # Loaded from DBT_MY_DATABASE in .env
   "schema": "my_schema",            # Loaded from DBT_MY_SCHEMA in .env
   ```

:::note
We recommend placing your `.env` file in the project root and running dbt commands from that location because the file is loaded _only_ from your current working directory. It doesn't support the `--project-dir` flag or <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> environment variable, and dbt won't search your project root if you're running commands from a different directory location.
:::

### Precedence order

When the same environment variable is defined in multiple places, <Constant name="fusion"/> uses the following precedence order (highest to lowest):

1. Shell environment &mdash; Variables set directly in your shell (for example, `export DBT_MY_VAR=value`)
2. `.env` file &mdash; Variables defined in the `.env` file in your current working directory

This means environment variables set in your shell always override values from the `.env` file.

:::tip
Add `.env` to your `.gitignore` file to prevent sensitive credentials from being committed to version control. The `dbtf init` command automatically includes `.env` in the generated `.gitignore` file.
:::

For more details on managing environment variables locally, refer to [Configure your local environment](/docs/configure-dbt-extension#set-environment-variables-locally).
