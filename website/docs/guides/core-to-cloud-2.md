---
title: 'Move from dbt Core to dbt Cloud: Everything you need to know'
id: core-to-cloud-2
description: "Use this second guide to understand the considerations and methods you need to move from dbt Core to dbt Cloud."
hoverSnippet: ""Use this second guide to understand the considerations and methods you need to move from dbt Core to dbt Cloud."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration','dbt Core','dbt Cloud']
keywords: ['dbt Core','dbt Cloud','Migration', 'Move dbt', 'Migrate dbt']
level: 'Intermediate'
recently_updated: true
---

Explore our 3-guide series on moving from dbt Core to dbt Cloud:
- Start with Get started for setup information
- Move to Everything you need to know for deep insights
- Conclude with optimization tips.

The series is ideal for intermediate users aiming for streamlined workflows and enhanced analytics. Moving from dbt Core to dbt Cloud streamlines analytics engineering workflows by allowing teams to develop, test, deploy, and explore data products using a single, fully managed platform.

## Introduction

Your team has a custom deployment of dbt Core today.

You could be reading this guide because you’ve realized the burden of maintaining that deployment, because the person who set it up has since left, or because you’re interested in what dbt Cloud could do to standardize your deployment and consolidate some of the toolings that you may already have in place — enabling you to streamline collaboration, enhance workflow efficiency, and leverage powerful features for analytics engineering teams.  

This guide shares the technical adjustments and team collaboration strategies you’ll need to know to move your project from dbt Core to dbt Cloud.  Each “BYO” (build your own) deployment of dbt Core will look a little different, but after seeing hundreds of teams make the migration, there are many things in common.

Migrating from dbt Core to dbt Cloud can yield significant benefits, and a standard way of working. Understanding the differences between dbt Cloud and your current Core deployment will help you strategize and plan for your move.

dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, deploy, and explore data products using a single, fully managed service. It also supports:
- [Development experiences](/docs/cloud/about-develop-dbt) tailored to multiple personas
- Out-of-the-box CI/CD workflows
- A Semantic Layer for consistent metrics
- Domain-level ownership of data with multi-project [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) setups
Learn more about [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features).

dbt Core is an open-source tool that enables data teams to define and execute data transformations in a cloud data warehouse following analytics engineering best practices. While this can work well for ‘single players’ and small technical teams, all development happens on a command-line interface, and production deployments must be self-hosted and maintained. This requires significant, costly work that adds up over time to maintain and scale.

### What you'll learn

This guide outlines the considerations and information you'll need to understand, plan, or strategize moving from dbt Core to dbt Cloud:

- [Considerations](https://docs.getdbt.com/guides/core-to-cloud-1?step=3#account-setup): Learn about the most important things you need to think about when moving from Core to Cloud.
- [Plan your move](https://docs.getdbt.com/guides/core-to-cloud-1?step=4#data-platform-setup): How to plan your move and what considerations you need to make, such as user roles and permissions, onboarding order, current workflows, and more.
- [Move to dbt Cloud](https://docs.getdbt.com/guides/core-to-cloud-1?step=5#git-setup): Review the steps to move your dbt Core project to dbt Cloud, including setting up your account, data platform, and Git repository.
- [Test and validation](https://docs.getdbt.com/guides/core-to-cloud-1?step=6#developer-setup): Discover how to ensure model accuracy and performance post-move,.
- [Environment variables](https://docs.getdbt.com/guides/core-to-cloud-1?step=7#environment-variables): Discover how to manage environment variables in dbt Cloud, including their priority.
- [Transition and training](https://docs.getdbt.com/guides/core-to-cloud-1?step=8#orchestration-setup): Learn how to fully transition to dbt Cloud and what training and support you may need. 
- [Beyond your move](https://docs.getdbt.com/guides/core-to-cloud-1?step=9#models-configuration): Get insights on additional features you can use to unlock the full potential of dbt Cloud.
- [Summary] : Summarizes key takeaways and introduces what to expect in the following guides.
- [What's next?](https://docs.getdbt.com/guides/core-to-cloud-1?step=10#whats-next): Summarizes key takeaways and introduces what to expect in the following guides.

### Related docs
- [Move from dbt Core to dbt Cloud: Get started](/guides/core-to-cloud-1?step=1)
- [Learn dbt Cloud](https://courses.getdbt.com/collections)
- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.

## Considerations

The most important things you need to think about when moving from dbt Core to dbt Cloud:

- How is your team structured? Are there natural divisions of domain?
- Should you have one project or multiple? Which dbt resources do you want to standardize & keep central?
- Who should have permissions to view, develop, administer?
- How are you scheduling your dbt models to run in production?
- How are you currently managing CI/CD of logical changes (if at all)?
- How do your data developers prefer to work?
- How do you manage different data environments, and different behaviors in those environments?

dbt Cloud provides standard mechanisms for tackling the considerations above: cross-team collaboration, access control, orchestration, isolated data environments. which delivers long-term benefits to your organization. If you have rolled your own dbt Core deployment, you have probably come up with different answers.

## Plan your move
As you plan your move, consider your workflow and team layout:

- **Start small**: You don’t need to move every team and every developer’s workflow all at once. Many customers with large ‘BYO’ (build your own) dbt deployments start by moving one team and one project. Once they see the benefits of a consolidated platform, they move the rest of their teams and workflows. While long-term ‘hybrid’ deployments can be challenging, it may make sense as a temporary on-ramp.
- **User roles and responsibilities:** Assess the users or personas involved in the pre-move, during the move, and post-move.
    - **Administrators**: Plan for new access controls in dbt Cloud, such as deciding what teams can manage themselves and what should be standardized. Determine who will be responsible for setting up and maintaining projects, data platform connections, and environments.
    - **Data developers** (Data analysts, Data engineers, Analytics engineers, Business analysts): Determine onboarding order, workflow adaptation in dbt Cloud, training on dbt Cloud CLI or dbt Cloud IDE usage, and role changes.
    - **Data consumers:** Discover data insights by using [dbt Explorer](/docs/collaborate/explore-projects) to view your project's resources (such as models, tests, and metrics) and their lineage to gain a better understanding of its latest production state. <Lifecycle status="team,enterprise" />
- **Onboarding order:** If you have multiple teams of dbt developers, think about how to start your onboarding sequence for dbt Cloud.
    - Start with downstream (like business-embedded teams) who may benefit from the dbt Cloud IDE as dev experience (less technical users) and sharing features (like Auto-deferral and dbt Explorer) to share with their stakeholders, moving to more technical teams later.
    - Consider setting up Continuous integration (CI) in dbt Cloud (even before development or production jobs) to streamline development workflows. This is especially beneficial if there's no existing CI process.
- **Analyze current workflows, review processes, and team structures:** ~~Analyze existing workflows and~~ Discover how dbt Cloud can help simplify development, orchestration, and testing ~~processes through its intuitive UI integrations.~~
    - Development: Develop dbt models, allowing you to build, test, run, and version control your dbt projects using the dbt Cloud CLI (command line interface or code editor) or dbt Cloud IDE (browser-based).
    - Orchestration: Create custom schedules to run your production jobs. Schedule jobs by day of the week, time of day, or a recurring interval. Set up CI to ensure developer effectiveness, and CD jobs to deploy changes as soon as they’re merged. Link deploy jobs together by [triggering a job](/docs/deploy/deploy-jobs#trigger-on-job-completion) when another one is completed. For the most flexibility, you can use the `API` to trigger jobs. This makes sense when you want to integrate dbt execution with other data workflows.
    - Continuous integration (CI): Run your dbt projects in a temporary schema when new commits are pushed to open pull requests. This build-on-PR functionality is a great way to catch bugs before deploying to production.
        - For many teams, dbt Cloud CI represents a major improvement compared to their previous development workflows.
        - How are you defining tests today? While testing production data is important, it’s not the most efficient way to catch logical errors introduced by developers You can use [unit testing](/docs/build/unit-tests) to allow you to validate your SQL modeling logic on a small set of static inputs *before* you materialize your full model in production.
- **Understand access controls**: Transition to dbt Cloud's [access control](/docs/cloud/manage-access/about-user-access) mechanisms to ensure security and proper access management. dbt Cloud administrators can use dbt Cloud's permission model to control user-level access in a dbt Cloud account:
    - **License-based access controls:** Users are configured with account-wide license types. These licenses control the things a user can do within the application: view project metadata, develop changes within those projects, or administer access to those projects.
    - **Role-based Access Control (RBAC):** Users are assigned to *groups* that have specific permissions on specific projects or all projects in the account. A user may be a member of multiple groups, and those groups may have permissions on multiple projects.
- **Manage environments**: If you require isolation between production and non-production data environments due to sensitive data, dbt Cloud can support Development, Staging (_soon_), and Production data environments. This provides developers with the benefits of an enhanced workflow while ensuring isolation between Staging and Production data, and locking down permissions on Prod.

## Move to dbt Cloud

- [Review the Switch to dbt Cloud: Get started](/guides/core-to-cloud-1?step=1) guide for detailed steps on the actual tasks you need to do to move your dbt Core project to dbt Cloud.

## Test and validate

- Ensure model accuracy and performance post-move. You can start the cutover to dbt Cloud by creating a dbt Cloud job with commands that only run a small subset of the DAG. Validate the tables are being populated in the proper database/schemas as expected. Then continue to expand the scope of the job to include more sections of the DAG as you gain confidence in the results.
- Use [unit testing](/docs/build/unit-tests) to allow you to validate your SQL modeling logic on a small set of static inputs *before* you materialize your full model in production.
- Validating permissions and access controls.

## Transition and training

Once you’ve confirmed that dbt Cloud orchestration and CI/CD are working as expected, you should pause your current orchestration tool and stop or update your current CI/CD process. This is not relevant if you’re still using an external orchestrator (such as Airflow), and you’ve swapped out dbt-core execution for dbt Cloud execution (through the [API](/docs/dbt-cloud-apis/overview)).
- Familiarize your team with dbt Cloud's [features](/docs/cloud/about-cloud/dbt-cloud-features) and optimize development and deployment processes.

<expandable alt_header="dbt Cloud features in more detail">

- Manage [dbt versions](/docs/dbt-versions/upgrade-dbt-version-in-cloud) and ensure team synchronization with dbt Cloud's one-click feature, eliminating the hassle of manual updates and version discrepancies. You can also **[Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version)** to always get the latest fixes and early access to new functionality for your dbt project.
- Documentation is stored without any configuration needed with [dbt Explorer](/docs/collaborate/explore-projects) (once you have a successful job in a Production environment).
- Source Freshness is stored without any configuration needed.
  - Something went wrong? You can be notified immediately that your job failed, with a direct link to the job run details.
  - *All* the logs for *every* job run are stored, and easily accessible for troubleshooting and discovery.
- [Audit logs](/docs/cloud/manage-access/audit-log)
  - You can review actions performed by people in your organization with audit logs, which contain audited user and system events in real time. You can even export *all* the activity (beyond the 90 days you can view in dbt Cloud).
- Powerful API to Create, Read, Update, and Delete (CRUD) projects/jobs/environments
  - You can use the [Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) allows you to programmatically access your account, projects, jobs, and environments to get logs or make changes.
  - To store your job configurations as code within a repository, you can check out our [Terraform provider.](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/resources/job)
- [Discovery API](/docs/dbt-cloud-apis/discovery-api)
  - With the metadata available in GraphQL, you can query your job data, model configurations, usage, and overall project health.
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
  - The dbt Semantic Layer allows you to define universal metrics on top of your models, that can subsequently be queried in your BI layer. This means no more inconsistent metrics — there’s now a centralized way to define these metrics and create visibility in every component of the data flow.
- Solutions engineers available for troubleshooting. Our support team is always available to help you troubleshoot your dbt Cloud issues. Create a support ticket in dbt Cloud and we’ll be happy to help!
- Account management help for you and your team. You have Solutions Architect available to help you troubleshoot solutions.
</expandable>

## Beyond your move

Now that you’ve chosen dbt Cloud as your platform, you’ve unlocked the power of streamlining collaboration, enhancing workflow efficiency, and leveraging powerful features for analytics engineering teams. 

- Use dbt Cloud’s [advanced monitoring](/docs/deploy/monitor-jobs):  alerts, and reporting features for optimized project performance.
- Implement the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) for consistent, centralized metric definitions.
- Use [dbt Explorer](/docs/collaborate/explore-projects) to view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their [lineage](https://docs.getdbt.com/terms/data-lineage) to gain a better understanding of its latest production state. To enable further collaboration:
  - Use the Discovery API to extract metadata to a data catalog or
  - Provide users with Read-Only seats on the account.

## Summary

As you read from this guide, moving to dbt Cloud represents a strategic shift towards more efficient and collaborative data project management. This guide lays out a roadmap for a smooth move, helping you understand what shifts you and your team will need to consider, technical adjustments to consider, and workflows for various team roles. 

So far, we covered the following on this page:

- **Workflow redesign**: Navigate through the transition with a focus on redefining workflows. This involves detailed planning for administrators, knowledge builders, and consumers to adapt to dbt Cloud's environment.
  - **User roles and responsibilities**: Tailor the migration experience to fit the unique structure of your team, ensuring that each member, from data engineers to business analysts, understands their new tools and processes.
- **Technical transition**: From assessing project sizes to implementing dbt Cloud’s advanced access controls, the transition process involves careful consideration of your current and future technical landscapes.
- **Testing and validation**: Incrementally test your job runs to validate the tables in your database/schema.
  - Review your dbt project in your [development tool](/docs/cloud/about-develop-dbt) of choice to ensure your project is set up correctly and you can run commands:
    - Make sure your project compiles correctly.
    - Run a few models in the dbt Cloud IDE or dbt Cloud CLI to ensure you’re experiencing accurate results in development.
- **Training and onboarding**: Equip your team with the knowledge and skills to leverage dbt Cloud through self-guided learning or training sessions.
- **Advanced configurations:** Learn about [advanced monitoring tools](/docs/deploy/monitor-jobs) or new features like the [dbt Explorer](docs/collaborate/explore-projects), [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), and [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro).

## What’s next?

<ConfettiTrigger>

Congratulations on completing this guide, we hope it's given you insight into the considerations you need to take to best plan your move to dbt Cloud.

- Review the next guide in this series to learn about the technical steps you need to take to move from dbt Core to dbt Cloud.
 - [Move to dbt Cloud: Get started](/guides/core-to-cloud-1?step=1)
- Link to the next guide (tips and faqs)

### Related docs
- [Learn dbt Cloud](https://courses.getdbt.com/collections)
- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.

</ConfettiTrigger>
