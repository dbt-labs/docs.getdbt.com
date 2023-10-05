---
title: "Enhancement: Faster run starts and unlimited job concurrency"
description: "We have enhanced the dbt Cloud Scheduler by reducing prep time for all accounts and provided unlimited job concurrency for Enterprise accounts."
sidebar_label: "Enhancement: Faster run starts and unlimited job concurrency"
tags: [July-2023, scheduler]
date: 2023-07-06
sidebar_position: 10
---

We’ve introduced significant improvements to the dbt Cloud Scheduler, offering improved performance, durability, and scalability. 

Read more on how you can experience faster run start execution and how enterprise users can now run as many jobs concurrently as they want to.

## Faster run starts

The Scheduler takes care of preparing each dbt Cloud job to run in your cloud data platform. This [prep](/docs/deploy/job-scheduler#scheduler-queue) involves readying a Kubernetes pod with the right version of dbt installed, setting environment variables, loading data platform credentials, and git provider authorization, amongst other environment-setting tasks. Only after the environment is set up, can dbt execution begin. We display this time to the user in dbt Cloud as “prep time”.

<Lightbox src="/img/run-start.jpg" width="85%" title="The scheduler prepares a job for execution and displays it as 'prep time' in dbt Cloud."/>

For all its strengths, Kubernetes has challenges, especially with pod management impacting run execution time. We’ve rebuilt our scheduler by ensuring faster job execution with a ready pool of pods to execute customers’ jobs. This means you won't experience long prep times at the top of the hour, and we’re determined to keep runs starting near instantaneously. Don’t just take our word, review the data yourself.

<Lightbox src="/img/prep-start.jpg" width="85%" title="Job prep time data has seen a 75% speed improvement from Jan 2023 to July 2023. Prep time took 106 secs in Jan and now takes 27 secs as of July."/>

Jobs scheduled at the top of the hour used to take over 106 seconds to prepare because of the volume of runs the scheduler has to process. Now, even with increased runs, we have reduced prep time to 27 secs (at a maximum) &mdash; a 75% speed improvement for runs at peak traffic times!

## Unlimited job concurrency for Enterprise accounts

Our enhanced scheduler offers more durability and empowers users to run jobs effortlessly. 

This means Enterprise, multi-tenant accounts can now enjoy the advantages of unlimited job concurrency. Previously limited to a fixed number of run slots, Enterprise accounts now have the freedom to operate without constraints. Single-tenant support will be coming soon. Team plan customers will continue to have only 2 run slots. 

Something to note, each running job occupies a run slot for its duration, and if all slots are occupied, jobs will queue accordingly. 

For more feature details, refer to the [dbt Cloud pricing page](https://www.getdbt.com/pricing/).
