---
title: "Deploy with dbt Cloud"
id: "dbt-cloud-job"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
hide_table_of_contents: true
tags: ["scheduler"]
---

dbt Cloud offers the easiest way to run your dbt project in production. <Term id="deploying">Deploying</Term> with dbt Cloud lets you:
- Keep production data fresh on a timely basis
- Ensure CI and production pipelines are efficient
- Identify the root cause of failures in deployment environments
- Maintain high quality code and data in production
- Gain visibility into the health of deployment jobs, models, and tests

Learn more about the features you can use in dbt Cloud to help your team ship timely, quality production data more easily.

<div className="grid--2-col">

<Card
    title="Artifacts"
    body="dbt Cloud generates and saves artifacts for your project, which it uses to power features like creating docs for your project and reporting the freshness of your sources."
    link="/docs/deploy/artifacts"
    icon="pencil-paper"/>

<Card
    title="Job scheduler"
    body="The job scheduler is the backbone of running jobs in dbt Cloud, bringing power and simplicity to building data pipelines in both continuous integration and production environments."
    link="/docs/deploy/job-scheduler"
    icon="pencil-paper"/>

<Card
    title="Job settings"
    body="Create and schedule jobs for the dbt Cloud scheduler to run."
    link="/docs/deploy/job-settings"
    icon="pencil-paper"/>

<Card
    title="Job commands"
    body="Configure which dbt commands to execute when running a dbt job."
    link="/docs/deploy/job-commands"
    icon="pencil-paper"/>

<Card
    title="Job triggers"
    body="Set up a cron-based schedule or an event-driven trigger by API or on pull requests for CI jobs."
    link="/docs/deploy/job-triggers"
    icon="pencil-paper"/>

<Card
    title="Job notifications"
    body="Receive email or Slack channel notifications when a job run succeeds, fails, or is canceled so you can respond quickly and begin remediation if necessary."
    link="/docs/deploy/job-notifications"
    icon="pencil-paper"/>

<Card
    title="Run visibility"
    body="View the history of your runs and the model timing dashboard to help identify where improvements can be made to the scheduled jobs."
    link="/docs/deploy/run-visibility"
    icon="pencil-paper"/>

<Card
    title="Source freshness"
    body="Enable snapshots to capture the freshness of your data sources and configure how frequent these snapshots should be taken. This can help you determine whether your source data freshness is meeting your SLAs."
    link="/docs/deploy/source-freshness"
    icon="pencil-paper"/>

<Card
    title="Webhooks for your jobs"
    body="Create outbound webhooks to send events about your dbt jobs' statuses to other systems in your organization."
    link="/docs/deploy/webhooks"
    icon="pencil-paper"/>

<Card
    title="Dashboard status tiles"
    body="Set up status tiles to see the data freshness and quality checks whenever you view your data. "
    link="/docs/deploy/dashboard-status-tiles"
    icon="pencil-paper"/>

<Card
    title="Continuous integration"
    body="Set up Slim CI checks so you can build and test any modified code in a staging environment when you open PRs and push new commits to your dbt repository."
    link="/docs/deploy/continuous-integration"
    icon="pencil-paper"/>

</div> <br />
