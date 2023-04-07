---
title: "dbt Cloud processes scheduled jobs more intelligently"
id: "scheduler-optimized"
description: "April 2023: "
sidebar_label: "Update: Scheduler optimizes job queue"
tags: [Apr-12-2023, scheduler]
---

The dbt Cloud Scheduler now prevents queue clog by canceling queued runs in excess of 50. The job queue can build up when the duration of a job run grows over time, usually caused by more data landing in your cloud warehouse. Once the run duration becomes longer than the frequency of the job’s schedule, runs start to queue, waiting for the long running job to finish. 

Previously, when you scheduled a job to run more frequently than it takes to complete a single run, the job queue would get backed up, and the scheduler couldn't process all the runs, so it would start canceling runs indiscriminately. You used to have to go into dbt Cloud to manually cancel all the queued runs and change the job schedule to "unclog" the scheduler queue.

The dbt Cloud scheduler now detects when a job is in this clogged state, and manages the queue to run more optimally -- providing a helpful message when the schedluer has taken action.
