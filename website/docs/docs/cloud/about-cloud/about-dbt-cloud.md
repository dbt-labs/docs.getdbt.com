---
title: "dbt Cloud features"
id: "dbt-cloud-features"
sidebar_label: "dbt Cloud features"
description: "Explore dbt Cloud's features and learn why dbt Cloud is the fastest way to deploy dbt"
hide_table_of_contents: true
pagination_next: "docs/cloud/about-cloud/architecture"
pagination_prev: null
---

dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, schedule, document, and investigate data models all in one browser-based UI. 

In addition to providing a hosted architecture for running dbt across your organization, dbt Cloud comes equipped with turnkey support for scheduling jobs, CI/CD, hosting documentation, monitoring and alerting, an integrated development environment (IDE), and allows you to develop and run dbt commands from your local command line interface (CLI) or code editor.

dbt Cloud's [flexible plans](https://www.getdbt.com/pricing/) and features make it well-suited for data teams of any size &mdash; sign up for your [free 14-day trial](https://www.getdbt.com/signup/)! 

<div className="grid--3-col">

<Card
    title="dbt Cloud CLI"
    body="Use the dbt Cloud CLI to develop, test, run, and version control dbt projects and commands in your dbt Cloud development environment. Collaborate with team members, directly from the command line."
    link="/docs/cloud/cloud-cli-installation"
    icon="dbt-bit"/>

<Card
    title="dbt Cloud IDE"
    body="The IDE is the easiest and most efficient way to develop dbt models, allowing you to build, test, run, and version control your dbt projects directly from your browser. Use dbt Copilot, a powerful AI engine that automatically generates documentation, tests, and semantic models."
    link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud"
    icon="dbt-bit"/>

<Card
    title="Visual editor (beta)"
    body="Develop with the visual editor, a seamless drag-and-drop experience that helps analysts quickly create and visualize dbt models in dbt Cloud."
    link="/docs/cloud/visual-editor"
    icon="dbt-bit"/>

<Card
    title="Manage environments"
    body="Set up and manage separate production and development environments in dbt Cloud to help engineers develop and test code more efficiently, without impacting users or data."
    link="/docs/environments-in-dbt"
    icon="dbt-bit"/>

  <Card
    title="Schedule and run dbt jobs"
    body="Create custom schedules to run your production jobs. Schedule jobs by day of the week, time of day, or a recurring interval. Decrease operating costs by using webhooks to trigger CI jobs and the API to start jobs."
    link="/docs/deploy/job-scheduler"
    icon="dbt-bit"/>

  <Card
    title="Notifications"
    body="Set up and customize job notifications in dbt Cloud to receive email or slack alerts when a job run succeeds, fails, or is cancelled. Notifications alert the right people when something goes wrong instead of waiting for a user to report it."
    link="/docs/deploy/job-notifications"
    icon="dbt-bit"/>

  <Card
    title="Run visibility"
    body="View the history of your runs and the model timing dashboard to help identify where improvements can be made to the scheduled jobs."
    link="/docs/deploy/run-visibility"
    icon="dbt-bit"/>
    
   <Card
    title="Host & share documentation"
    body="dbt Cloud hosts and authorizes access to dbt project documentation, allowing you to generate data documentation on a schedule for your project. Invite teammates to dbt Cloud to collaborate and share your project's documentation."
    link="/docs/collaborate/build-and-view-your-docs"
    icon="dbt-bit"/>

   <Card
    title="Supports GitHub, GitLab, AzureDevOps"
    body="Seamlessly connect your git account to dbt Cloud and provide another layer of security to dbt Cloud. Import new repositories, trigger continuous integration, clone repos using HTTPS, and more!"
    link="/docs/cloud/git/connect-github"
    icon="dbt-bit"/>

   <Card
    title="Enable Continuous Integration"
    body="Configure dbt Cloud to run your dbt projects in a temporary schema when new commits are pushed to open pull requests. This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool in any analyst's belt."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

   <Card
    title="Security"
    body="Manage risk with SOC-2 compliance, CI/CD deployment, RBAC, and ELT architecture."
    link="https://www.getdbt.com/security/"
    icon="dbt-bit"/>

   <Card
    title="dbt Semantic Layer*"
    body="Use the dbt Semantic Layer to define metrics alongside your dbt models and query them from any integrated analytics tool. Get the same answers everywhere, every time."
    link="/docs/use-dbt-semantic-layer/dbt-sl"
    icon="dbt-bit"/>

   <Card
    title="Discovery API*"
    body="Enhance your workflow and run ad-hoc queries, browse schema, or query the dbt Semantic Layer. dbt Cloud serves a GraphQL API, which supports arbitrary queries."
    link="/docs/dbt-cloud-apis/discovery-api"
    icon="dbt-bit"/>

  <Card
    title="dbt Explorer*"
    body="Learn about dbt Explorer and how to interact with it to understand, improve, and leverage your data pipelines."
    link="/docs/collaborate/explore-projects"
    icon="dbt-bit"/>
</div> <br />

*These features are available on [selected plans](https://www.getdbt.com/pricing/).
## Related docs

- [dbt Cloud plans and pricing](https://www.getdbt.com/pricing/)
- [Quickstart guides](/docs/get-started-dbt)
- [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)

