---
title: "dbt Cloud environment"
id: "dbt-cloud-environments"
description: "Learn about dbt Cloud's development environment to execute your project in the IDE"
---

An environment determines how dbt Cloud will execute your project in both the dbt Cloud IDE and scheduled jobs. Critically, in order to execute dbt, environments define three variables:

1. The version of dbt Core that will be used to run your project
2. The warehouse connection information (including the target database/schema settings)
3. The version of your code to execute

For users familiar with development on the CLI, each environment is roughly analogous to an entry in your `profiles.yml` file, with some additional information about your repository to ensure the proper version of code is executed. More info on dbt core environments [here](/docs/core/dbt-core-environments).

## Types of environments

In dbt Cloud, there are two types of environments:
- [Deployment environment(/docs/deploy/deploy-environments)] &mdash; Determines the settings used when jobs created within that environment are executed. 
- [Development environment](#create-a-development-environment) &mdash; Determines the settings used in the dbt Cloud IDE for that particular dbt Cloud project. 

Each dbt Cloud project can only have a single development environment but can have any number of deployment environments.

|  | Development Environments | Deployment Environments |
| --- | --- | --- |
| Determines settings for | dbt Cloud IDE | dbt Cloud Job runs |
| How many can I have in my project? | 1 | Any number |

## Common environment settings

Both development and deployment environments have a section called **General Settings**, which has some basic settings that all environments will define:

| Setting | Example Value | Definition | Accepted Values |
| --- | --- | --- | --- |
| Name | Production  | The environment name  | Any string! |
| Environment Type | Deployment | The type of environment | [Deployment, Development] |
| dbt Version | 1.4 (latest) | The dbt version used  | Any dbt version in the dropdown |
| Default to Custom Branch | ☑️ | Determines whether to use a branch other than the repository’s default  | See below |
| Custom Branch | dev | Custom Branch name | See below |

:::note About dbt version

- dbt Cloud allows users to select any dbt release. At this time, **environments must use a dbt version greater than or equal to v1.0.0;** [lower versions are no longer supported](/docs/dbt-versions/upgrade-core-in-cloud).
- If you select a current version with `(latest)` in the name, your environment will automatically install the latest stable version of the minor version selected.
:::

### Custom branch behavior

By default, all environments will use the default branch in your repository (usually the `main` branch) when accessing your dbt code. This is overridable within each dbt Cloud Environment using the **Default to a custom branch** option. This setting have will have slightly different behavior depending on the environment type:

- **Development**: determines which branch in the dbt Cloud IDE developers create branches from and open PRs against
- **Deployment:** determines the branch is cloned during job executions for each environment.

For more info, check out this [FAQ page on this topic](/faqs/Environments/custom-branch-settings)!

## Create a development environment

To create a new dbt Cloud development environment, navigate to **Deploy** -> **Environments** and then click **Create Environment**. Select **Development** as the environment type.

After setting the **General Settings** as above, there’s nothing more that needs to be done on the environments page. Click **Save** to create the environment.

### Set developer credentials

To use the IDE, each developer will need to set up [personal development credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#access-the-cloud-ide) to your warehouse connection in their **Profile Settings**. This allows users to set separate target information, as well as maintain individual credentials to connect to your warehouse via the dbt Cloud IDE.


<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment-fields.png" width="85%" height="100" title="Creating a development environment"/>
