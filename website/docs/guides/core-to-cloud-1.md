---
title: Switch from dbt Core to dbt Cloud
id: core-to-cloud-1
description: "Create an adapter that connects dbt to you platform, and learn how to maintain and version that adapter."
hoverSnippet: "Learn how to build, test, document, and promote adapters as well as maintaining and versioning an adapter."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---

## Switch to dbt Cloud

Switching from dbt Core to dbt Cloud streamlines analytics engineering workflows by allowing teams to develop, test, deploy, and explore data products using a single, fully managed service.

This guide outlines the considerations needed to migrate your dbt project from Core to Cloud, highlighting collaboration enhancements and technical adjustments.

- dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, deploy, and explore data products using a single, fully managed service. dbt Cloud also supports a command line with dbt Cloud CLI, a Semantic Layer for consistent metrics, and domain ownership of data with multi-project “dbt Mesh” setups. Learn more about [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features).
- dbt Core is an open-source tool that enables data teams to transform data following analytics engineering best practices using a command line interface. It must be self-hosted and maintained.

## Prerequisites

- You have dbt Core installed.
- You have an existing dbt Core project connected to a data platform and Git repository.
- You have a dbt Cloud account. **[Don't have one? Start your free trial today](https://www.getdbt.com/signup)**!

## Account set up
*Time to complete: Approximately 30 mins to 1 hour*

- [Create your dbt Cloud account](https://www.getdbt.com/signup).
- Learn about [access](/docs/cloud/manage-access/about-user-access) and [invite users](/docs/cloud/manage-access/about-user-access) to your dbt Cloud account and dbt Cloud project.
- Configure [Single Sign-On (SSO)](/docs/cloud/manage-access/sso-overview) or [Role-based access control (RBAC)](/docs/cloud/manage-access/about-user-access#role-based-access-control) for easy and secure access. <Lifecycle status='enterprise' />
  - This removes the need to save passwords and secret environment variables locally.
- In **Account settings**, switch on [partial parsing](/docs/deploy/deploy-environments#partial-parsing) to only reparse changed files, saving time.
- In **Account settings**, enable [Git repo caching](/docs/deploy/deploy-environments#git-repository-caching) to ensure job reliability, protection from third-party outages, and performance. <Lifecycle status='enterprise' />

## Environment variables

- In dbt Cloud, [environment variables](/docs/build/environment-variables) are managed with a clear order of precedence, allowing users to define values at four levels (highest to lowest order of precedence):

  - The job level (job override) or in the IDE for an individual developer (personal override). _(Highest precedence)_
  - The environment level, which can be overridden by the job level or personal override.
  - A project-wide default value, which can be overridden by the environment level, job level, or personal override.
  - The optional default argument supplied to the `env_var` Jinja function in code. _(Lowest precedence)_
  
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/env-var-precdence.png" title="Environment variables order of precedence"/>

- dbt Cloud secures environment variables, offering additional measures for sensitive values, such as prefixing keys with `DBT_ENV_SECRET_` to obscure them in logs and the user interface (UI).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/project-environment-view.png" title="Setting project level and environment level values"/>

- Ensure that all [environment variables](/docs/build/environment-variables) start with `DBT_` or `DBT_ENV_SECRET_`. If your dbt Core environment variables don’t follow this naming convention, perform a “find and replace” in your project to make sure all references to these environment variables contain the proper naming conventions.

<expandable alt_header="How to set environment variables in dbt Cloud">

- To set these variables for an entire project or specific environments, navigate to **Deploy** > **Environments** > **Environment variables** tab.
- To set these variables at the job level, navigate to **Deploy** > **Jobs** > **Select your job** > **Settings** > **Advanced settings**.
- To set these variables at the personal override level, navigate to **Profile Settings** > **Credentials** > **Select your project** > **Environment variables**.

</expandable>

## Data platform set up
_*Time to complete: Approximately 10-30 mins_

This section explains the considerations and methods to connect your data platform to dbt Cloud.

- Set up your [data platform connections](/docs/cloud/connect-data-platform/about-connections) and [`environment variables`](#environment-variables) in dbt Cloud.
  
  You can verify your data platform connections by clicking the **Test connection** button in your deployment and development credentials settings.

- Use [OAuth connections](/docs/cloud/manage-access/set-up-snowflake-oauth), which enable secure authentication using your data platform’s SSO.  <Lifecycle status='enterprise' />

## Git set up
_*Time to complete: Approximately 10 mins_

Your existing dbt project source code should live in a Git repository. In this step, you should connect your existing dbt project source code from Git to dbt Cloud.

- Ensure your dbt project is in a Git repository
- Once you’ve set up a dbt Cloud account, you can [connect and configure Git](/docs/cloud/git/git-configuration-in-dbt-cloud) in dbt Cloud to connect your Git repository:
  - Connect with one of the [native integrations](/docs/cloud/git/git-configuration-in-dbt-cloud) in dbt Cloud.
  - [Import a git repository](/docs/cloud/git/import-a-project-by-git-url) from any valid git URL that points to a dbt project.
- Log into dbt Cloud using [OAuth connections](/docs/collaborate/git/connect-github) to integrate with your source code platform. It automatically links to the repository using one of the native integrations set at the account level. <Lifecycle status='enterprise' />
  
  Set up groups for dbt project access with those configured for repository access to streamline permissions.

## Developer set up
_*Time to complete: Approximately 30 mins_

<details>
<summary>💡 What is a <code>target</code> in dbt Cloud?</summary>

The concept of a `target` in dbt Core is the same as a [dbt Cloud environment](/docs/environments-in-dbt).

The main difference between `target` in dbt Core and a dbt Cloud environment is that you can make these configurations through the dbt Cloud UI, as opposed to within your **`profiles.yml`** file.

This difference streamlines the process of switching between development, staging, and production contexts, removing the need to manually edit a **`profiles.yml`** file. dbt Cloud environments also integrate with additional features such as job scheduling, version control, and more, making it easier to manage the full lifecycle of your dbt projects within a single platform You can [set up](/reference/dbt-jinja-functions/target) or [customize](/docs/build/custom-target-names) target names in dbt Cloud.
</details>

This section highlights what foundational configurations you’ll need to set up your dbt Cloud project. After setting up your dbt Cloud account and git integration:

- Set up your [development](/docs/dbt-cloud-environments#create-a-development-environment) environment and [development credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#access-the-cloud-ide). You’ll need this to access your dbt project and start developing.
  - In your dbt Cloud environment and credentials, use the same dbt Core version you use locally. You can run `dbt --version` in the command line to find out which version of dbt Core you’re using.
    - Once your full migration is complete, consider upgrading your environments to [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version-) to always get the latest fixes and more.
  - When using dbt Cloud, you can [connect to your data platform](/docs/cloud/connect-data-platform/about-connections) directly in the UI and don't need a `profiles.yml` file. Each environment is roughly analogous to an entry in your `profiles.yml` file.
- If you’re using a [`custom target.name`](/reference/dbt-jinja-functions/target) in your project, we recommend you set them using [environment variables](/docs/build/environment-variables). Alternatively, you can update it at the developer credentials level.
- Set up your development workspace with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to edit and develop your dbt code in your tool of choice.
- Create [API auth tokens](/docs/dbt-cloud-apis/authentication) and access to [dbt Cloud APIs](/docs/dbt-cloud-apis/overview) as needed.  <Lifecycle status="team,enterprise" />
- Review the [dbt commands](/reference/dbt-commands) supported for dbt Cloud development. For example, `dbt debug` isn’t needed in dbt Cloud since the UI displays logs for your viewing.

## Orchestration set up
*Time to complete: Approximately 30 mins to 1 hour

- To use the [dbt Cloud's scheduler](/docs/deploy/job-scheduler), set up one environment as the production environment. This would be the [deployment](/docs/deploy/deploy-environments) environment.
- In your environment settings, configure dbt Cloud with the same dbt Core version.
  - Once your full migration is complete, consider upgrading your environments to [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version-) to always get the latest fixes and more.
- [Configure your jobs](/docs/deploy/deploy-jobs) for automated or event-driven dbt jobs. You can use cron execution, manual, pull requests, or API triggers.
  - Note that alongside [dbt Cloud](/docs/deploy/jobs), discover other ways to schedule and run your dbt jobs with the help of tools. Refer to [Integrate with other tools](/docs/deploy/deployment-tools) for more information.
- You should set a `custom target.name` for every single [corresponding dbt Cloud job](/docs/build/custom-target-names). We recommend modifying the code to use [environment variables](/docs/build/environment-variables) instead since those can be set at the environment level.
- Add any relevant [dbt commands](/docs/deploy/job-commands) to execute your dbt Cloud jobs runs.
- Set up [notifications](/docs/deploy/job-notifications) by configuring email and Slack alerts to monitor your jobs.
- Use [monitoring tools](/docs/deploy/monitor-jobs) like run history, job retries, job chaining, dashboard status tiles, and more for a seamless orchestration experience.
- If you use [dbt Explorer](/docs/collaborate/explore-projects) and run production jobs with an external orchestrator, ensure your production jobs run `dbt run` or `dbt build` to update and view resources and its metadata in dbt Explorer. Running `dbt compile` will not update resources and its metadata.

### CI/CD set up
*Time to complete: Approximately 30 mins to 1 hour

Building a custom solution to efficiently check code upon pull requests is complicated. With dbt Cloud, you can enable continuous integration / continuous deployment (CI/CD) and configure dbt Cloud to run your dbt projects in a temporary schema when new commits are pushed to open pull requests. This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool for data practitioners.

- Set up an integration with a native git application (such as Azure DevOps, GitHub, GitLab) and a CI environment in dbt Cloud.
- Create [a CI/CD job](/docs/deploy/ci-jobs) to optimize workflows.
- Run your jobs in a production environment to fully implement CI/CD. Future pull requests will also leverage the last production runs to compare against.

## Models configuration
*Time to complete: Approximately 30 mins to 1 hour

In this section, you’ll be able to switch and configure your dbt models to dbt Cloud. You’ll want to make sure you set up your [development environment and credentials](#developer-set-up).

- In your [development tool](/docs/cloud/about-develop-dbt) of choice, you can review your dbt project and ensure your project is set up correctly and you’re able to run commands. This means:
  - Make sure your project compiles correctly.
  - Run a few models in the dbt Cloud IDE or dbt Cloud CLI to ensure you’re experiencing accurate results in development.
- Once your first job has successfully run in your production environment, use [dbt Explorer](/docs/collaborate/explore-projects) to view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their [lineage](/terms/data-lineage) to gain a better understanding of its latest production state.

## What’s next?

- Link to the next guide (managing your migration or switch, etc.)
- Link to tips and faqs?

## Related docs

- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.
