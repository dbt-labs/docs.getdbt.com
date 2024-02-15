---
title: Configure and use the dbt Cloud CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt Cloud CLI"
sidebar_label: "Configuration and usage"
pagination_next: null
---

import CloudCLIFlag from '/snippets/_cloud-cli-flag.md';

<CloudCLIFlag/>

## Prerequisites

- You must set up a project in dbt Cloud.
  - **Note** &mdash; If you're using the dbt Cloud CLI, you can connect to your [data platform](/docs/cloud/connect-data-platform/about-connections) directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file. 
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The dbt Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data platform.
- You must be on dbt version 1.5 or higher. Refer to [dbt Cloud versions](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to upgrade.

## Configure the dbt Cloud CLI

Once you install the dbt Cloud CLI, you need to configure it to connect to a dbt Cloud project. 

1. Ensure you meet the prerequisites above and go to dbt Cloud to download your credentials by clicking on the **Try the dbt Cloud CLI** banner.

    <details>
    <summary>Region URLs to download credentials</summary>
    You can also download the credentials from the links provided based on your region:

    - North America: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a herf="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - North American Cell 1: <code>https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Single-tenant: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

2. Save the config file to your local computer's filesystem. Make sure to store your `dbt_cloud.yml` config file in a safe place as it contains API keys.

   - Mac or Linux:  `~/.dbt/dbt_cloud.yml`
   - Windows:  `C:\Users\yourusername\.dbt\dbt_cloud.yml`  
  
  The config file looks like this:

    ```yaml
    version: "1"
    context:
        active-project: "<project id from the list below>"
        active-host: "<active host from the list>"
        defer-env-id: "<optional defer environment id>"
    projects:
    - project-id: "<project-id>"
        account-host: "<account-host>"
        api-key: "<user-api-key>"

    - project-id: "<project-id>"
        account-host: "<account-host>"
        api-key: "<user-api-key>"
    ```

3. After downloading the config file, navigate to a dbt project in your terminal:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

4. In your `dbt_project.yml` file, ensure you have or include a `dbt-cloud` section with a `project-id` field. The `project-id` field contains the dbt Cloud project ID you want to use.

    ```yaml
    # dbt_project.yml
    name:
    version:
    # Your project configs...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

   - To find your project ID, select **Develop** in the dbt Cloud navigation menu. You can use the URL to find the project ID. For example, in `https://cloud.getdbt.com/develop/26228/projects/123456`, the project ID is `123456`.

5. You should now be able to [use the dbt Cloud CLI](#use-the-dbt-cloud-cli) and run [dbt commands](/reference/dbt-commands) like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration details or `dbt compile` to compile models in your dbt project.

With your repo recloned, you can add, edit, and sync files with your repo.

## Set environment variables

To set environment variables in the dbt Cloud CLI for your dbt project:

1. Select the gear icon on the upper right of the page.
2. Then select **Profile Settings**, then **Credentials**.
3. Click on your project and scroll to the **Environment Variables** section.
4. Click **Edit** on the lower right and then set the user-level environment variables.  
   - Note, when setting up the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), using [environment variables](/docs/build/environment-variables) like `{{env_var('DBT_WAREHOUSE')}}` is not supported. You should use the actual credentials instead.

## Use the dbt Cloud CLI

The dbt Cloud CLI uses the same set of [dbt commands](/reference/dbt-commands) and [MetricFlow commands](/docs/build/metricflow-commands) as dbt Core to execute the commands you provide. For example, use the [`dbt environment`](/reference/commands/dbt-environment) command to view your dbt Cloud configuration details.
- It allows you to automatically defer build artifacts to your Cloud project's production environment.
- It also supports [project dependencies](/docs/collaborate/govern/project-dependencies), which allows you to depend on another project using the metadata service in dbt Cloud. 
  - Project dependencies instantly connect to and reference (or  `ref`) public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.

:::tip Use the <code>--help</code> flag
As a tip, most command-line tools have a `--help` flag to show available commands and arguments. Use the `--help` flag with dbt in two ways:
- `dbt --help`: Lists the commands available for dbt<br />
- `dbt run --help`: Lists the flags available for the `run` command
:::

### Run dbt commands

When you're managing your dbt project, it's important to understand that dbt commands are categorized into the following types:

- **Data platform write commands** &mdash; Commands such as `dbt build` and `dbt run` that perform write operations to your data platform. These commands are limited to one invocation at any given time. This is to prevent any potential conflicts, such as overwriting the same table in your data platform, at the same time. For example, you can't run `dbt build` and `dbt run` at the same time.

- **Data platform read commands** &mdash; Commands such as `dbt parse` and `dbt source snapshot-freshness` that don't write to your platform. These commands aren't limited to one invocation at any given time and you can run multiple invocations in parallel. For example, you can run `dbt parse` and `dbt source snapshot-freshness` at the same time.

To ensure your dbt workflows are both efficient and safe, you can run different types of dbt commands at the same time (in parallel). For example, `dbt build` (write operation) can safely run alongside `dbt parse` (read operation). This is because it combines commands that interact differently with your data platform and avoids any potential conflicts.
