---
title: "About dbt Cloud"
id: "cloud-overview"
---


[dbt Cloud](https://www.getdbt.com/product/) is a hosted service that helps data analysts and engineers productionize dbt deployments. It comes equipped with turnkey support for scheduling jobs, CI/CD, serving documentation, monitoring & alerting, and an Integrated Developer Environment (IDE).

dbt Cloud’s generous Developer (free) plan and deep integration with dbt Core make it well suited for data teams small and large alike.  

You can get started with dbt Cloud by [Signing up](https://www.getdbt.com/signup/).


## Develop dbt projects

Using the [dbt IDE](the-dbt-ide), you can develop, run, and version control dbt projects on the web.

<LoomVideo id="05f9c34b17c74c97b98286683dafd420" />

## Schedule and run dbt jobs in production

Set up custom schedules to run your production dbt jobs. dbt Cloud's comprehensive scheduling interface makes it possible to schedule jobs by day of week, time of day, or a recurring interval.

<Lightbox src="/img-next/docs/dbt-cloud/28f97e6-job-schedule.gif" title="Scheduling jobs with dbt Cloud"/>

## Democratize access to logs

dbt Cloud makes it easy to view in-progress and historical logs for your dbt runs. From Cloud's web interface, you can view and download the run logs for your dbt invocations. If you're happy ssh'ing into a cron server and running `tail -f` on a logfile, then this feature is *not* for you!

<Lightbox src="/img-next/docs/dbt-cloud/c3fe800-Screen_Shot_2019-02-08_at_6.53.29_PM.png" title="Viewing logs for a dbt run"/>

## Generate and distribute documentation

dbt Cloud hosts and authorizes access to dbt project documentation. After enabling documentation for a given job, you can click the "View Documentation" button to see the latest documentation for that job. Because these docs are generated on a schedule, they're always up to date! Simply invite your coworkers to dbt Cloud to share your project's documentation with the rest of your team. More info about enabling docs for your jobs can be found [here](cloud-generating-documentation).

<Lightbox src="/img-next/docs/dbt-cloud/b4f242f-view-docs.gif" title="Viewing documentation in dbt Cloud"/>

## Enable Continuous Integration 

:::info Available on the Basic Tier

Continuous Integration functionality is available to accounts on the Basic Tier or higher.

:::

dbt Cloud can be configured to run your dbt projects in a temporary schema when new commits are pushed to open Pull Requests. When the Cloud job completes, a status will be shown for the PR inside of GitHub. This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool in any analysts belt. More info on enabling CI workflows in dbt Cloud can be found [here](cloud-enabling-continuous-integration).

<Lightbox src="/img-next/docs/dbt-cloud/813b88c-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title=""/>
