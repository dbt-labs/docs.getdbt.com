---
title: 'Move from dbt Core to dbt Cloud: Optimization tips'
id: core-to-cloud-3
description: "Use this guide to learn how to optimize your dbt Cloud experience and get answers to common questions."
hoverSnippet: "se this guide to learn how to optimize your dbt Cloud experience and get answers to common questions."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt Cloud']
keywords: ['dbt Core','dbt Cloud','Migration', 'Move dbt', 'Migrate dbt']
level: 'Intermediate'
recently_updated: true
---

## Introduction
Moving from dbt Core to dbt Cloud streamlines analytics engineering workflows by allowing teams to develop, test, deploy, and explore data products using a single, fully managed platform.

Explore our 3-guide series on moving from dbt Core to dbt Cloud. The series is ideal for intermediate users aiming for streamlined workflows and enhanced analytics:
- Begin with [Get started](/guides/core-to-cloud-1?step=10) to learn how to move from dbt Core to dbt Cloud and what you need to get started.
- Move on to [Everything you need to know](/docs/guides/core-to-cloud-2) to understand the considerations and methods you need to move from dbt Core to dbt Cloud.
- Lastly, conclude with Optimization tips to learn how to optimize your dbt Cloud experience and get answers to common questions.

This guide shares some tips, enhancements, technical adjustments, and frequently asked questions that you may encounter during your move.

## dbt Cloud CLI and dbt Cloud IDE
**dbt Cloud IDE and dbt Cloud CLI tips**
- The dbt Cloud IDE has a simplified Git functionality
  - You can create feature branches from the branch configured in the development environment.
  - The dbt Cloud IDE makes it possible view saved but not-committed code changes directly in the IDE
  - You can [format or lint](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format) your code with `sqlfluff` or `sqlfmt`. This includes support for adding your custom linting rules.
  - Advanced users who prefer to have more control over their git commands can use the [dbt Cloud CLI](https://docs.getdbt.com/docs/cloud/cloud-cli-installation), allowing users to run dbt commands against their dbt Cloud development environment from their local command line with minimal configuration.
- Whichever they pick, your users will be getting a powerful development experience backed by dbt Cloud. This means the dbt Cloud CLI and the dbt Cloud IDE enable users to natively [defer to production](https://docs.getdbt.com/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cloud-cli) metadata directly in their development workflows. This reduces the number of objects in - The dbt Cloud CLI and dbt Cloud IDE are designed to support [safe parallel execution](https://docs.getdbt.com/reference/dbt-commands#parallel-execution) of dbt commands, leveraging dbt Cloud's infrastructure and its comprehensive [features](https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features). In contrast, `dbt-core` *doesn't support* safe parallel execution for multiple invocations in the same process.
- **Caveats**
- Pre-commit for automated checks before *committing* code is not available (yet).
- Mass-generating files / interacting with the file system are not available
- Combining/piping commands, such as `dbt run -s (bash command)` is not available
  
## Orchestration

**dbt Cloud job scheduler tips**
- Enable [partial parsing](https://docs.getdbt.com/docs/deploy/deploy-environments#partial-parsing) between jobs in dbt Cloud to significantly speed up project parsing by only processing changed files, optimizing performance for large projects.
- The dbt Cloud job scheduler can [run multiple CI/CD](https://docs.getdbt.com/docs/deploy/continuous-integration) jobs at the same time, will not block production runs, and stale runs are automatically canceled when a newer commit is pushed. This is because each PR will run in its own schema.
- dbt Cloud automatically cancels a scheduled run if the existing run is still executing. This prevents unnecessary, duplicative executions.
- Protect you and your data freshness from third-party outages by enabling dbt Cloud’s [Git repository caching](https://docs.getdbt.com/docs/deploy/deploy-environments#git-repository-caching), which keeps a cache of the project's Git repository. (Enterprise only)
- You can *[chain* deploy jobs](https://docs.getdbt.com/docs/deploy/deploy-jobs#trigger-on-job-completion--) across dbt Cloud projects by configuring your job or using the [Create Job API](https://docs.getdbt.com/dbt-cloud/api-v2#/operations/Create%20Job) to do this. (Team or Enterprise only)
- [Rerun your jobs](https://docs.getdbt.com/docs/deploy/retry-jobs) from the start or the point of failure if your dbt job run completed with a status of **`Error.`**
- **Caveats**
- To store your job configurations as code within a repository, you can:
  - Check out our [Terraform provider.](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/resources/job)
  - Alternatively, check out our [jobs-as-code](https://github.com/dbt-labs/dbt-jobs-as-code) repository, which is a tool built to handle dbt Cloud jobs as a well-defined YAML file.
- dbt Cloud users and external emails can receive notifications if a job fails, succeeds, or is cancelled. To get notifications for warnings, you can create a [webhook subscription](https://docs.getdbt.com/guides/zapier-slack) and post to Slack.

## Adapters and connections

**Adapters tips**
- In dbt Cloud, you can natively connect to your data platform and test its [connection](https://docs.getdbt.com/docs/connect-adapters) with a click of a button!
- Manage [dbt versions](https://docs.getdbt.com/docs/dbt-versions/upgrade-dbt-version-in-cloud) and ensure team synchronization with dbt Cloud's one-click feature, eliminating the hassle of manual updates and version discrepancies.
- dbt Cloud supports a whole host of cloud providers, including Snowflake, Databricks, BigQuery, Fabric, and Redshift (to name a few). Check out the full list of supported adapters [here](https://docs.getdbt.com/docs/cloud/connect-data-platform/about-connections).
- Use [Extended Attributes](https://docs.getdbt.com/docs/deploy/deploy-environments#extended-attributes) to set a flexible [profiles.yml](https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml) snippet in your dbt Cloud Environment settings. It gives you more control over environments (both deployment and development) and extends how dbt Cloud connects to the data platform within a given environment.
  - For example, if you have a field in your `profiles.yml` that you’d like to add to the dbt Cloud adapter user interface, you can use Extended Attributes to set it.
**Caveats**
- Not all parameters are available for adapters.
- One project can only use one warehouse type.

## dbt Mesh

To use [cross-project references](https://docs.getdbt.com/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref), all developers need to develop with dbt Cloud (either with the dbt Cloud CLI or dbt Cloud IDE). Cross-project references are not supported in dbt Core.

**dbt Mesh tips**
- Use [dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro) to seamlessly integrate and navigate between different projects and models with [cross-project dependencies](https://docs.getdbt.com/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref), enhancing collaboration and data governance.
- Link models across projects for a modular and scalable approach for your project and teams.
- Manage access to your dbt models both within and across projects using:
  - **[Groups](https://docs.getdbt.com/docs/collaborate/govern/model-access#groups)** - Organize nodes in your dbt DAG that share a logical connection and assign an owner to the entire group.
  - **[Access](https://docs.getdbt.com/docs/collaborate/govern/model-access#access-modifiers)** - Control who can reference models.
  - **[Model Versions](https://docs.getdbt.com/docs/collaborate/govern/model-versions)** - Enable adoption and deprecation of models as they evolve.
  - **[Model Contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts)** -Set clear expectations on the shape of the data to ensure data changes upstream of dbt or within a project's logic don't break downstream consumers' data products.
  - Use [dbt-meshify](https://github.com/dbt-labs/dbt-meshify) if you’d separate your mono-repo in order to move to dbt Cloud.
**Caveat**
- Currently, dbt Mesh does not support circular project dependencies.
 
## dbt Semantic Layer

**dbt Semantic Layer tips**
- Leverage the [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl), powered by MetricFlow, to create a unified view of your business metrics, ensuring consistency across all analytics tools.
- Define semantic models and metrics once with MetricFlow, and reuse them across various analytics platforms, reducing redundancy and errors.
- Use the dbt Semantic Layer APIs to query metrics in downstream tools for consistent, reliable data metrics.
- Connect to several data applications, from business intelligence tools to notebooks, spreadsheets, data catalogs, and more, to query your metrics. Available integrations include Tableau, Google Sheets, Hex, and more!
- Use exports to materialize commonly used queries directly within your data platform, on a schedule.
**Caveats**
- dbt Semantic Layer currently supports the Deployment environment for querying. Development querying experience coming soon.
- You can run queries/semantic layer commands in the dbt Cloud CLI, however running queries/semantic layer commands in the dbt Cloud IDE isn’t supported *yet.*
  - Note that SSH tunneling for [Postgres and Redshift](https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) connections, [PrivateLink](https://docs.getdbt.com/docs/cloud/secure/about-privatelink), and [Single sign-on (SSO)](https://docs.getdbt.com/docs/cloud/manage-access/sso-overview) isn’t supported in the dbt Semantic Layer *yet*.

## dbt Explorer

**dbt Explorer tips**
- [dbt Explorer](https://docs.getdbt.com/docs/collaborate/explore-projects) enhances your ability to discover and understand your data models through rich metadata and lineage visualization.
- Improve documentation accessibility, making it easier for teams to find and understand the data assets available to them.
- Use the search and filter capabilities in dbt Explorer to quickly locate models, sources, and tests, streamlining your workflow.
- View all the different projects and public models in the account, where the public models are defined, and how they are used to gain a better understanding of your cross-project resources.
- Access column-level lineage (CLL) for the resources in your dbt project. (Enterprise plan only).

**Caveats**
- There has been at least one successful job run in the production deployment environment.
- Familiarize yourself with dbt Explorer’s features to fully leverage its capabilities to avoid missed opportunities for efficiency gains.

## What's next?

<ConfettiTrigger>
Congratulations on making it through the Move from dbt Core to dbt Cloud guide 🎉! We hope you’re equipped with useful insights and tips to help you with your move. Something to note is that moving from dbt Core to dbt Cloud isn’t just about evolving your data projects — it's about unlocking new levels of collaboration, governance, efficiency, and innovation within your team.

For next steps, you can continue exploring our 3-part-guide series on moving from dbt Core to dbt Cloud:

- Begin with [Get started](/guides/core-to-cloud-1?step=11) to learn how to move from dbt Core to dbt Cloud and what you need to get started.
- Move on to [Everything you need to know](/docs/guides/core-to-cloud-2) to understand the considerations and methods you need to move from dbt Core to dbt Cloud.
- Conclude with Optimization tips to learn how to optimize your dbt Cloud experience and get answers to common questions.

</ConfettiTrigger>

## Support

If you need any additional help or have some questions, you can reach out to us in the following ways:

- Our [Support team](https://docs.getdbt.com/docs/dbt-support)
- The dbt Slack community. We have specific slack channels dedicated to different product surface areas.
- Subscribe to the [dbt Cloud RSS alerts](https://status.getdbt.com/)
- Your Account representative

....we’re happy to help!

## Resources

For tailored assistance, you can use the following resources:

- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and move.
