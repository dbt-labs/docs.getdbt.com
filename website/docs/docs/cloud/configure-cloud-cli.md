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
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The dbt Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data platform.
- You must [enroll](/docs/dbt-versions/experimental-features) in the dbt Cloud beta features. 
	- To enroll, navigate to your **Profile Settings** and enable the **Beta** flag under **Experimental Features**.


## Configure the dbt Cloud CLI

Once you install the dbt Cloud CLI, you need to configure it to connect to a dbt Cloud project.

1. Ensure you meet the prerequisites above.
2. Download your credentials from dbt Cloud by clicking on the **Try the dbt Cloud CLI** banner on the dbt Cloud homepage.
3. Follow the banner instructions and download the config file to `~/.dbt/dbt_cloud.yml`. The config file looks like:

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

## Use the dbt Cloud CLI

- The dbt Cloud CLI shares the same set of commands as dbt Core and processes the dbt commands you invoke. 
- It allows you to use automatic deferral of build artifacts to your Cloud project's production environment.
- It also supports [project dependencies](/docs/collaborate/govern/project-dependencies), which allows you to depend on another project using the metadata service in dbt Cloud. 
  - Project dependencies instantly connects to and references (or  `ref`) public models defined in other projects. This means you don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.


:::infoShare feedback
Share feedback or request features you'd like to see in the [dbt community Slack](https://getdbt.slack.com/archives/C05M77P54FL).
:::

