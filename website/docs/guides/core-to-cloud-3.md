---
title: 'Move from dbt Core to dbt Cloud: Optimization tips'
id: core-to-cloud-3
description: "Use this guide to learn how to optimize your dbt Cloud experience and get answers to common questions."
hoverSnippet: "Use this guide to learn how to optimize your dbt Cloud experience and get answers to common questions."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt Cloud']
keywords: ['dbt Core','dbt Cloud','Migration', 'Move dbt', 'Migrate dbt']
level: 'Intermediate'
recently_updated: true
---

## Introduction

Moving from dbt Core to dbt Cloud streamlines analytics engineering workflows by allowing teams to develop, test, deploy, and explore data products using a single, fully managed software service.

Explore our 3-part-guide series on moving from dbt Core to dbt Cloud. The series is ideal for users aiming for streamlined workflows and enhanced analytics:

import CoretoCloudTable from '/snippets/_core-to-cloud-guide-table.md';

<CoretoCloudTable/>

## What you'll learn
You may have already started your move to dbt Cloud and are looking for tips to help you optimize your dbt Cloud experience. This guide includes tips and caveats for the following areas:

- [Adapters and connections](https://docs.getdbt.com/guides/core-to-cloud-3?step=3) 
- [Development tools](https://docs.getdbt.com/guides/core-to-cloud-3?step=4) 
- [Orchestration](https://docs.getdbt.com/guides/core-to-cloud-3?step=5)
- [dbt Mesh](https://docs.getdbt.com/guides/core-to-cloud-3?step=6)
- [dbt Semantic Layer](https://docs.getdbt.com/guides/core-to-cloud-3?step=7)
- [dbt Explorer](https://docs.getdbt.com/guides/core-to-cloud-3?step=8)

## Adapters and connections

In dbt Cloud, you can natively connect to your data platform and test its [connection](/docs/connect-adapters) with a click of a button. This is especially useful for users who are new to dbt Cloud or are looking to streamline their connection setup. Here are some tips and caveats to consider:

### Tips
- Manage [dbt versions](/docs/dbt-versions/upgrade-dbt-version-in-cloud) and ensure team collaboration with dbt Cloud's one-click feature, eliminating the need for manual updates and version discrepancies.  You can go [**Versionless**](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) to always get the latest features and early access to new functionality for your dbt project.
- dbt Cloud supports a whole host of [cloud providers](/docs/cloud/connect-data-platform/about-connections), including Snowflake, Databricks, BigQuery, Fabric, and Redshift (to name a few).
- Use [Extended Attributes](/docs/deploy/deploy-environments#extended-attributes) to set a flexible [profiles.yml](/docs/core/connect-data-platform/profiles.yml) snippet in your dbt Cloud environment settings. It gives you more control over environments (both deployment and development) and extends how dbt Cloud connects to the data platform within a given environment.
  - For example, if you have a field in your `profiles.yml` that you’d like to add to the dbt Cloud adapter user interface, you can use Extended Attributes to set it.

### Caveats
- Not all parameters are available for adapters.
- A project can only use one warehouse type.

## Development tools

dbt Cloud empowers data practitioners to develop in the tool of their choice. It ships with a [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) (local) or [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) (browser-based) to build, test, run, and version control your dbt projects.

Both development tools are tailored to suit different audiences and preferences within your team. To streamline your team’s workflow, it's important to know who will prefer the dbt Cloud IDE and who might lean towards the dbt Cloud CLI. This section aims to clarify these preferences.

### dbt Cloud IDE
A web-based interface for building, testing, running, and version-controlling dbt projects. It compiles dbt code into SQL and executes it directly on your database. The dbt Cloud IDE makes developing fast and easy for new and seasoned data practitioners to build and test changes.

**Who might prefer the dbt Cloud IDE?**

- New dbt users or those transitioning from other tools who appreciate a more guided experience through a browser-based interface.
- Team members focused on speed and convenience for getting started with a new or existing project.
- Individuals who prioritize direct feedback from the IDE, such as seeing unsaved changes.

**Key features**

- The dbt Cloud IDE has simplified Git functionality:
  - Create feature branches from the branch configured in the development environment.
  - View saved but not-committed code changes directly in the IDE.
- [Format or lint](/docs/cloud/dbt-cloud-ide/lint-format) your code with `sqlfluff` or `sqlfmt`. This includes support for adding your custom linting rules.
- Allows users to natively [defer to production](/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cloud-cli) metadata directly in their development workflows, reducing the number of objects.
- Support running multiple dbt commands at the same time through [safe parallel execution](/reference/dbt-commands#parallel-execution), a [feature](/docs/cloud/about-cloud/dbt-cloud-features) available in dbt Cloud's infrastructure. In contrast, `dbt-core` *doesn't support* safe parallel execution for multiple invocations in the same process.

The dbt Cloud IDE provides a simplified interface that's accessible to all users, regardless of their technical background. However, there are some capabilities that are intentionally not available in the dbt Cloud IDE due to its focus on simplicity and ease of use:

- Pre-commit for automated checks before *committing* code is not available (yet).
- Mass-generating files / interacting with the file system are not available.
- Combining/piping commands, such as `dbt run -s (bash command)`, is not available.

### dbt Cloud CLI
The dbt Cloud CLI allows you to run dbt [commands](/reference/dbt-commands#available-commands) against your dbt Cloud development environment from your local command line. For users who seek full control over their development environment and ideal for those comfortable with the command line.

When moving from dbt Core to dbt Cloud, make sure you check the `.gitignore` file contains the [necessary folders](/docs/collaborate/git/version-control-basics#the-gitignore-file). dbt Core doesn't interact with git so dbt Cloud doesn't automatically add or verify entries in the `.gitignore` file. Additionally, if the repository already contains dbt code and doesn't require initialization, dbt Cloud won't add any missing entries to the `.gitignore file`.

**Who might prefer the dbt Cloud CLI?**

- Data practitioners accustomed to working with a specific set of development tooling.
- Users looking for granular control over their Git workflows (such as pre-commits for automated checks before committing code).
- Data practitioners who need to perform complex operations, like mass file generation or specific command combinations.

**Key features**

- Allows users to run dbt commands against their dbt Cloud development environment from their local command line with minimal configuration.
- Allows users to natively [defer to production](/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cloud-cli) metadata directly in their development workflows, reducing the number of objects.
- Support running multiple dbt commands at the same time through [safe parallel execution](/reference/dbt-commands#parallel-execution), a [feature](/docs/cloud/about-cloud/dbt-cloud-features) available in dbt Cloud's infrastructure. In contrast, `dbt-core` *doesn't support* safe parallel execution for multiple invocations in the same process.
- Able to use Visual Studio (VS) Code extensions (such as [dbt-power-user](https://marketplace.visualstudio.com/items?itemName=innoverio.vscode-dbt-power-user) to enhance the development experience by adding extra functionalities.

## Orchestration

dbt Cloud provides robust orchestration that enables you to schedule, run, and monitor dbt jobs with ease. Here are some tips and caveats to consider when using dbt Cloud's orchestration features:

### Tips

- Enable [partial parsing](/docs/cloud/account-settings#partial-parsing) between jobs in dbt Cloud to significantly speed up project parsing by only processing changed files, optimizing performance for large projects.
- [Run multiple CI/CD](/docs/deploy/continuous-integration) jobs at the same time which will not block production runs. The Job scheduler automatically cancels stale runs  when a newer commit is pushed. This is because each PR will run in its own schema.
- dbt Cloud automatically [cancels](/docs/deploy/job-scheduler#run-cancellation-for-over-scheduled-jobs) a scheduled run if the existing run is still executing. This prevents unnecessary, duplicative executions.
- Protect you and your data freshness from third-party outages by enabling dbt Cloud’s [Git repository caching](/docs/cloud/account-settings#git-repository-caching), which keeps a cache of the project's Git repository. <Lifecycle status="enterprise"/>
- [Link deploy jobs](/docs/deploy/deploy-jobs#trigger-on-job-completion) across dbt Cloud projects by configuring your job or using the [Create Job API](/dbt-cloud/api-v2#/operations/Create%20Job) to do this. <Lifecycle status="team,enterprise"/>
- [Rerun your jobs](/docs/deploy/retry-jobs) from the start or the point of failure if your dbt job run completed with a status of **`Error.`**

### Caveats
- To automate the setup and configuration of your dbt Cloud platform, you can store your job configurations as code within a repository:
  - Check out our [Terraform provider.](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/resources/job)
  - Alternatively, check out our [jobs-as-code](https://github.com/dbt-labs/dbt-jobs-as-code) repository, which is a tool built to handle dbt Cloud jobs as a well-defined YAML file.
- dbt Cloud users and external emails can receive notifications if a job fails, succeeds, or is cancelled. To get notifications for warnings, you can create a [webhook subscription](/guides/zapier-slack) and post to Slack.

## dbt Mesh

[dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) helps organizations with mature, complex transformation workflows in dbt increase the flexibility and performance of their dbt projects. It allows you to make use of multiple interconnected dbt projects instead of a single large, monolithic project.

It enables you to interface and navigate between different projects and models with [cross-project dependencies](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref), enhancing collaboration and data governance.

Here are some tips and caveats to consider when using dbt Mesh:

### Tips
- To dynamically resolve [cross-project references](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref), all developers need to develop with dbt Cloud (either with the dbt Cloud CLI or dbt Cloud IDE). Cross-project references aren't natively supported in dbt Core, except by installing the source code from upstream projects [as packages](/docs/build/packages#how-do-i-add-a-package-to-my-project)
- Link models across projects for a modular and scalable approach for your project and teams.
- Manage access to your dbt models both within and across projects using:
  - **[Groups](/docs/collaborate/govern/model-access#groups)** &mdash; Organize nodes in your dbt DAG that share a logical connection and assign an owner to the entire group.
  - **[Model access](/docs/collaborate/govern/model-access#access-modifiers)** &mdash; Control which other models or projects can reference this model.
  - **[Model versions](/docs/collaborate/govern/model-versions)** &mdash; Enable adoption and deprecation of models as they evolve.
  - **[Model contracts](/docs/collaborate/govern/model-contracts)** &mdash; Set clear expectations on the shape of the data to ensure data changes upstream of dbt or within a project's logic don't break downstream consumers' data products.
- Use [dbt-meshify](https://github.com/dbt-labs/dbt-meshify) to accelerate splitting apart your monolith into multiple projects.

### Caveats
- To use cross-project references in dbt, each dbt project must correspond to just one dbt Cloud project. We strongly discourage defining multiple projects for the same codebase, even if you're trying to manage access permissions, connect to different data warehouses, or separate production and non-production data.  While this was required historically, features like [Staging environments](/docs/dbt-cloud-environments#types-of-environments), Environment-level RBAC (_coming soon_), and [Extended attributes](/docs/dbt-cloud-environments#extended-attributes) will make it unnecessary.
- Project dependencies are uni-directional, meaning they go in one direction. This means dbt checks for cycles across projects (circular dependencies) and raise errors if any are detected. However, we are considering support to allow projects to depend on each other in both directions in the future, with dbt still checking for node-level cycles while allowing cycles at the project level.
- Everyone in the account can view public model metadata, which helps users find data products more easily. This is separate from who can access the actual data, which is controlled by permissions in the data warehouse. For use cases where even metadata about a reusable data asset is sensitive, we are [considering](https://github.com/dbt-labs/dbt-core/issues/9340) an optional extension of protected models.

Refer to the [dbt Mesh FAQs](/best-practices/how-we-mesh/mesh-5-faqs) for more questions.

## dbt Semantic Layer

Leverage the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), powered by MetricFlow, to create a unified view of your business metrics, ensuring consistency across all analytics tools. Here are some tips and caveats to consider when using dbt Semantic Layer:

### Tips
- Define semantic models and metrics once in dbt Cloud with the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) (powered by MetricFlow). Reuse them across various analytics platforms, reducing redundancy and errors.
- Use the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to query metrics in downstream tools for consistent, reliable data metrics.
- Connect to several data applications, from business intelligence tools to notebooks, spreadsheets, data catalogs, and more, to query your metrics. [Available integrations](/docs/cloud-integrations/avail-sl-integrations) include Tableau, Google Sheets, Hex, and more.
- Use [exports](/docs/use-dbt-semantic-layer/exports) to write commonly used queries directly within your data platform, on a schedule.

### Caveats
- dbt Semantic Layer currently supports the Deployment environment for querying. Development querying experience coming soon.
- Run queries/semantic layer commands in the dbt Cloud CLI, however running queries/semantic layer commands in the dbt Cloud IDE isn’t supported *yet.*
- dbt Semantic Layer doesn't yet support SSH tunneling for [Postgres or Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) connections. It also doesn't support using [Single sign-on (SSO)](/docs/cloud/manage-access/sso-overview) for Semantic Layer [production credentials](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens), however, SSO is supported for development user accounts.

Refer to the [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs) for more information.

## dbt Explorer

[dbt Explorer](/docs/collaborate/explore-projects) enhances your ability to discover, understand, and troubleshoot your data assets through rich metadata and lineage visualization. Here are some tips and caveats to consider when using dbt Explorer:

### Tips
- Use the search and filter capabilities in dbt Explorer to quickly locate models, sources, and tests, streamlining your workflow.
- View all the [different projects](/docs/collaborate/explore-multiple-projects) and public models in the account, where the public models are defined, and how they are used to gain a better understanding of your cross-project resources.
- Use the [Lenses](/docs/collaborate/explore-projects#lenses) feature, which are map-like layers for your DAG, available from your project's lineage graph. Lenses help you further understand your project’s contextual metadata at scale, especially to distinguish a particular model or a subset of models.
- Access column-level lineage (CLL) for the resources in your dbt project. <Lifecycle status="enterprise"/>

### Caveats
- There must be at least one successful job run in the production deployment environment for Explorer to populate information. 

Familiarize yourself with dbt Explorer’s features to fully leverage its capabilities to avoid missed opportunities for efficiency gains.

Refer to the [dbt Explorer FAQs](/docs/collaborate/dbt-explorer-faqs) for more information.

## What's next?

<ConfettiTrigger>

Congratulations on making it through the guide 🎉!

We hope you’re equipped with useful insights and tips to help you with your move. Something to note is that moving from dbt Core to dbt Cloud isn’t just about evolving your data projects, it's about exploring new levels of collaboration, governance, efficiency, and innovation within your team.

For the next steps, continue exploring our 3-part-guide series on moving from dbt Core to dbt Cloud:

<CoretoCloudTable/>

</ConfettiTrigger>

### Resources

If you need any additional help or have some questions, use the following resources:

- [dbt Learn courses](https://learn.getdbt.com) for on-demand video learning.
- Our [Support team](https://docs.getdbt.com/docs/dbt-support) is always available to help you troubleshoot your dbt Cloud issues.
- Join the [dbt Community](https://community.getdbt.com/) to connect with other dbt users, ask questions, and share best practices.
- Subscribe to the [dbt Cloud RSS alerts](https://status.getdbt.com/)
- Enterprise accounts have an account management team available to help troubleshoot solutions and account management assistance. [Book a demo](https://www.getdbt.com/contact) to learn more.
- [How dbt Cloud compares with dbt Core](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud) for a detailed comparison of dbt Core and dbt Cloud.

For tailored assistance, you can use the following resources:

- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and move.
