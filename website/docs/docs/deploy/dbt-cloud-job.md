---
title: "dbt Cloud jobs"
id: "dbt-cloud-job"
description: "Manage, setup, and configure your dbt Cloud job using elegant job commands and triggers."
hide_table_of_contents: true
tags: ["scheduler"]
---

Manage, set up, and automate your dbt jobs using robust custom job settings. You can use the job scheduler to configure when and how your jobs run, helping you keep production data fresh on a timely basis.

This portion of our documentation will go dbt Cloud's various job settings, including:

- [Job settings](/docs/deploy/job-settings) &mdash; Intuitively navigate the user interface to create new dbt jobs or edit existing ones.
- [Job commands](/docs/deploy/job-commands) &mdash; Use job commands to configure dbt commands on a schedule.
- [Job triggers](/docs/deploy/job-triggers) &mdash; You can configure when and how dbt should run your job, including:
	* Running on scheduled days or cron schedule, 
	* Setting up continuous integration (CI) to run when someone opens a new pull request in your dbt repository
	* Using the API to trigger jobs.  

<DocCarousel slidesPerView={1}>

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="75%" title="Setting up a job and configuring checkbox and dbt commands"/>

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>

</DocCarousel>
