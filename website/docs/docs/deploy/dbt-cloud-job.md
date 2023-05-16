---
title: "Deploy with dbt Cloud"
id: "dbt-cloud-job"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
tags: ["scheduler"]
---

When you [deploy dbt jobs](docs/deploy/deployments) with dbt Cloud, you are using the built-in scheduler. By design, the scheduler helps streamline your dbt project deployments and runs, keeps your data pipelines functioning seamlessly and efficiently, governs data through standardized code change practices, automates your dbt jobs, and enables teams to get results faster with less effort.

Running dbt in production eliminates the need to manually run dbt commands from the command line or set up an orchestration system. 

<div className="grid--2-col">

<Card
    title="Artifacts"
    body="dbt Cloud generates and saves artifacts for your project, which it uses to power features like creating docs for your project and reporting the freshness of your sources."
    link="/docs/deploy/artifacts"
    icon="pencil-paper"/>

<Card
    title="Job scheduler"
    body="Use the job scheduler so you can optimize your data transformation workflows, deploy dbt jobs easier, automate your dbt jobs, make code changes in a standardized and governed way, and more."
    link="/docs/deploy/job-scheduler"
    icon="pencil-paper"/>

<Card
    title="Job commands"
    body="Configure which dbt commands to execute when running a dbt job."
    link="/docs/deploy/job-commands"
    icon="pencil-paper"/>

<Card
    title="Job triggers"
    body="Set up triggers in dbt Cloud so it knows when to run your dbt job and how to run it. You can trigger a job by setting a schedule for it, through Git PRs using Slim CI, or from an API call."
    link="/docs/deploy/job-triggers"
    icon="pencil-paper"/>

<Card
    title="Job notifications"
    body="Set up to receive email or Slack channel notifications when a job run succeeds, fails, or is cancelled so you can respond to it quickly and proactively. "
    link="/docs/deploy/job-notifications"
    icon="pencil-paper"/>

<Card
    title="Source freshness"
    body="Enable snapshots to capture the freshness of your data sources and configure how frequent these snapshots should be taken. This can help you determine whether your source data freshness is meeting your SLAs."
    link="/docs/deploy/source-freshness"
    icon="pencil-paper"/>

<Card
    title="Webhooks for your jobs"
    body="Create outbound webhooks to send notifications about your dbt jobs to other systems in your organization. This helps trigger automation workflows you have set up."
    link="/docs/deploy/webhooks"
    icon="pencil-paper"/>

<Card
    title="Dashboard status tiles"
    body="Set up Dashboard status tiles so you can get a quick success/fail update on your checks, like data freshness and data quality. "
    link="/docs/deploy/dashboard-status-tiles"
    icon="pencil-paper"/>

<Card
    title="Slim CI job"
    body="Set up Slim CI so you can trigger dbt Cloud to run your job when you open PRs and push new commits."
    link="/docs/deploy/cloud-ci-job"
    icon="pencil-paper"/>

</div> <br />

## Related docs
- [Deploy dbt jobs](/docs/deploy/deployments)
- [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features)
