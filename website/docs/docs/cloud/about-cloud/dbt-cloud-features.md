---
title: "dbt Cloud features"
id: "dbt-cloud-features"
---

dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, schedule, document, and investigate data models all in one web-based UI. 

In addition to providing a hosted architecture for running dbt Core across your organization, dbt Cloud comes equipped with turnkey support for scheduling jobs, CI/CD, hosting documentation, monitoring & alerting, and an integrated developer environment (IDE).

dbt Cloud's [flexible plans](https://www.getdbt.com/pricing/) and features make it well-suited for data teams of any size &mdash; sign up for your [free 14 day trial](https://www.getdbt.com/signup/)! <br></br>


<div className="grid--2-col">


<Card
    title="dbt Cloud IDE"
    body="The IDE is the easiest and most efficient way to develop dbt models, allowing you to build, test, run, and version control your dbt projects directly from your browser."
link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud"
    icon="pencil-paper"/>

<Card
    title="Manage environments"
    body="Set up and manage separate production and development environments in dbt Cloud to help engineers develop and test code more efficiently, without impacting users or data."
    link="/docs/collaborate/environments/environments-in-dbt"
    icon="pencil-paper"/>

  <Card
    title="Schedule and run dbt jobs"
    body="Create custom schedules to run your production jobs. Schedule jobs by day of the week, time of day, or a recurring interval. Decrease operating costs by using webhooks to trigger CI jobs and the API to start jobs."
    link="/docs/deploy/dbt-cloud-job"
    icon="pencil-paper"/>

  <Card
    title="Notifications"
    body="Set up and customize job notifications in dbt Cloud to receive email or slack alerts when a job run succeeds, fails, or is cancelled. Notifications alert the right people when something goes wrong instead of waiting for a user to report it."
    link="/docs/deploy/job-notifications"
    icon="pencil-paper"/>    
    
   <Card
    title="Host & share documentation"
    body="dbt Cloud hosts and authorizes access to dbt project documentation, allowing you to generate data documentation on a schedule for your project. Invite teammates to dbt Cloud to collaborate and share your project's documentation."
    link="/docs/collaborate/build-and-view-your-docs"
    icon="pencil-paper"/>    

   <Card
    title="Democratize access to logs"
    body="View and download in-progress and historical logs for your dbt runs, making it easy for anyone on the team to debug errors more efficiently."
    link="/docs/deploy/dbt-cloud-job#access-logs"
    icon="pencil-paper"/>      

   <Card
    title="Supports GitHub, GitLab, AzureDevOPs"
    body="Seamlessly connect your git account to dbt Cloud and provide another layer of security to dbt Cloud. Import new repositories, trigger continuous integration, clone repos using HTTPS, and more!"
    link="/docs/cloud/git/connect-github"
    icon="pencil-paper"/>  

   <Card
    title="Enable Continuous Integration"
    body="Configure dbt Cloud to run your dbt projects in a temporary schema when new commits are pushed to open pull requests. This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool in any analyst's belt."
    link="/docs/deploy/cloud-ci-job"
    icon="pencil-paper"/>  

   <Card
    title="Security"
    body="Manage risk with SOC-2 compliance, CI/CD deployment, RBAC, and ELT architecture."
    link="https://www.getdbt.com/security/"
    icon="pencil-paper"/>  

   <Card
    title="dbt Semantic Layer*"
    body="Use the dbt Semantic Layer to define metrics alongside your dbt models and query them from any integrated analytics tool. Get the same answers everywhere, every time."
    link="/docs/use-dbt-semantic-layer/dbt-semantic-layer"
    icon="pencil-paper"/>  

   <Card
    title="Metadata API*"
    body="Enhance your workflow and run ad-hoc queries, browse schema, or query the dbt Semantic Layer. dbt Cloud serves a GraphQL API, which supports arbitrary queries."
    link="/docs/dbt-cloud-apis/metadata-api"
    icon="pencil-paper"/> 


<Card
    title="Model timing dashboard*"
    body="Visualize and explore your runs and surface model bottlenecks. The Model timing dashboard displays model info, order, and run time for each job completed."
    link="/docs/deploy/dbt-cloud-job#model-timing"
    icon="pencil-paper"/> 
</div> <br />

 ***These features are available on [selected plans](https://www.getdbt.com/pricing/).**

## Related docs

- [dbt Cloud plans and pricing](https://www.getdbt.com/pricing/)
- [Quickstart guides](/docs/quickstarts/overview)
- [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)
- [dbt Cloud support](/docs/dbt-support)
- [Become a contributor](https://docs.getdbt.com/community/contribute)
