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
link="/docs/get-started/develop-in-the-cloud"
    icon="pencil-paper"/>

<Card
    title="Manage environments"
    body="Set up and manage separate production and development environments in dbt Cloud to help engineers develop and test code more efficiently, without impacting users or data."
    link="/docs/collaborate/environments"
    icon="pencil-paper"/>

  <Card
    title="Schedule and run dbt jobs"
    body="Set up custom schedules to run your production jobs. Schedule jobs by day of the week, time of day, or a recurring interval. Decrease operating costs by using webhooks to trigger CI jobs and the API to start jobs."
    link="/docs/get-started/getting-started/building-your-first-project/schedule-a-job"
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
    body="dbt Cloud makes it easy to view and download in-progress and historical logs for your dbt runs, making it easy for anyone on the team to debug errors more efficiently."
    link="/docs/get-started/develop-in-the-cloud#build-compile-and-run-projects"
    icon="pencil-paper"/>      

   <Card
    title="Supports GitHub, GitLab, AzureDevOPs"
    body="Seamlessly connect your git account to dbt Cloud and provide another layer of security to dbt Cloud. Import new repositories, trigger continuous integration, clone repos using HTTPS, and more!"
    link="/docs/collaborate/git/connect-github"
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
    body="Use the Metadata API to enhance your workflow and run ad-hoc queries, browse schema, or query the dbt Semantic Layer. dbt Cloud serves a GraphQL API, which supports arbitrary queries."
    link="/docs/dbt-cloud-apis/metadata-api"
    icon="pencil-paper"/> 


<Card
    title="Model timing dashboard*"
    body="The Model timing dashboard visualizes and lets you explore your run and surface model bottlenecks. The dashboard shows model info, order, and run time for each job completed. The display only appears for successfully completed jobs, and the top 1% of model times are highlighted. Access the dashboard on the Run Overview page in dbt Cloud."
    link="/docs/dbt-versions/release-notes/January-2022/model-timing-more"
    icon="pencil-paper"/> 
</div> <br />

 ***These features are available on [select plans](https://www.getdbt.com/pricing/).**

## Related questions

<details>
  <summary>How can I contribute to dbt Cloud?</summary>
  <div>
    <div>Anyone can contribute to the dbt project. And whether it's a dbt package, a plugin, dbt-core, or this documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. See <a href="https://docs.getdbt.com/community/resources/oss-expectations">Contributing</a> for details on what to expect when contributing to the dbt open source software (OSS). </div>
  </div>
</details>
<details>
  <summary>What type of support is provided with dbt Cloud?</summary>
  <div>
    <div>The global dbt Support team is available to dbt Cloud customers by email or in-product live chat. Developer and Team accounts offer 24x5 support, while Enterprise customers have priority access and options for custom coverage. <br></br><br></br>Additionally, Enterprise plan customers receive implementation assistance, dedicated account management, and a dbt Labs Security and Legal review. <br></br><br></br> If you have project-related or modeling questions, review <a href="https://docs.getdbt.com/docs/dbt-cloud/cloud-dbt-cloud-support">our Support page</a> or <a href="http://getdbt.slack.com/">dbt Community Slack</a> to get help as well. </div>
  </div>
</details>


## Related docs

- [dbt Cloud plans and pricing](https://www.getdbt.com/pricing/)
- [Get started guides](/docs/get-started/getting-started/set-up-dbt-cloud)
- [Develop in the Cloud](/docs/get-started/develop-in-the-cloud)
