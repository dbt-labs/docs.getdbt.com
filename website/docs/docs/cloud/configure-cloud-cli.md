---
title: Configure dbt Cloud CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt Cloud CLI"
---

:::info Public preview functionality

The dbt Cloud CLI is currently in [public preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Share feedback or request features you'd like to see on the [dbt community Slack](https://getdbt.slack.com/archives/C05M77P54FL).

::: 


## Prerequisites

- You must set up a project in dbt Cloud.
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The dbt Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data platform.
- You must [enroll](/docs/dbt-versions/experimental-features) in the dbt Cloud beta features. 
	- To enroll, navigate to your **Profile Settings** and enable the **Beta** flag under **Experimental Features**.


## Configure the dbt Cloud CLI

Once you install the dbt Cloud CLI, you need to configure it to connect to a dbt Cloud project.

1. Ensure you meet the prerequisites above.
2. Create an environment variable with your [dbt Cloud API key](/docs/dbt-cloud-apis/user-tokens):
   - On MacOS, Linux, or Windows add an environment variable:

        ```bash
        export DBT_CLOUD_API_KEY="1234" # Replace 1234 with your API key   
        ```

   - In Powershell, add an environment variable: IS THIS MISSING SOMETHING?
     - Note that this variable resets if you restart your shell. To add an environment variable permanently, add a system environment variable in your platform.

3. Navigate to a dbt project in your terminal:

```bash
cd ~/dbt-projects/jaffle_shop
```

4. In your `dbt_project.yml` file, ensure there is a section titled `dbt-cloud`. This section is required to have a `project-id` field with a valid project ID. 

```yaml
# dbt_project.yml
name:

version:
...

dbt-cloud: 
    project-id: PROJECT_ID
```

- To find your project ID, go to **Develop** in the navigation menu. Select the dbt Cloud project URL, such as `https://cloud.getdbt.com/develop/26228/projects123456`, where the project ID is `123456`.


## Use the dbt Cloud CLI

The dbt Cloud CLI shares the same set of commands as dbt Core. When you invoke a dbt command, that command is sent to dbt Cloud for processing. 

The dbt Cloud CLI supports [project dependencies](/docs/collaborate/govern/project-dependencies), which is an exciting way to depend on another project using the metadata service in dbt Cloud. It instantly resolves references (or  `ref`) to public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.

Share feedback or request features you'd like to see on the [dbt community Slack](https://getdbt.slack.com/archives/C05M77P54FL).
