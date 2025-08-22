---
title: 'Move from dbt Core to the dbt platform: Get started'
id: core-to-cloud-1
description: "Learn how to move from dbt Core to the dbt platform and what you need to get started."
hoverSnippet: "Learn how to move from dbt Core to the dbt platform."
icon: 'guides'
time_to_complete: 'Total estimated time: 3-4 hours'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt platform']
keywords: ['dbt Core','dbt platform','Migration', 'Move dbt', 'Migrate dbt']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Introduction

Moving from <Constant name="core" /> to <Constant name="cloud" /> streamlines analytics engineering workflows by allowing teams to develop, test, deploy, and explore data products using a single, fully managed software service.

Explore our 3-part-guide series on moving from <Constant name="core" /> to <Constant name="cloud" />. This series is ideal for users aiming for streamlined workflows and enhanced analytics:

import CoretoCloudTable from '/snippets/_core-to-cloud-guide-table.md';

<CoretoCloudTable/>

<Expandable alt_header="What are dbt and dbt Core?">

   - <Constant name="cloud" /> is the fastest and most reliable way to deploy dbt. It enables you to develop, test, deploy, and explore data products using a single, fully managed service. It also supports:
     - Development experiences tailored to multiple personas ([<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation))
     - Out-of-the-box [CI/CD workflows](/docs/deploy/ci-jobs)
     - The [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) for consistent metrics
     - Domain ownership of data with multi-project [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) setups
     - [<Constant name="explorer" />](/docs/explore/explore-projects) for easier data discovery and understanding

   Learn more about [<Constant name="cloud" /> features](/docs/cloud/about-cloud/dbt-cloud-features).
- <Constant name="core" /> is an open-source tool that enables data teams to define and execute data transformations in a cloud data warehouse following analytics engineering best practices. While this can work well for ‘single players’ and small technical teams, all development happens on a command-line interface, and production deployments must be self-hosted and maintained. This requires significant, costly work that adds up over time to maintain and scale.

</Expandable>

## What you'll learn

This guide outlines the steps you need to take to move from <Constant name="core" /> to <Constant name="cloud" /> and highlights the necessary technical changes:

- [Account setup](/guides/core-to-cloud-1?step=4): Learn how to create a <Constant name="cloud" /> account, invite team members, and configure it for your team.
- [Data platform setup](/guides/core-to-cloud-1?step=5): Find out about connecting your data platform to <Constant name="cloud" />.
- [<Constant name="git" /> setup](/guides/core-to-cloud-1?step=6): Learn to link your dbt project's <Constant name="git" /> repository with <Constant name="cloud" />.
- [Developer setup:](/guides/core-to-cloud-1?step=7) Understand the setup needed for developing in <Constant name="cloud" />.
- [Environment variables](/guides/core-to-cloud-1?step=8): Discover how to manage environment variables in <Constant name="cloud" />, including their priority.
- [Orchestration setup](/guides/core-to-cloud-1?step=9): Learn how to prepare your <Constant name="cloud" /> environment and jobs for orchestration.
- [Models configuration](/guides/core-to-cloud-1?step=10): Get insights on validating and running your models in <Constant name="cloud" />, using either the <Constant name="cloud_ide" /> or <Constant name="cloud" /> CLI.
- [What's next?](/guides/core-to-cloud-1?step=11): Summarizes key takeaways and introduces what to expect in the following guides.

### Related docs
- [Learn <Constant name="cloud" />](https://learn.getdbt.com) on-demand video learning.
- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.

## Prerequisites

- You have an existing <Constant name="core" /> project connected to a <Constant name="git" /> repository and data platform supported in [<Constant name="cloud" />](/docs/cloud/connect-data-platform/about-connections). 
- You have a <Constant name="cloud" /> account. **[Don't have one? Start your free trial today](https://www.getdbt.com/signup)**!

## Account setup

This section outlines the steps to set up your <Constant name="cloud" /> account and configure it for your team.

1. [Create your <Constant name="cloud" /> account](https://www.getdbt.com/signup).

2. Provide user [access](/docs/cloud/manage-access/about-user-access) and [invite users](/docs/cloud/manage-access/about-user-access) to your <Constant name="cloud" /> account and project.

3. Configure [Single Sign-On (SSO)](/docs/cloud/manage-access/sso-overview) or [Role-based access control (RBAC)](/docs/cloud/manage-access/about-user-access#role-based-access-control) for easy and secure access. <Lifecycle status="managed,managed_plus" />
   - This removes the need to save passwords and secret environment variables locally.

### Additional configuration
Explore these additional configurations for performance and reliability improvements:

1. In **Account settings**, enable [partial parsing](/docs/cloud/account-settings#partial-parsing) to only reparse changed files, saving time.

2. In **Account settings**, enable [Git repo caching](/docs/cloud/account-settings#git-repository-caching) for job reliability & third-party outage protection. <Lifecycle status="managed,managed_plus" />

## Data platform setup

This section outlines the considerations and methods to connect your data platform to <Constant name="cloud" />.

1. In <Constant name="cloud" />, set up your [data platform connections](/docs/cloud/connect-data-platform/about-connections) and [environment variables](/docs/build/environment-variables). <Constant name="cloud" /> can connect with a variety of data platform providers including:
   - [AlloyDB](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
   - [Amazon Athena](/docs/cloud/connect-data-platform/connect-amazon-athena)
   - [Amazon Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
   - [Apache Spark](/docs/cloud/connect-data-platform/connect-apache-spark) 
   - [Azure Synapse Analytics](/docs/cloud/connect-data-platform/connect-azure-synapse-analytics)
   - [Databricks](/docs/cloud/connect-data-platform/connect-databricks) 
   - [Google BigQuery](/docs/cloud/connect-data-platform/connect-bigquery)
   - [Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric)
   - [PostgreSQL](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)
   - [Snowflake](/docs/cloud/connect-data-platform/connect-snowflake)
   - [Starburst or Trino](/docs/cloud/connect-data-platform/connect-starburst-trino)
   - [Teradata](/docs/cloud/connect-data-platform/connect-teradata)

2. You can verify your data platform connections by clicking the **Test connection** button in your deployment and development credentials settings.

### Additional configuration

Explore these additional configurations to optimize your data platform setup further:

1. Use [OAuth connections](/docs/cloud/manage-access/set-up-snowflake-oauth), which enables secure authentication using your data platform’s SSO.  <Lifecycle status="managed,managed_plus" />

## Git setup

Your existing dbt project source code should live in a <Constant name="git" /> repository. In this section, you will connect your existing dbt project source code from <Constant name="git" /> to <Constant name="cloud" />.

1. Ensure your dbt project is in a <Constant name="git" /> repository.

2. In **Account settings**, select **Integrations** to [connect your <Constant name="git" /> repository](/docs/cloud/git/git-configuration-in-dbt-cloud) to <Constant name="cloud" />:
   - (**Recommended**) Connect with one of the [native integrations](/docs/cloud/git/git-configuration-in-dbt-cloud) in <Constant name="cloud" /> (such as GitHub, GitLab, and Azure DevOps).

     This method is preferred for its simplicity, security features (including secure OAuth logins and automated workflows like CI builds on pull requests), and overall ease of use.
   - [Import a <Constant name="git" /> repository](/docs/cloud/git/import-a-project-by-git-url) from any valid <Constant name="git" /> URL that points to a dbt project.

## Developer setup

This section highlights the development configurations you’ll need for your <Constant name="cloud" /> project. The following categories are covered in this section:

- [<Constant name="cloud" /> environments](/guides/core-to-cloud-1?step=7#dbt-cloud-environments)
- [Initial setup steps](/guides/core-to-cloud-1?step=7#initial-setup-steps)
- [Additional configuration](/guides/core-to-cloud-1?step=7#additional-configuration-2)
- [<Constant name="cloud" /> commands](/guides/core-to-cloud-1?step=7#dbt-cloud-commands)

### dbt environments

The most common data environments are production, staging, and development. The way dbt Core manages [environments](/docs/environments-in-dbt) is through `target`, which are different sets of connection details. 

[<Constant name="cloud" /> environments](/docs/dbt-cloud-environments) go further by:
- Integrating with features such as job scheduling or version control, making it easier to manage the full lifecycle of your dbt projects within a single platform.
- Streamlining the process of switching between development, staging, and production contexts.
- Making it easy to configure environments through the <Constant name="cloud" /> UI instead of manually editing the `profiles.yml` file. You can also [set up](/reference/dbt-jinja-functions/target) or [customize](/docs/build/custom-target-names) target names in <Constant name="cloud" />.
- Adding `profiles.yml` attributes to <Constant name="cloud" /> environment settings with [Extended Attributes](/docs/dbt-cloud-environments#extended-attributes).
- Using [Git repo caching](/docs/cloud/account-settings#git-repository-caching) to protect you from third-party outages, Git auth failures, and more. <Lifecycle status="managed,managed_plus" />

### Initial setup steps
1. **Set up development environment** &mdash; Set up your [development](/docs/dbt-cloud-environments#create-a-development-environment) environment and [development credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#access-the-cloud-ide). You’ll need this to access your dbt project and start developing.

2. **dbt Core version** &mdash; In your <Constant name="cloud" /> environment, select a [release track](/docs/dbt-versions/cloud-release-tracks) for ongoing dbt version upgrades. If your team plans to use both dbt Core and <Constant name="cloud" /> for developing or deploying your dbt project, you can run `dbt --version` in the command line to find out which version of dbt Core you’re using.
   - When using <Constant name="core" />, you need to think about which version you’re using and manage your own upgrades. When using <Constant name="cloud" />, leverage [release tracks](/docs/dbt-versions/cloud-release-tracks) so you don’t have to.

3. **Connect to your data platform** &mdash; When using <Constant name="cloud" />, you can [connect to your data platform](/docs/cloud/connect-data-platform/about-connections) directly in the UI.
   - Each environment is roughly equivalent to an entry in your `profiles.yml` file. This means you don't need a `profiles.yml` file in your project.

4. **Development tools** &mdash; Set up your development workspace with the [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) (command line interface or code editor) or [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) (browser-based) to build, test, run, and version control your dbt code in your tool of choice.
   - If you've previously installed <Constant name="core" />, the [<Constant name="cloud" /> CLI installation doc](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli) has more information on how to install the <Constant name="cloud" /> CLI, create aliases, or uninstall <Constant name="core" /> for a smooth transition.

### Additional configuration
Explore these additional configurations to optimize your developer setup further:

1. **Custom target names** &mdash; Using [`custom target.names`](/docs/build/custom-target-names) in your dbt projects helps identify different environments (like development, staging, and production). While you can specify the `custom target.name` values in your developer credentials or orchestration setup, we recommend using [environment variables](/docs/build/environment-variables) as the preferred method. They offer a clearer way to handle different environments and are better supported by dbt's partial parsing feature, unlike using [`{{ target }}` logic](/reference/dbt-jinja-functions/target) which is meant for defining the data warehouse connection.

### dbt commands
1. Review the [dbt commands](/reference/dbt-commands) supported for <Constant name="cloud" /> development. For example, `dbt init` isn’t needed in <Constant name="cloud" /> as you can create a new project directly in <Constant name="cloud" />.

## Environment variables
This section will help you understand how to set up and manage <Constant name="cloud" /> environment variables for your project. The following categories are covered:
- [Environment variables in <Constant name="cloud" />](/guides/core-to-cloud-1?step=7#environment-variables-in-dbt-cloud)
- [<Constant name="cloud" /> environment variables order of precedence](/guides/core-to-cloud-1?step=7#dbt-cloud-environment-variables-order-of-precedence)
- [Set environment variables in <Constant name="cloud" />](/guides/core-to-cloud-1?step=7#set-environment-variables-in-dbt-cloud)

In <Constant name="cloud" />, you can set [environment variables](/docs/build/environment-variables) in the <Constant name="cloud" /> user interface (UI). Read [Set up environment variables](#set-environment-variables-in-dbt-cloud) for more info.

In dbt Core, environment variables, or the [`env_var` function](/reference/dbt-jinja-functions/env_var), are defined manually by the developer or within the external application running dbt.

### Environment variables in dbt
  - <Constant name="cloud" /> environment variables must be prefixed with `DBT_` (including `DBT_ENV_CUSTOM_ENV_` or `DBT_ENV_SECRET`).
  - If your <Constant name="core" /> environment variables don’t follow this naming convention, perform a [“find and replace”](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#dbt-cloud-ide-features) in your project to make sure all references to these environment variables contain the proper naming conventions.
- <Constant name="cloud" /> secures environment variables that enable more flexible configuration of data warehouse connections or git provider integrations, offering additional measures for sensitive values, such as prefixing keys with `DBT_ENV_SECRET`to obscure them in logs and the UI.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/project-environment-view.png" title="Setting project level and environment level values"/>

### dbt environment variables order of precedence
Environment variables in <Constant name="cloud" /> are managed with a clear [order of precedence](/docs/build/environment-variables#setting-and-overriding-environment-variables), allowing users to define values at four levels (highest to lowest order of precedence):
   - The job level (job override) or in the <Constant name="cloud_ide" /> for an individual developer (personal override). _Highest precedence_
   - The environment level, which can be overridden by the job level or personal override.
   - A project-wide default value, which can be overridden by the environment level, job level, or personal override.
   - The optional default argument supplied to the `env_var` Jinja function in the code. _Lowest precedence_
  
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/env-var-precdence.png" title="Environment variables order of precedence"/>

### Set environment variables in dbt

- To set these variables for an entire project or specific environments, navigate to **Deploy** > **Environments** > **Environment variables** tab.
- To set these variables at the job level, navigate to **Deploy** > **Jobs** > **Select your job** > **Settings** > **Advanced settings**.
- To set these variables at the personal override level, navigate to **Profile Settings** > **Credentials** > **Select your project** > **Environment variables**.

## Orchestration setup

This section outlines the considerations and methods to set up your <Constant name="cloud" /> environments and jobs for orchestration. The following categories are covered in this section:

- [<Constant name="cloud" /> environments](/guides/core-to-cloud-1?step=8#dbt-cloud-environments-1)
- [Initial setup steps](/guides/core-to-cloud-1?step=8#initial-setup-steps-1)
- [Additional configuration](/guides/core-to-cloud-1?step=8#additional-configuration-3)
- [CI/CD setup](/guides/core-to-cloud-1?step=8#cicd-setup)

### dbt environments
To use the [<Constant name="cloud" />'s job scheduler](/docs/deploy/job-scheduler), set up one environment as the production environment. This is the [deployment](/docs/deploy/deploy-environments) environment. You can set up multiple environments for different stages of your deployment pipeline, such as development, staging/QA, and production.

### Initial setup steps
1. **<Constant name="core" /> version** &mdash; In your environment settings, configure <Constant name="cloud" /> with the same <Constant name="core" /> version.
   - Once your full migration is complete, we recommend upgrading your environments to [release tracks](/docs/dbt-versions/cloud-release-tracks) to always get the latest features and more. You only need to do this once.

2. **Configure your jobs** &mdash; [Create jobs](/docs/deploy/deploy-jobs#create-and-schedule-jobs) for scheduled or event-driven dbt jobs. You can use cron execution, manual, pull requests, or trigger on the completion of another job.
   - Note that alongside [jobs in <Constant name="cloud" />](/docs/deploy/jobs), discover other ways to schedule and run your dbt jobs with the help of other tools. Refer to [Integrate with other tools](/docs/deploy/deployment-tools) for more information.

### Additional configuration
Explore these additional configurations to optimize your <Constant name="cloud" /> orchestration setup further:

1. **Custom target names** &mdash; Use environment variables to set a `custom target.name` for every [corresponding <Constant name="cloud" /> job](/docs/build/custom-target-names) at the environment level.

2. **dbt commands** &mdash; Add any relevant [dbt commands](/docs/deploy/job-commands) to execute your <Constant name="cloud" /> jobs runs.

3. **Notifications** &mdash; Set up [notifications](/docs/deploy/job-notifications) by configuring email and Slack alerts to monitor your jobs.

4. **Monitoring tools** &mdash; Use [monitoring tools](/docs/deploy/monitor-jobs) like run history, job retries, job chaining, dashboard status tiles, and more for a seamless orchestration experience.

5. **API access** &mdash; Create [API auth tokens](/docs/dbt-cloud-apis/authentication) and access to [<Constant name="cloud" /> APIs](/docs/dbt-cloud-apis/overview) as needed.  <Lifecycle status="self_service,managed" />

6. **<Constant name="explorer" />** &mdash; If you use [<Constant name="explorer" />](/docs/explore/explore-projects) and run production jobs with an external orchestrator, ensure your production jobs run `dbt run` or `dbt build` to update and view models and their [metadata](/docs/explore/explore-projects#generate-metadata) in <Constant name="explorer" />. Running `dbt compile`  alone will not update model metadata. In addition, features like column-level lineage also requires catalog metadata produced through running `dbt docs generate`. <Lifecycle status="self_service,managed" />

### CI/CD setup

Building a custom solution to efficiently check code upon pull requests is complicated. With <Constant name="cloud" />, you can enable [continuous integration / continuous deployment (CI/CD)](/docs/deploy/continuous-integration) and configure <Constant name="cloud" /> to run your dbt projects in a temporary schema when new commits are pushed to open pull requests.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-workflow.png" width="90%" title="Workflow of continuous integration in dbt"/>

This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool for data practitioners.

1. Set up an integration with a native <Constant name="git" /> application (such as Azure DevOps, GitHub, GitLab) and a CI environment in <Constant name="cloud" />.
2. Create [a CI/CD job](/docs/deploy/ci-jobs) to automate quality checks before code is deployed to production.
3. Run your jobs in a production environment to fully implement CI/CD. Future pull requests will also leverage the last production runs to compare against.

## Model development and discovery

In this section, you’ll be able to validate whether your models run or compile correctly in your development tool of choice: The [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation).

You’ll want to make sure you set up your [development environment and credentials](/docs/dbt-cloud-environments#set-developer-credentials).

1. In your [development tool](/docs/cloud/about-develop-dbt) of choice, you can review your dbt project, ensure it's set up correctly, and run some [dbt commands](/reference/dbt-commands):
   - Run `dbt compile` to make sure your project compiles correctly.
   - Run a few models in the <Constant name="cloud_ide" /> or <Constant name="cloud" /> CLI to ensure you’re experiencing accurate results in development.

2. Once your first job has successfully run in your production environment, use [<Constant name="explorer" />](/docs/explore/explore-projects) to view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their <Term id="data-lineage" />  to gain a better understanding of its latest production state. <Lifecycle status="self_service,managed" />

## What’s next?

<ConfettiTrigger>

Congratulations on completing the first part of your move to <Constant name="cloud" /> 🎉!

You have learned:
- How to set up your <Constant name="cloud" /> account
- How to connect your data platform and <Constant name="git" /> repository
- How to configure your development, orchestration, and CI/CD environments
- How to set up environment variables and validate your models


For the next steps, you can continue exploring our 3-part-guide series on moving from <Constant name="core" /> to <Constant name="cloud" />:


<CoretoCloudTable/>

### Related docs
- [Learn <Constant name="cloud" />](https://learn.getdbt.com) video courses for on-demand learning.
- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights.
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.
- [How <Constant name="cloud" /> compares with <Constant name="core" />](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud) for a detailed comparison of <Constant name="core" /> and <Constant name="cloud" />.
- Subscribe to the [<Constant name="cloud" /> RSS alerts](https://status.getdbt.com/)

</ConfettiTrigger>

</div>
