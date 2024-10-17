---
title: 'Move from dbt Core to dbt Cloud: What you need to know'
id: core-cloud-2
description: "Use this guide to understand the considerations and methods you need to move from dbt Core to dbt Cloud."
hoverSnippet: "Use this guide to understand the considerations and methods you need to move from dbt Core to dbt Cloud."
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

<Expandable alt_header="What is dbt Cloud and dbt Core?">

   - dbt Cloud is the fastest and most reliable way to deploy dbt. It enables you to develop, test, deploy, and explore data products using a single, fully managed service. It also supports:
     - Development experiences tailored to multiple personas ([dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [dbt Cloud CLI](/docs/cloud/cloud-cli-installation))
     - Out-of-the-box [CI/CD workflows](/docs/deploy/ci-jobs)
     - The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) for consistent metrics
     - Domain ownership of data with multi-project [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) setups
     - [dbt Explorer](/docs/collaborate/explore-projects) for easier data discovery and understanding

   Learn more about [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features).
- dbt Core is an open-source tool that enables data teams to define and execute data transformations in a cloud data warehouse following analytics engineering best practices. While this can work well for ‘single players’ and small technical teams, all development happens on a command-line interface, and production deployments must be self-hosted and maintained. This requires significant, costly work that adds up over time to maintain and scale.

</Expandable>

## What you'll learn
Today thousands of companies, with data teams ranging in size from 2 to 2,000, rely on dbt Cloud to accelerate data work, increase collaboration, and win the trust of the business. Understanding what you'll need to do in order to move between dbt Cloud and your current Core deployment will help you strategize and plan for your move.

The guide outlines the following steps:

- [Considerations](https://docs.getdbt.com/guides/core-cloud-2?step=3): Learn about the most important things you need to think about when moving from Core to Cloud.
- [Plan your move](https://docs.getdbt.com/guides/core-cloud-2?step=4): Considerations you need to make, such as user roles and permissions, onboarding order, current workflows, and more.
- [Move to dbt Cloud](https://docs.getdbt.com/guides/core-cloud-2?step=5): Review the steps to move your dbt Core project to dbt Cloud, including setting up your account, data platform, and Git repository.
- [Test and validate](https://docs.getdbt.com/guides/core-cloud-2?step=6): Discover how to ensure model accuracy and performance post-move.
- [Transition and training](https://docs.getdbt.com/guides/core-cloud-2?step=7): Learn how to fully transition to dbt Cloud and what training and support you may need. 
- [Summary](https://docs.getdbt.com//guides/core-cloud-2?step=8): Summarizes key takeaways and what you've learned in this guide.
- [What's next?](https://docs.getdbt.com/guides/core-cloud-2?step=9): Introduces what to expect in the following guides.

## Considerations

If your team is using dbt Core today, you could be reading this guide because:
- You’ve realized the burden of maintaining that deployment.
- The person who set it up has since left.
- You’re interested in what dbt Cloud could do to better manage the complexity of your dbt deployment, democratize access to more contributors, or improve security and governance practices.

This guide shares the technical adjustments and team collaboration strategies you’ll need to know to move your project from dbt Core to dbt Cloud.  Each "build your own" deployment of dbt Core will look a little different, but after seeing hundreds of teams make the migration, there are many things in common.

The most important things you need to think about when moving from dbt Core to dbt Cloud:

- How is your team structured? Are there natural divisions of domain?
- Should you have one project or multiple? Which dbt resources do you want to standardize & keep central?
- Who should have permission to view, develop, and administer?
- How are you scheduling your dbt models to run in production?
- How are you currently managing Continuous integration/Continuous deployment (CI/CD) of logical changes (if at all)?
- How do your data developers prefer to work?
- How do you manage different data environments and the different behaviors in those environments?

dbt Cloud provides standard mechanisms for tackling these considerations, all of which deliver long-term benefits to your organization:
- Cross-team collaboration
- Access control
- Orchestration
- Isolated data environments

If you have rolled out your own dbt Core deployment, you have probably come up with different answers.

## Plan your move

As you plan your move, consider your workflow and team layout to ensure a smooth transition. Here are some key considerations to keep in mind:

<Expandable alt_header="Start small to minimize risk and maximize learning">

You don’t need to move every team and every developer’s workflow all at once. Many customers with large dbt deployments start by moving one team and one project.

Once the benefits of a consolidated platform are clear, move the rest of your teams and workflows. While long-term ‘hybrid’ deployments can be challenging, it may make sense as a temporary on-ramp.
</Expandable>

<Expandable alt_header="User roles and responsibilities"> 

Assess the users or personas involved in the pre-move, during the move, and post-move.
- **Administrators**: Plan for new [access controls](/docs/cloud/manage-access/about-user-access) in dbt Cloud, such as deciding what teams can manage themselves and what should be standardized. Determine who will be responsible for setting up and maintaining projects, data platform connections, and environments.
- **Data developers** (data analysts, data engineers, analytics engineers, business analysts): Determine onboarding order, workflow adaptation in dbt Cloud, training on [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) usage, and role changes.
- **Data consumers:** Discover data insights by using [dbt Explorer](/docs/collaborate/explore-projects) to view your project's resources (such as models, tests, and metrics) and their lineage to gain a better understanding of its latest production state. <Lifecycle status="team,enterprise" />

</Expandable>

<Expandable alt_header="Onboarding order"> 

If you have multiple teams of dbt developers, think about how to start your onboarding sequence for dbt Cloud:
- Start with downstream (like business-embedded teams) who may benefit from the dbt Cloud IDE as dev experience (less technical users) and sharing features (like auto-deferral and dbt Explorer) to share with their stakeholders, moving to more technical teams later.
- Consider setting up a [CI job](/docs/deploy/ci-jobs) in dbt Cloud (even before development or production jobs) to streamline development workflows. This is especially beneficial if there's no existing CI process.

</Expandable>

<Expandable alt_header="Analyze current workflows, review processes, and team structures">

Discover how dbt Cloud can help simplify development, orchestration, and testing:
- **Development**: Develop dbt models, allowing you to build, test, run, and version control your dbt projects using the dbt Cloud CLI (command line interface or code editor) or dbt Cloud IDE (browser-based).
- **Orchestration**: Create custom schedules to run your production jobs. Schedule jobs by day of the week, time of day, or a recurring interval.
  - Set up [a CI job](/docs/deploy/ci-jobs) to ensure developer effectiveness, and CD jobs to deploy changes as soon as they’re merged.
  - Link deploy jobs together by [triggering a job](/docs/deploy/deploy-jobs#trigger-on-job-completion) when another one is completed. 
  - For the most flexibility, use the [dbt Cloud API](https://docs.getdbt.com/dbt-cloud/api-v2#/) to trigger jobs. This makes sense when you want to integrate dbt execution with other data workflows.
- **Continuous integration (CI)**: Use [CI jobs](/docs/deploy/ci-jobs) to run your dbt projects in a temporary schema when new commits are pushed to open pull requests. This build-on-PR functionality is a great way to catch bugs before deploying to production.
  - For many teams, dbt Cloud CI represents a major improvement compared to their previous development workflows.
- **How are you defining tests today?**: While testing production data is important, it’s not the most efficient way to catch logical errors introduced by developers You can use [unit testing](/docs/build/unit-tests) to allow you to validate your SQL modeling logic on a small set of static inputs *before* you materialize your full model in production.

</Expandable>

<Expandable alt_header="Understand access control">

Transition to dbt Cloud's [access control](/docs/cloud/manage-access/about-user-access) mechanisms to ensure security and proper access management. dbt Cloud administrators can use dbt Cloud's permission model to control user-level access in a dbt Cloud account:
- **License-based access controls:** Users are configured with account-wide license types. These licenses control the things a user can do within the application: view project metadata, develop changes within those projects, or administer access to those projects.
- **Role-based Access Control (RBAC):** Users are assigned to *groups* with specific permissions on specific projects or all projects in the account. A user may be a member of multiple groups, and those groups may have permissions on multiple projects. <Lifecycle status="enterprise" />

</Expandable>

<Expandable alt_header="Manage environments"> 

If you require isolation between production and pre-production data environments due to sensitive data, dbt Cloud can support Development, Staging, and Production data [environments](/docs/dbt-cloud-environments).

This provides developers with the benefits of an enhanced workflow while ensuring isolation between Staging and Production data, and locking down permissions on Prod.

</Expandable>

## Move to dbt Cloud

This guide is your roadmap to help you think about migration strategies and what moving from dbt Core to dbt Cloud could look like.

After reviewing the considerations and planning your move, you may want to start moving your dbt Core project to dbt Cloud:
- Check out the detailed [Move to dbt Cloud: Get started](/guides/core-to-cloud-1?step=1) guide for useful tasks and insights for a smooth transition from dbt Core to dbt Cloud.

For a more detailed comparison of dbt Core and dbt Cloud, check out [How dbt Cloud compares with dbt Core](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud).

## Test and validate

After [setting the foundations of dbt Cloud](https://docs.getdbt.com/guides/core-to-cloud-1?step=1), it's important to validate your migration to ensure seamless functionality and data integrity:

- **Review your dbt project:** Ensure your project compiles correctly and that you can run commands. Make sure your models are accurate and monitor performance post-move.
- **Start cutover:** You can start the cutover to dbt Cloud by creating a dbt Cloud job with commands that only run a small subset of the DAG. Validate the tables are being populated in the proper database/schemas as expected. Then continue to expand the scope of the job to include more sections of the DAG as you gain confidence in the results.
- **Precision testing:** Use [unit testing](/docs/build/unit-tests) to allow you to validate your SQL modeling logic on a small set of static inputs *before* you materialize your full model in production.
- **Access and permissions**: Review and adjust [access controls and permissions](/docs/cloud/manage-access/about-user-access) within dbt Cloud to maintain security protocols and safeguard your data.

## Transition and training

Once you’ve confirmed that dbt Cloud orchestration and CI/CD are working as expected, you should pause your current orchestration tool and stop or update your current CI/CD process. This is not relevant if you’re still using an external orchestrator (such as Airflow), and you’ve swapped out `dbt-core` execution for dbt Cloud execution (through the [API](/docs/dbt-cloud-apis/overview)).

Familiarize your team with dbt Cloud's [features](/docs/cloud/about-cloud/dbt-cloud-features) and optimize development and deployment processes. Some key features to consider include:
- **Version management:** Manage [dbt versions](/docs/dbt-versions/upgrade-dbt-version-in-cloud) and ensure team collaboration with dbt Cloud's one-click feature, removing the hassle of manual updates and version discrepancies. You can go [**Versionless**](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) to always get the latest features and early access to new functionality for your dbt project.
- **Development tools**: Use the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to build, test, run, and version control your dbt projects.
- **Documentation and Source freshness:**  Automate storage of [documentation](/docs/build/documentation) and track [source freshness](/docs/deploy/source-freshness) in dbt Cloud, which streamlines project maintenance.
- **Notifications and logs:** Receive immediate [notifications](/docs/deploy/monitor-jobs) for job failures, with direct links to the job details. Access comprehensive logs for all job runs to help with troubleshooting.
- **CI/CD:** Use dbt Cloud's [CI/CD](/docs/deploy/ci-jobs) feature to run your dbt projects in a temporary schema whenever new commits are pushed to open pull requests. This helps with catching bugs before deploying to production.

### Beyond your move

Now that you’ve chosen dbt Cloud as your platform, you’ve unlocked the power of streamlining collaboration, enhancing workflow efficiency, and leveraging powerful [features](/docs/cloud/about-cloud/dbt-cloud-features) for analytics engineering teams. Here are some additional features you can use to unlock the full potential of dbt Cloud:

- **Audit logs:** Use [audit logs](/docs/cloud/manage-access/audit-log) to review actions performed by people in your organization. Audit logs contain audited user and system events in real time. You can even [export](/docs/cloud/manage-access/audit-log#exporting-logs) *all* the activity (beyond the 90 days you can view in dbt Cloud). <Lifecycle status="enterprise"/>
- **dbt Cloud APIs:** Use dbt Cloud's robust [APIs](/docs/dbt-cloud-apis/overview) to create, read, update, and delete (CRUD) projects/jobs/environments project. The [dbt Cloud Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) and [Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/resources/job) facilitate programmatic access and configuration storage. While the [Discovery API](/docs/dbt-cloud-apis/discovery-api) offers extensive metadata querying capabilities, such as job data, model configurations, usage, and overall project health. <Lifecycle status="team,enterprise"/>
- **dbt Explorer**: Use [dbt Explorer](/docs/collaborate/explore-projects) to view your project's [resources](/docs/build/projects) (such as models, tests, and metrics) and their [lineage](https://docs.getdbt.com/terms/data-lineage) to gain a better understanding of its latest production state. (Once you have a successful job in a Production environment). <Lifecycle status="team,enterprise"/>
- **dbt Semantic Layer:** The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) allows you to define universal metrics on top of your models that can then be queried in your [business intelligence (BI) tool](/docs/cloud-integrations/avail-sl-integrations). This means no more inconsistent metrics — there’s now a centralized way to define these metrics and create visibility in every component of the data flow. <Lifecycle status="team,enterprise"/>
- **dbt Mesh:** Use [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) to share data models across organizations, enabling data teams to collaborate on shared data models and leverage the work of other teams. <Lifecycle status="enterprise"/>

### Additional help

- **dbt Learn courses**: Access our free [Learn dbt Cloud](https://learn.getdbt.com) video courses for on-demand training.
- **dbt Community:** Join the [dbt Community](https://community.getdbt.com/) to connect with other dbt users, ask questions, and share best practices.
- **dbt Support team:** Our [dbt Support team](/docs/dbt-support) is always available to help you troubleshoot your dbt Cloud issues. Create a support ticket in dbt Cloud and we’ll be happy to help!
- **Account management** Enterprise accounts have an account management team available to help troubleshoot solutions and account management assistance. [Book a demo](https://www.getdbt.com/contact) to learn more. <Lifecycle status="enterprise"/>

## Summary

This guide should now have given you some insight and equipped you with a framework for moving from dbt Core to dbt Cloud. This guide has covered the following key areas:

- **Considerations:** Understanding the foundational steps required for a successful migration, including evaluating your current setup and identifying key considerations unique to your team's structure and workflow needs.

- **Plan you move**: Highlighting the importance of workflow redesign, role-specific responsibilities, and the adoption of new processes to harness dbt Cloud's collaborative and efficient environment.

- **Move to dbt Cloud**: Linking to [the guide](https://docs.getdbt.com/guides/core-to-cloud-1?step=1) that outlines technical steps required to transition your dbt Core project to dbt Cloud, including setting up your account, data platform, and Git repository.

- **Test and validate**: Emphasizing technical transitions, including testing and validating your dbt projects within the dbt Cloud ecosystem to ensure data integrity and performance.

- **Transition and training**: Share useful transition, training, and onboarding information for your team. Fully leverage dbt Cloud's capabilities, from development tools (dbt Cloud CLI and dbt Cloud IDE) to advanced features such as dbt Explorer, the Semantic Layer, and dbt Mesh.

## What’s next?

<ConfettiTrigger>


Congratulations on finishing this guide, we hope it's given you insight into the considerations you need to take to best plan your move to dbt Cloud.

For the next steps, you can continue exploring our 3-part-guide series on moving from dbt Core to dbt Cloud:

<CoretoCloudTable/>

### Related content
- [Learn dbt Cloud](https://learn.getdbt.com) courses
- Book [expert-led demos](https://www.getdbt.com/resources/dbt-cloud-demos-with-experts) and insights
- Work with the [dbt Labs’ Professional Services](https://www.getdbt.com/dbt-labs/services) team to support your data organization and migration.
- [How dbt Cloud compares with dbt Core](https://www.getdbt.com/product/dbt-core-vs-dbt-cloud) for a detailed comparison of dbt Core and dbt Cloud.
- Subscribe to the [dbt Cloud RSS alerts](https://status.getdbt.com/)

</ConfettiTrigger>
