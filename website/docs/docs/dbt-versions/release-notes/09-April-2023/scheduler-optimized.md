---
title: "The dbt Cloud scheduler now prevents queue clog by canceling unnecessary runs of over-scheduled jobs"
id: "scheduler-optimized"
description: "April 2023: "
sidebar_label: "Update: Scheduler optimizes job queue"
tags: [Apr-12-2023, scheduler]
---

The dbt Cloud Scheduler now prevents queue clog by canceling unnecessary runs of over-scheduled jobs. 

The duration of a job run tends to grow over time, usually caused by growing amounts of data in the warehouse. If the run duration becomes longer than the frequency of the job’s schedule, the queue will grow faster than the scheduler can process the job’s runs, leading to a runaway queue with runs that don’t need be processed.

Previously, when a job was in this over-scheduled state, the Scheduler would stop queuing runs after 50 were already in queue. This led to a bad experience in which runs indiscriminately were canceled, and a user would have to go into dbt Cloud to manually cancel all the queued runs and change the job schedule to "unclog" the scheduler queue.

Now, the dbt Cloud Scheduler detects when a scheduled job is set to run too frequently and appropriately cancels runs that don’t need to be processed. Specifically, scheduled jobs can only ever have one run of the job in queue, and if a more recent run gets queued, the early queued run will get canceled with a helpful error message. Users will still need to either refactor the job so it runs faster or change the job schedule to run less often if the job often gets into an over-scheduled state.
