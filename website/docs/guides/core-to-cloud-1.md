---
title: Switch from dbt Core to dbt Cloud - Getting started
id: core-to-cloud-1
description: "Learn how to Switch from dbt Core to dbt Cloud and what you need to get started."
hoverSnippet: "Use this guide to learn how to switch from dbt Core to dbt Cloud."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---
## Introduction

Switching from dbt Core to dbt Cloud streamlines analytics engineering workflows by allowing teams to develop, test, deploy, and explore data products using a single, fully managed service.

- dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, deploy, and explore data products using a single, fully managed service. It also supports the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or command line with [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) for development, a [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) for consistent metrics, and domain ownership of data with multi-project “[dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro)” setups.
  
  Learn more about [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features).

- dbt Core is an open-source tool that enables data teams to transform data following analytics engineering best practices using a command line interface. It must be self-hosted and maintained.

### What you'll learn

This guide outlines what you need to do in order to switch from dbt Core to dbt Cloud and highlights the necessary technical changes: .

- [Account setup](/guides/core-to-cloud-1?step=3#account-set-up): Learn how to create a dbt Cloud account, invite team members, and configure it for your team.
- [Environment variables](/guides/core-to-cloud-1?step=4#environment-variables): Discover how to manage environment variables in dbt Cloud, including their priority.
- [Data platform setup](/guides/core-to-cloud-1?step=5#data-platform-set-up): Find out about connecting your data platform to dbt Cloud.
- [Git setup](/guides/core-to-cloud-1?step=6#git-set-up): Learn to link your dbt project's Git repository with dbt Cloud.
- [Developer setup:](/guides/core-to-cloud-1?step=7#developer-set-up) Understand the setup needed for developing in dbt Cloud.
- [Orchestration setup](/guides/core-to-cloud-1?step=8#orchestration-set-up): Learn how to prepare your dbt Cloud environment and jobs for orchestration.
- [Models configuration](/guides/core-to-cloud-1?step=9#models-configuration): Get insights on validating and running your models in dbt Cloud, using either the dbt Cloud IDE or dbt Cloud CLI.
- [What's next?](/guides/core-to-cloud-1?step=10#whats-next): Summarizes key takeaways and introduces what to expect in the following guides.

## Prerequisites

- You have dbt Core installed.
- You have an existing dbt Core project connected to a data platform and Git repository.
- You have a dbt Cloud account. **[Don't have one? Start your free trial today](https://www.getdbt.com/signup)**!

### Related docs
- [Learn dbt Cloud](https://courses.getdbt.com/collections)
- [Develop with dbt Cloud](/docs/cloud/about-develop-dbt)
- [Deploy jobs](/docs/deploy/deployments)
- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.

## Account setup
*Time to complete: Approximately 30 mins to 1 hour*

1. [Create your dbt Cloud account](https://www.getdbt.com/signup).

2. Learn about [access](/docs/cloud/manage-access/about-user-access) and [invite users](/docs/cloud/manage-access/about-user-access) to your dbt Cloud account and dbt Cloud project.

3. Configure [Single Sign-On (SSO)](/docs/cloud/manage-access/sso-overview) or [Role-based access control (RBAC)](/docs/cloud/manage-access/about-user-access#role-based-access-control) for easy and secure access. <Lifecycle status='enterprise' />
   - This removes the need to save passwords and secret environment variables locally.

4. In **Account settings**, switch on [partial parsing](/docs/deploy/deploy-environments#partial-parsing) to only reparse changed files, saving time.

5. In **Account settings**, enable [Git repo caching](/docs/deploy/deploy-environments#git-repository-caching) to ensure job reliability, protection from third-party outages, and performance. <Lifecycle status='enterprise' />

## Environment variables

1. In dbt Cloud, [environment variables](/docs/build/environment-variables) are managed with a clear order of precedence, allowing users to define values at four levels (highest to lowest order of precedence):
   - The job level (job override) or in the IDE for an individual developer (personal override). _(Highest precedence)_
   - The environment level, which can be overridden by the job level or personal override.
   - A project-wide default value, which can be overridden by the environment level, job level, or personal override.
   - The optional default argument supplied to the `env_var` Jinja function in code. _(Lowest precedence)_
  
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/env-var-precdence.png" title="Environment variables order of precedence"/>

2. dbt Cloud secures environment variables, offering additional measures for sensitive values, such as prefixing keys with `DBT_ENV_SECRET_` to obscure them in logs and the user interface (UI).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/project-environment-view.png" title="Setting project level and environment level values"/>

3. Ensure that all [environment variables](/docs/build/environment-variables) start with `DBT_` or `DBT_ENV_SECRET_`. If your dbt Core environment variables don’t follow this naming convention, perform a “find and replace” in your project to make sure all references to these environment variables contain the proper naming conventions.

### How to set environment variables in dbt Cloud

- To set these variables for an entire project or specific environments, navigate to **Deploy** > **Environments** > **Environment variables** tab.
- To set these variables at the job level, navigate to **Deploy** > **Jobs** > **Select your job** > **Settings** > **Advanced settings**.
- To set these variables at the personal override level, navigate to **Profile Settings** > **Credentials** > **Select your project** > **Environment variables**.

## Data platform setup
_*Time to complete: Approximately 10-30 mins_

This section explains the considerations and methods to connect your data platform to dbt Cloud.

1. Set up your [data platform connections](/docs/cloud/connect-data-platform/about-connections) and [environment variables](/guides/core-to-cloud-1?step=4) in dbt Cloud. dbt Cloud can connect with a variety of data platform providers including:
   - [AlloyDB](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
   - [Amazon Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
   - [Apache Spark](/docs/cloud/connect-data-platform/connect-apache-spark) 
   - [Databricks](/docs/cloud/connect-data-platform/connect-databricks) 
   - [Google BigQuery](/docs/cloud/connect-data-platform/connect-bigquery)
   - [Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric)
   - [PostgreSQL](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)
   - [Snowflake](/docs/cloud/connect-data-platform/connect-snowflake)
   - [Starburst or Trino](/docs/cloud/connect-data-platform/connect-starburst-trino)

2. You can verify your data platform connections by clicking the **Test connection** button in your deployment and development credentials settings.

### Advanced configuration
3. Use [OAuth connections](/docs/cloud/manage-access/set-up-snowflake-oauth), which enables secure authentication using your data platform’s SSO.  <Lifecycle status='enterprise' />

## Git setup
_*Time to complete: Approximately 10 to 30 mins_

Your existing dbt project source code should live in a Git repository. In this step, you should connect your existing dbt project source code from Git to dbt Cloud.

1. Ensure your dbt project is in a Git repository

2. Once you’ve set up a dbt Cloud account, you can [connect and configure Git](/docs/cloud/git/git-configuration-in-dbt-cloud) in dbt Cloud to connect your Git repository:
   - Connect with one of the [native integrations](/docs/cloud/git/git-configuration-in-dbt-cloud) in dbt Cloud (such as GitHub, GitLab, and Azure DevOps).
   - [Import a git repository](/docs/cloud/git/import-a-project-by-git-url) from any valid git URL that points to a dbt project.

### Advanced configuration
3. Log into dbt Cloud using [OAuth connections](/docs/cloud/git/connect-github) to integrate with your source code platform. It automatically links to the repository using one of the native integrations set at the account level. <Lifecycle status='enterprise' />
  
  Set up groups for dbt project access with those configured for repository access to streamline permissions.

## Developer setup
_*Time to complete: Approximately 30 mins to 1 hour_

This section highlights the development configurations you’ll need for your dbt Cloud project. The following categories are covered in this section:

- [dbt Cloud environments](/guides/core-to-cloud-1?step=7#dbt-cloud-environments)
- [Initial setup steps](/guides/core-to-cloud-1?step=7#initial-set-up-steps)
- [Advanced configuration](/guides/core-to-cloud-1?step=7#initial-set-up-steps)
- [dbt Cloud commands](/guides/core-to-cloud-1?step=7#dbt-cloud-commands)

### dbt Cloud environments

The concept of a `target` in dbt Core is the same as a [dbt Cloud environment](/docs/environments-in-dbt).

The main difference between `target` in dbt Core and a dbt Cloud environment is that you can make these configurations through the dbt Cloud UI, as opposed to within your **`profiles.yml`** file.

This difference streamlines the process of switching between development, staging, and production contexts, removing the need to manually edit a **`profiles.yml`** file. dbt Cloud environments also integrate with additional features such as job scheduling, version control, and more, making it easier to manage the full lifecycle of your dbt projects within a single platform You can [set up](/reference/dbt-jinja-functions/target) or [customize](/docs/build/custom-target-names) target names in dbt Cloud.

### Initial setup steps
1. **Set up development environment** &mdash; Set up your [development](/docs/dbt-cloud-environments#create-a-development-environment) environment and [development credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#access-the-cloud-ide). You’ll need this to access your dbt project and start developing.

2. **dbt Core version** &mdash; In your dbt Cloud environment and credentials, use the same dbt Core version you use locally. You can run `dbt --version` in the command line to find out which version of dbt Core you’re using.
   - Once your full migration is complete, consider upgrading your environments to [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version-) to always get the latest fixes and more.

3. **Connect to your data platform** &mdash; When using dbt Cloud, you can [connect to your data platform](/docs/cloud/connect-data-platform/about-connections) directly in the UI and don't need a `profiles.yml` file. Each environment is roughly equivalent to an entry in your `profiles.yml` file.
4. **Development tools** &mdash; Set up your development workspace with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to edit and develop your dbt code in your tool of choice.

### Advanced configuration
5. **Custom target names** &mdash; If you’re using a [`custom target.name`](/reference/dbt-jinja-functions/target) in your project, we recommend you set them using [environment variables](/docs/build/environment-variables). Alternatively, you can update it at the developer credentials level.

6. **API access** &mdash; Create [API auth tokens](/docs/dbt-cloud-apis/authentication) and access to [dbt Cloud APIs](/docs/dbt-cloud-apis/overview) as needed.  <Lifecycle status="team,enterprise" />

### dbt Cloud commands
7. Review the [dbt commands](/reference/dbt-commands) supported for dbt Cloud development. For example, `dbt debug` isn’t needed in dbt Cloud since the UI displays logs for your viewing.

## Orchestration setup
_*Time to complete: Approximately 30 mins to 1 hour_

This section outlines the considerations and methods to set up your dbt Cloud environments and jobs for orchestration. The following categories are covered in this section:

- [dbt Cloud environments](/guides/core-to-cloud-1?step=8#dbt-cloud-environments-1)
- [Initial setup steps](/guides/core-to-cloud-1?step=8#initial-set-up-steps-1)
- [Additional configurations](/guides/core-to-cloud-1?step=8#additional-configurations)
- [CI/CD setup](/guides/core-to-cloud-1?step=8#cicd-set-up)

### dbt Cloud environments
To use the [dbt Cloud's scheduler](/docs/deploy/job-scheduler), set up one environment as the production environment. This would be the [deployment](/docs/deploy/deploy-environments) environment. You can set up multiple environments for different stages of your deployment pipeline, such as development, staging/QA, and production.

### Initial setup steps
1. **dbt Core version** &mdash; In your environment settings, configure dbt Cloud with the same dbt Core version.
   - Once your full migration is complete, consider upgrading your environments to [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version-) to always get the latest fixes and more.

2. **[Configure your jobs](/docs/deploy/deploy-jobs)** &mdash; You can create jobs for automated or event-driven dbt jobs. You can use cron execution, manual, pull requests, or API triggers.
   - Note that alongside [dbt Cloud](/docs/deploy/jobs), discover other ways to schedule and run your dbt jobs with the help of tools. Refer to [Integrate with other tools](/docs/deploy/deployment-tools) for more information.

### Additional configurations
3. **Custom target names** &mdash; You should set a `custom target.name` for every single [corresponding dbt Cloud job](/docs/build/custom-target-names). We recommend modifying the code to use [environment variables](/docs/build/environment-variables) instead since those can be set at the environment level.

4. **dbt commands** &mdash; Add any relevant [dbt commands](/docs/deploy/job-commands) to execute your dbt Cloud jobs runs.

5. **Notifications** &mdash; Set up [notifications](/docs/deploy/job-notifications) by configuring email and Slack alerts to monitor your jobs.

6. **Monitoring tools** &mdash; Use [monitoring tools](/docs/deploy/monitor-jobs) like run history, job retries, job chaining, dashboard status tiles, and more for a seamless orchestration experience.

7. **dbt Explorer** &mdash; If you use [dbt Explorer](/docs/collaborate/explore-projects) and run production jobs with an external orchestrator, ensure your production jobs run `dbt run` or `dbt build` to update and view resources and its metadata in dbt Explorer. Running `dbt compile` will not update resources and its metadata.

### CI/CD setup

Building a custom solution to efficiently check code upon pull requests is complicated. With dbt Cloud, you can enable [continuous integration / continuous deployment (CI/CD)](/docs/deploy/continuous-integration) and configure dbt Cloud to run your dbt projects in a temporary schema when new commits are pushed to open pull requests. 

This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool for data practitioners.

1. Set up an integration with a native git application (such as Azure DevOps, GitHub, GitLab) and a CI environment in dbt Cloud.
2. Create [a CI/CD job](/docs/deploy/ci-jobs) to optimize workflows.
3. Run your jobs in a production environment to fully implement CI/CD. Future pull requests will also leverage the last production runs to compare against.

## Models configuration
_*Time to complete: Approximately 30 mins_

In this section, you’ll be able to validate whether your models run or compile correctly in your development tool of choice: [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).

You’ll want to make sure you set up your [development environment and credentials](#developer-set-up).

1. In your [development tool](/docs/cloud/about-develop-dbt) of choice, you can review your dbt project and ensure your project is set up correctly and you’re able to run commands. This means:
   - Make sure your project compiles correctly.
   - Run a few models in the dbt Cloud IDE or dbt Cloud CLI to ensure you’re experiencing accurate results in development.

2. Once your first job has successfully run in your production environment, use [dbt Explorer](/docs/collaborate/explore-projects) to view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their [lineage](/terms/data-lineage) to gain a better understanding of its latest production state.

## What’s next?

import ConfettiTrigger from '/src/components/confetti/index.js';

<ConfettiTrigger>

Congrats on completing the first part of your switch to dbt Cloud 🎉! 

You should have learned:
- How to set up your dbt Cloud account
- Connect your data platform and Git repository
- Configure your development, orchestration, and CI/CD environments
- You’ve also set up your models and are ready to run your first job in dbt Cloud.

For next steps, we'll soon share other guides on how to manage your switch and trips. Stay tuned!

<!--
- Link to the next guide (managing your migration or switch, etc.)
- Link to tips and faqs?
-->

### Related docs

- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.

</ConfettiTrigger>
