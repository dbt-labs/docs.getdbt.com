---
title: "dbt Cloud jobs"
id: "dbt-cloud-job"
description: "Manage, setup, and configure your dbt Cloud job using elegant job commands and triggers."
hide_table_of_contents: true
tags: ["scheduler"]
---

Manage, set up, and automate your dbt jobs with robust control over job settings and execution in production. You can use the job scheduler to configure when and how your jobs run. 

Managing your jobs with dbt Cloud allows you to:

- [Create and schedule jobs](/docs/deploy/job-settings) &mdash; Intuitively navigate the user interface to create new dbt jobs or edit existing ones.
- [Setup job commands](/docs/deploy/job-commands) &mdash; Use job commands to configure dbt commands on a schedule.
- [Configure job triggers](/docs/deploy/job-triggers) &mdash; You can configure when and how dbt should run your job, including:
	* Running on scheduled days or cron schedule, 
	* Setting up continuous integration (CI) to run when someone opens a new pull request in your dbt repository
	* Using the API to trigger jobs.  

To learn more about how to configure and manage your dbt jobs in dbt Cloud, read the docs in this section.

<DocCarousel slidesPerView={1}>

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="75%" title="Setting up a job and configuring checkbox and dbt commands"/>

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>

</DocCarousel>
