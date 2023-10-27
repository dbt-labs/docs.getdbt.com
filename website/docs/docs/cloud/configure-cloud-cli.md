---
title: Configure dbt Cloud CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt Cloud CLI"
sidebar_label: "Configure dbt Cloud CLI"
pagination_next: null
---

import CloudCLIFlag from '/snippets/_cloud-cli-flag.md';

<CloudCLIFlag/>


## Prerequisites

- You must set up a project in dbt Cloud.
  - **Note** &mdash; If you're using the dbt Cloud CLI, you can connect to your data platform directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file. 
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The dbt Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data platform.
- You must [enroll](/docs/dbt-versions/experimental-features) in the dbt Cloud beta features.
  - To enroll, navigate to your **Profile Settings** and enable the **Beta** flag under **Experimental Features**.
- You must be on dbt version 1.5 or higher. Refer to [dbt Cloud versions](/docs/dbt-versions/upgrade-core-in-cloud) to upgrade.

## Configure the dbt Cloud CLI

Once you install the dbt Cloud CLI, you need to configure it to connect to a dbt Cloud project. 

1. Ensure you meet the prerequisites above.

2. Download your credentials from dbt Cloud by clicking on the **Try the dbt Cloud CLI** banner on the dbt Cloud homepage. Alternatively, if you're in dbt Cloud, you can download the credentials from the links provided based on your region:
   
    - North America: https://cloud.getdbt.com/cloud-cli
    - EMEA: https://emea.dbt.com/cloud-cli
    - APAC: https://au.dbt.com/cloud-cli
    - North American Cell 1: `https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli`
    - Single-tenant: `https://YOUR_ACCESS_URL/cloud-cli`
  
3. Follow the banner instructions and download the config file to:
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

4. After downloading the config file, navigate to a dbt project in your terminal:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

5. In your `dbt_project.yml` file, ensure you have or include a `dbt-cloud` section with a `project-id` field. The `project-id` field contains the dbt Cloud project ID you want to use.

    ```yaml
    # dbt_project.yml
    name:

    version:
    ...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

   - To find your project ID, select **Develop** in the dbt Cloud navigation menu. You can use the URL to find the project ID. For example, in `https://cloud.getdbt.com/develop/26228/projects/123456`, the project ID is `123456`.

### Set environment variables

To set environment variables in the dbt Cloud CLI for your dbt project:

1. Select the gear icon on the upper right of the page.
2. Then select **Profile Settings**, then **Credentials**.
3. Click on your project and scroll to the **Environment Variables** section.
4. Click **Edit** on the lower right and then set the user-level environment variables.  

## Use the dbt Cloud CLI

- The dbt Cloud CLI shares the same set of [dbt commands](/reference/dbt-commands) as dbt Core and processes the commands you invoke. 
- It allows you to use automatic deferral of build artifacts to your Cloud project's production environment.
- It also supports [project dependencies](/docs/collaborate/govern/project-dependencies), which allows you to depend on another project using the metadata service in dbt Cloud. 
  - Project dependencies instantly connect to and reference (or  `ref`) public models defined in other projects. This means you don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.

:::tip Use the <code>--help</code> flag
As a tip, most command-line tools have a `--help` flag to show available commands and arguments. Use the `--help` flag with dbt in two ways:
- `dbt --help`: Lists the commands available for dbt<br />
- `dbt run --help`: Lists the flags available for the `run` command
:::
