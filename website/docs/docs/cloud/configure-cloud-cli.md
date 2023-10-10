---
title: Configure dbt Cloud CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt Cloud CLI"
sidebar_label: "Configure dbt Cloud CLI"
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

2. Download your credentials from dbt Cloud. Find the "Try the Cloud CLI" banner on the dbt homepage and click on it. Follow the instructions, downloading the config file to `~/.dbt/dbt_cloud.yml`.

3. Navigate to a dbt project in your terminal:

```bash
cd ~/dbt-projects/jaffle_shop
```

4. In your `dbt_project.yml` file, ensure there is a section titled `dbt-cloud`. This section is required to have a `project-id` field with the dbt-cloud project ID that you'd like to use. 

```yaml
# dbt_project.yml
name:

version:
...

dbt-cloud: 
    project-id: PROJECT_ID
```

- To find your project ID, select **Develop** in the dbt Cloud navigation menu. You can use this URL to find the project ID. For example, in `https://cloud.getdbt.com/develop/26228/projects123456`, the project ID is `123456`.


## Use the dbt Cloud CLI

The dbt Cloud CLI shares the same set of commands as dbt Core. When you invoke a dbt command, that command is sent to dbt Cloud for processing. 

The dbt Cloud CLI supports [project dependencies](/docs/collaborate/govern/project-dependencies), which is an exciting way to depend on another project using the metadata service in dbt Cloud. It instantly resolves references (or  `ref`) to public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.

Share feedback or request features you'd like to see on the [dbt community Slack](https://getdbt.slack.com/archives/C05M77P54FL).
