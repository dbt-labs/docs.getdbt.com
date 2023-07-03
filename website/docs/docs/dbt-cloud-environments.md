---
title: "dbt Cloud environments"
id: "dbt-cloud-environments"
description: "Learn about dbt Cloud's development environment to execute your project in the IDE"
---

An environment determines how dbt Cloud will execute your project in both the dbt Cloud IDE (for development) and scheduled jobs (for deployment).

Critically, in order to execute dbt, environments define three variables:

1. The version of dbt Core that will be used to run your project
2. The warehouse connection information (including the target database/schema settings)
3. The version of your code to execute

Each dbt Cloud project can have only one [development environment](#create-a-development-environment), but there is no limit to the number of [deployment environments](/docs/deploy/deploy-environments), providing you the flexibility and customization to tailor the execution of scheduled jobs. 

Use environments to customize settings for different stages of your project and streamline the execution process by using software engineering principles. This page will detail the different types of environments and how to intuitively configure your development environment in dbt Cloud. 


import CloudEnvInfo from '/snippets/_cloud-environments-info.md';

<CloudEnvInfo setup={'/snippets/_cloud-environments-info.md'} />


## Create a development environment

To create a new dbt Cloud development environment, navigate to **Deploy** -> **Environments** and then click **Create Environment**. Select **Development** as the environment type.

After setting the **General Settings** as above, there’s nothing more that needs to be done on the environments page. Click **Save** to create the environment.

### Set developer credentials

To use the IDE, each developer will need to set up [personal development credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#access-the-cloud-ide) to your warehouse connection in their **Profile Settings**. This allows users to set separate target information, as well as maintain individual credentials to connect to your warehouse via the dbt Cloud IDE.


<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment-fields.png" width="85%" height="100" title="Creating a development environment"/>


## Deployment environment

Deployment environments in dbt Cloud are crucial for executing scheduled jobs. A dbt Cloud project can have multiple deployment environments, allowing for flexibility and customization. 

To learn more about dbt Cloud deployments and how to configure deployment environments, visit the [Deployment environments](/docs/deploy/deploy-environments) page. For our best practices guide, read [dbt Cloud environment best practices](https://docs.getdbt.com/guides/best-practices/environment-setup/1-env-guide-overview) for more info. 
